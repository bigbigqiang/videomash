class AudioSource {
    constructor(audioContext, audioBuffer, gain, startTime, offsetTime, durationTime) {
        this.audioContext = audioContext
        this.gainNode = null
        this.gain = gain
        this.startTime = startTime
        this.offsetTime = offsetTime
        this.durationTime = durationTime
        this.bufferSource = null
        this.audioBuffer = audioBuffer
    }

    createGainNode() {
        this.gainNode = this.audioContext.value.createGain()
    }

    createBufferSource(buffer) {
        this.bufferSource = this.audioContext.value.createBufferSource()
        this.bufferSource.buffer = buffer
        this.bufferSource.loop = false
        this.bufferSource.onended = () => {
            console.log('onended')
            this.bufferSource = null
        }
    }

    stop() {
        this.bufferSource.stop()
    }

    start(second) {
        if (second > this.startTime + this.durationTime) return
        this.createGainNode()
        this.createBufferSource(this.audioBuffer)
        this.bufferSource.connect(this.gainNode)
        this.gainNode.connect(this.audioContext.value.destination)
        this.setVolume(this.gain)
        let startTime = 0
        let { offsetTime } = this
        let { durationTime } = this
        if (second < this.startTime) {
            startTime = this.startTime - second
        }

        if (second >= this.startTime) {
            startTime = 0
            offsetTime = second - this.startTime
            durationTime = durationTime - second + this.startTime
        }
        this.bufferSource.start(startTime, offsetTime, durationTime)
    }

    /**
    * 改变音量
    * 0-100
    */

    setVolume(value) {
        this.gainNode.gain.value = value / 50
    }
}

class AudioController {
    constructor(sources, fps) {
        this.sources = sources
        this.isStop = true
        this.fps = fps || 10
        this.audioMap = new Map()
        this.audioSources = []
        this.audioContext = { value: new (window.AudioContext || window.webkitAudioContext)() }
    }

    updateAudioContext() {
        this.audioContext.value = new (window.AudioContext || window.webkitAudioContext)()
    }

    decodeAudioData(url) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest()
            request.open('GET', url, true)
            request.responseType = 'arraybuffer'
            request.onload = () => {
                this.audioContext.value.decodeAudioData(request.response, (buffer) => {
                    if (!buffer) {
                        reject(new Error(`error decoding file data: ${url}`))
                    } else {
                        this.audioMap.set(url, buffer)
                        resolve(buffer)
                    }
                })
            }
            request.onerror = () => {
                reject(new Error('BufferLoader: XHR error'))
            }
            request.send()
        })
    }

    loadAudioSources() {
        const loaders = []
        this.sources.forEach(item => {
            const {
                audioUrl
            } = item
            if (!this.audioMap.has(audioUrl)) {
                this.audioMap.set(audioUrl, 'Placeholder')
                loaders.push(this.decodeAudioData(audioUrl))
            }
        })
        return Promise.all(loaders).then(() => {
            this.createAudioSources()
            return 'LOAD_SUCCESS'
        }).catch((e) => { console.error(e) })
    }

    createAudioSources() {
        this.sources.forEach(item => {
            const {
                audioUrl, gain, frame, frames, trim
            } = item
            const startTime = frame / this.fps
            const durationTime = frames / this.fps
            const offsetTime = trim / this.fps
            if (this.audioMap.has(audioUrl)) {
                const audioBuffer = this.audioMap.get(audioUrl)
                this.audioSources.push(new AudioSource(this.audioContext, audioBuffer, gain, startTime, offsetTime, durationTime))
            }
        })
    }

    play(second) {
        this.updateAudioContext()
        this.audioSources.forEach(item => {
            item.start(second)
        })
    }

    stop() {
        this.audioSources.forEach(item => {
            item.stop()
        })
    }
}

class VideoMasher {
    constructor(option) {
        const {
            canvas, tracks, fps, onReady
        } = option
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.tracks = tracks
        this.isReady = false
        this.fps = fps || 10
        this.audioContext = { value: null }
        this.audioController = null
        this.currentTime = 0
        this.duration = 0
        this.onReady = onReady
        this.audioSources = new Map()
        this._init()
    }

    async _init() {
        const { tracks } = this
        this.isReady = false
        const audioData = []
        const videoData = []
        if (tracks && tracks.font && tracks.font.clips && tracks.font.clips.length) {
            const fontLoaded = await this._registerFont()
            if (!fontLoaded) {
                return
            }
        }
        if (tracks && tracks.audio && tracks.audio.length) {
            const list = tracks.audio.reduce((res, item) => {
                if (item && item.clips && item.clips.length) {
                    res.push(...item.clips)
                }
                return res
            }, [])
            audioData.push(...list)
        }

        if (tracks && tracks.video && tracks.video.length) {
            const list = tracks.video.reduce((res, item) => {
                if (item && item.clips && item.clips.length) {
                    res.push(...item.clips)
                }
                return res
            }, [])
            audioData.push(...list)
            videoData.push(...list)
        }
        if (audioData.length) {
            const audioLoaded = await this._registerAudio(audioData)
            if (!audioLoaded) {
                return
            }
        }
        if (videoData.length) {
            const imagesLoaded = await this._cacheImages(videoData)
            if (!imagesLoaded) {
                return
            }
        }
        this.isReady = true
        this._onReady()
    }

    _registerAudio(audioData) {
        this.audioController = new AudioController(audioData, this.fps)
        return this.audioController.loadAudioSources()
    }

    _registerFont(fontSources) {
        const loaders = []
        fontSources.forEach(item => {
            const { fontFamily, fontSource } = item
            const font = new FontFace(
                fontFamily,
                `url(${fontSource})`
            )
            loaders.push(font.load())
        })
        return Promise.all(loaders).then(fonts => {
            fonts.forEach(item => {
                document.fonts.add(item)
            })
            return 'LOAD_SUCCESS'
        }).catch((e) => { console.error(e) })
    }

    _getPeriodImages(startSecond, endSecond) {
        console.log(startSecond, endSecond)
    }

    _cacheImages() {
        return Promise.resolve(true)
    }

    setTracks(tracks) {
        this.tracks = tracks
        this._init()
    }

    draw(time) {
        console.log(time)
    }

    _onReady() {
        this.onReady()
    }

    play() {
        this.audioController.play(this.currentTime / 1000)
    }

    stop() {
        this.audioController.stop()
    }

    setGlobalVolume(value) {
        console.log(value)
    }
}

export default VideoMasher
