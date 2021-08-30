<template>
    <div>
        <canvas id="canvas"
                height="360"
                width="540"></canvas>
        <p style="font-family: 'SimHei';">
            撒撒旦艰苦哈利可是到后来卡激活
        </p>
        <button @click="play">
            开始
        </button>
    </div>
</template>
<script>

import Videomasher from './videomasher'
import Tracks from './tracks'

export default {
    data() {
        return {
            info: {},
            videomasher: null
        }
    },
    mounted() {
        const canvas = document.getElementById('canvas')
        // const ctx = canvas.getContext('2d')
        // let angle = 0
        // function rotate90(imgUrl) {
        //     return new Promise(((resolve, reject) => {
        //         try {
        //             // 1. 创建图片，canvas,获取画布
        //             const img = new Image()
        //             img.src = imgUrl
        //             // 2. 图片加载完成进行图片编辑
        //             img.onload = () => {
        //                 setInterval(() => {
        //                     ctx.clearRect(0, 0, canvas.width, canvas.height)
        //                     ctx.translate(canvas.width / 2, canvas.height / 2)
        //                     ctx.rotate(angle * Math.PI / 180)
        //                     ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, img.width, img.height)
        //                     angle += 1
        //                     ctx.setTransform(1, 0, 0, 1, 0, 0)
        //                 }, 40)
        //             }
        //         } catch (error) {
        //             reject(error)
        //         }
        //     }))
        // }
        // rotate90('http://192.168.13.12:8083/media/imports/60ebd4c10c01382a0e3231d1/540x360x10/0673.jpg', 'jpg')
        this.videomasher = new Videomasher({
            canvas,
            tracks: Tracks,
            onReady: this.onReady
        })
    },
    methods: {
        play() {
            this.videomasher.play()
        },
        onReady() {
            console.log('onReady')
            console.log(this.videomasher)
        }
    }
}
</script>
