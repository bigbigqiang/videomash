/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/**
 * 获取窗口图像
 */
class Util {
    getWindowImage(style, windows, screenWidth, screenHeight) {
        const el = document.createElement('canvas')
        let ctx2d = el.getContext('2d')
        if (!ctx2d) return null
        const padding = style.padding || 0
        const width = style.width + padding * 2
        const height = style.height + padding * 2
        el.setAttribute('width', `${width}`)
        el.style.width = `${width}px`
        el.setAttribute('height', `${height}`)
        el.style.height = `${height}px`
        const widthScale = style.width / screenWidth
        const heightScale = style.height / screenHeight
        const zoom = Math.min(widthScale, heightScale)
        const x = (style.width - screenWidth * zoom) / 2
        const y = (style.height - screenHeight * zoom) / 2
        ctx2d.transform(zoom, 0, 0, zoom, x + padding, y + padding)
        const children = windows
        let lineWidth = style.lineWidth || 1
        lineWidth /= zoom
        if (children) {
            if (style.background) {
                ctx2d.fillStyle = style.background || '#fff'
            }
            if (style.shadow) {
                const {
                    hShadow, vShadow, blur, color
                } = style.shadow
                ctx2d.shadowColor = color || 'rgba(0, 0, 0, 0.19)'
                ctx2d.shadowBlur = blur || 10
                if (hShadow !== 0) {
                    ctx2d.shadowOffsetX = hShadow || 0
                }
                if (vShadow !== 0) {
                    ctx2d.shadowOffsetY = vShadow || 0
                }
            }
            children.forEach(item => {
                const x = item.x + lineWidth
                const y = item.y + lineWidth
                const width = item.width - lineWidth
                const height = item.height - lineWidth
                if (style.linearGradient) {
                    const {
                        x0, x1, y0, y1, color0, color1
                    } = style.linearGradient
                    const grd = ctx2d.createLinearGradient(x0 || 0, x1 || 0, y0 || 0, y1 || height)
                    grd.addColorStop(0, color0 || '#ffffff')
                    grd.addColorStop(1, color1 || '#ffffff')
                    ctx2d.fillStyle = grd
                }
                ctx2d.fillRect(x, y, width, height)
            })
        }
        ctx2d.restore()
        ctx2d = null
        return el.toDataURL('image/png')
    }
}
const WindowUtil = new Util()
export default WindowUtil
