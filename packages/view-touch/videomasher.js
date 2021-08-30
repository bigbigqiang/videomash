import { Map } from 'core-js'
import LinkedList from './LinkedList'

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
            console.log('on_audio_clip_ended')
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

    loadAudioSources(callback) {
        let duration = 0
        const loaders = []
        this.sources.forEach(item => {
            const {
                audioUrl, frame, frames
            } = item
            const allTime = (frame + frames) * (1000 / this.fps)
            if (allTime > duration) {
                duration = allTime
            }
            if (!this.audioMap.has(audioUrl)) {
                this.audioMap.set(audioUrl, 'Placeholder')
                loaders.push(this.decodeAudioData(audioUrl))
            }
        })
        return Promise.all(loaders).then(() => {
            this.createAudioSources()
            typeof callback === 'function' && callback(duration)
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
        this.isPause = true
        this.fps = fps || 10
        this.bufferNum = 100
        this.audioContext = { value: null }
        this.audioController = null
        this.currentTime = 0
        this.startTime = 0
        this.duration = 0
        this.T = null
        this.onReady = onReady
        this.imageMap = new Map()
        this.nextImageMap = new Map()
        this.linkedList = new LinkedList()
        this._init()
    }

    async _init() {
        const { tracks } = this
        this.isReady = false
        const audioData = []
        const videoData = []
        if (tracks && tracks.font && tracks.font.length) {
            const list = tracks.font.reduce((res, item) => {
                if (item && item.clips && item.clips.length) {
                    res.push(...item.clips)
                }
                return res
            }, [])
            const fontLoaded = await this._registerFont(list, this.updateDuration)
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
            this.audioClips = audioData
            const audioLoaded = await this._registerAudio(audioData)
            if (!audioLoaded) {
                return
            }
        }
        if (videoData.length) {
            this.videoClips = videoData
            const imagesLoaded = await this._cacheImages(1, 1)
            if (!imagesLoaded) {
                return
            }
        }
        this.isReady = true
        this.draw(1)
        this._onReady()
    }

    updateDuration = (duration) => {
        if (duration > this.duration) {
            this.duration = duration
        }
    }

    _registerAudio(audioData) {
        this.audioController = new AudioController(audioData, this.fps)
        return this.audioController.loadAudioSources(this.updateDuration)
    }

    _registerFont(fontSources, callback) {
        const loaders = []
        let duration = 0
        fontSources.forEach(item => {
            const {
                fontFamily, fontSource, frame, frames
            } = item
            const font = new FontFace(
                fontFamily,
                `url(${fontSource})`
            )
            const allTime = (frame + frames) * (1000 / this.fps)
            if (allTime > duration) {
                duration = allTime
            }
            loaders.push(font.load())
        })
        return Promise.all(loaders).then(fonts => {
            fonts.forEach(item => {
                document.fonts.add(item)
            })
            typeof callback === 'function' && callback(duration)
            return 'LOAD_SUCCESS'
        }).catch((e) => { console.error(e) })
    }

    _cacheImages(startFrame, endFrame) {
        const loaders = []
        this.videoClips.forEach(item => {
            const { frame, frames } = item
            if (frame >= startFrame && frame <= endFrame) {
                let i = frame
                while (i <= endFrame) {
                    loaders.push(this.loadImage(this._getImageUrl(item, i)))
                    i += 1
                }
            }
            if (frame < startFrame && frame + frames >= startFrame) {
                let i = startFrame
                while (i <= frame + frames) {
                    loaders.push(this.loadImage(this._getImageUrl(item, i)))
                    i += 1
                }
            }
        })
        return Promise.all(loaders).then(() => 'LOAD_SUCCESS').catch((e) => {
            this.pause()
            console.error(e)
        })
    }

    _getImageUrl(item, i) {
        return `${item.url}${this.PrefixInteger(i, this._getDigit(item))}.jpg`
    }

    _getDigit(item) {
        const { duration } = item
        return Math.floor(Number(duration) * this.fps).toString().length
    }

    PrefixInteger(num, digitNum) {
        return (Array(digitNum).join(0) + num).slice(-digitNum)
    }

    loadImage(imgUrl) {
        return new Promise((resolve, reject) => {
            if (this.nextImageMap.has(imgUrl)) {
                resolve(this.nextImageMap.get(imgUrl))
                return
            }
            const img = new Image()
            img.src = imgUrl
            img.onload = () => {
                this.nextImageMap.set(imgUrl, img)
                resolve(img)
            }
            img.onerror = (e) => {
                reject(e)
            }
        })
    }

    setTracks(tracks) {
        this.tracks = tracks
        this._init()
    }

    async drawVideoClip(clip, currentFrame) {
        const imageUrl = this._getImageUrl(clip, currentFrame)
        const { ctx, canvas, imageMap } = this
        let img = imageMap.get(imageUrl)
        if (!img) {
            img = await this.loadImage(imageUrl)
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height)
        // imageMap.delete(imageUrl)
    }

    _onReady() {
        this.onReady && typeof this.onReady === 'function' && this.onReady()
    }

    draw(currentFrame) {
        this.videoClips.forEach(item => {
            const { frame, frames } = item
            if (currentFrame >= frame && currentFrame <= frame + frames) {
                this.drawVideoClip(item, currentFrame)
            }
        })
    }

    videoPlay() {
        const { fps, duration, bufferNum } = this
        const interval = 1000 / fps
        const helfCacheTime = (bufferNum / 2) * interval
        this.startTime = this.currentTime
        this.currentTime += interval
        this.T = setInterval(() => {
            if (this.currentTime >= duration) {
                console.log('onend')
                this.pause()
            }
            if (this.currentTime % helfCacheTime === 0) {
                this.preloadImage(this.currentTime + helfCacheTime)
            }
            if (this.currentTime % (2 * helfCacheTime) === 0) {
                this._supply()
            }
            this.draw(this.currentTime / interval)
            this.currentTime += interval
        }, interval)
    }

    pause() {
        this.isPause = true
        if (this.T) {
            clearInterval(this.T)
            this.T = null
        }
    }

    async preloadImage(cacheStartTime) {
        const { fps, duration, bufferNum } = this
        const interval = 1000 / fps
        const cacheStartFrame = cacheStartTime ? cacheStartTime / interval : this.currentTime / interval
        let cacheEndFrame = cacheStartFrame + bufferNum - 1
        if (duration / interval < cacheEndFrame) {
            cacheEndFrame = duration / interval
        }
        const imagesLoaded = await this._cacheImages(cacheStartFrame, cacheEndFrame)
        return imagesLoaded
    }

    _supply() {
        this.imageMap = this.nextImageMap
        this.nextImageMap = this.nextImageMap.clear()
    }

    async play() {
        const imagesLoaded = await this.preloadImage()
        if (!imagesLoaded) return
        this.isPause = false
        this.audioController.play(this.currentTime / 1000)
        this._supply()
        this.videoPlay()
    }

    setCurrentTime(currentTime) {
        this.currentTime = Math.round(currentTime / (1000 / this.fps)) * (1000 / this.fps)
        this.draw(this.currentTime / (1000 / this.fps))
    }

    stop() {
        this.audioController.stop()
    }

    setGlobalVolume(value) {
        console.log(value)
    }
}

export default VideoMasher
