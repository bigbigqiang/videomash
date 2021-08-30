import { NoCanvasModel } from '@digibird/visual-components'

Event.prototype.setData = data => {
    Event.prototype.customData = data
}

Event.prototype.getData = () => {
    const data = Event.prototype.customData
    Event.prototype.customData = null
    return data
}

export default class Drag {
    static model = null

    static modelId = null

    static timeIndex = 0

    static modelSize = {
        width: 0,
        height: 0
    }

    static move = (event) => {
        Drag.dragMove(event)
    }

    static end = (event) => {
        Drag.dragEnd(event)
    }

    static downPoint = { x: 0, y: 0 }

    static preModel = null

    static isMove = false

    static longPress = true

    /**
     * 默认支持长按
     * @event
     * @customNode
     * @data
     * @preModelData
     * @longPress
     */
    static dragStart(event, customNode, data, preModelData, longPress = true) {
        Drag.longPress = longPress
        if (document.getElementById(this.modelId)) {
            document.getElementById(this.modelId).remove()
        }
        event.setData(null)
        if (event.button !== undefined && event.button !== 0) return
        this.model = null
        const element = customNode && customNode.el ? customNode.el : event.currentTarget
        const targetClone = element.cloneNode(true)

        const computedStyle = document.defaultView.getComputedStyle(element, null)
        targetClone.style.width = computedStyle.width
        targetClone.style.height = computedStyle.height
        targetClone.style.fontSize = computedStyle.fontSize

        if (customNode) {
            if (customNode.className) {
                targetClone.classList.add(customNode.className)
            }
            if (customNode.style) {
                Object.assign(targetClone.style, customNode.style)
            }
        }

        if (!element) return

        const {
            width, height, left, top
        } = element.getBoundingClientRect()

        document.addEventListener('pointermove', this.move, false)
        document.addEventListener('pointerup', this.end, false)
        targetClone.style.margin = '0'
        targetClone.style.top = '0px'
        targetClone.style.left = '0px'
        targetClone.style.padding = '0'
        if (preModelData) {
            const canvasEl = targetClone.getElementsByTagName('canvas')[0]
            if (canvasEl) {
                canvasEl.width = width
                canvasEl.height = height
                canvasEl.style.width = width
                canvasEl.style.height = height
                const ctx = canvasEl.getContext('2d')
                Drag.preModel = new NoCanvasModel({
                    ctx,
                    width,
                    height,
                    ...preModelData
                })
            }
        }
        this.model = document.createElement('div')
        this.model.id = `${new Date().getTime()}`
        this.modelId = this.model.id

        this.modelSize.width = width
        this.modelSize.height = height
        this.model.style.cssText = `position: absolute; left: ${left + 10}px; top: ${top + 10}px;z-index:9999;user-select: none;pointer-events: none;`
        Drag.downPoint = {
            x: event.clientX,
            y: event.clientY
        }
        if (!Drag.longPress) {
            Drag.isMove = false
            if (this.model) {
                this.model.append(targetClone)
                document.body.append(this.model)
            }
            if (data !== undefined) {
                event.setData(data)
            }
            const evt = new CustomEvent('scrollbar-move')
            window.dispatchEvent(evt)
            return
        }
        clearTimeout(Drag.timeIndex)
        Drag.isMove = false
        Drag.timeIndex = setTimeout(() => {
            Drag.isMove = true
            const evt = new CustomEvent('scrollbar-move')
            window.dispatchEvent(evt)
            if (this.model) {
                this.model.append(targetClone)
                document.body.append(this.model)
            }
            if (data !== undefined) {
                event.setData(data)
            }
        }, 100)
    }

    static dragMove(event) {
        const diffX = event.clientX - Drag.downPoint.x
        const diffY = event.clientY - Drag.downPoint.y
        if ((Math.abs(diffX) >= 5 || Math.abs(diffY) >= 5) && !Drag.isMove && Drag.longPress) {
            clearTimeout(Drag.timeIndex)
            return
        }
        if (!this.model) return
        const x = event.clientX - this.modelSize.width / 2
        const y = event.clientY - this.modelSize.height / 2
        this.model.style.display = 'block'
        this.model.style.left = `${x}px`
        this.model.style.top = `${y}px`
    }

    static dragEnd(event) {
        if (Drag.longPress) clearTimeout(Drag.timeIndex)
        if (!this.model || !event.isPrimary) return
        document.removeEventListener('pointermove', this.move)
        document.removeEventListener('pointerup', this.end)
        if (Drag.preModel && Drag.preModel.destroy) {
            Drag.preModel.destroy()
        }
        this.model.remove()
        if (event && event.setData) {
            event.setData(null)
        }
        this.modelSize.width = 0
        this.modelSize.height = 0
        this.model = null
    }
}
