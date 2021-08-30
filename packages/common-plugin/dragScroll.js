const isFunc = obj => typeof obj === 'function'
/**
 * 拖拽滚动
 *
 * @class DragScroll
 */
class DragScroll {
    constructor(el, option) {
        this.element = el
        this.setOption(option)
        this.start = null
        this.interval = 50
        this.preInterval = Date.now()
    }

    setOption({
        scrollEl, filter = '', direction, onStart, onMove, onEnd, customScroll
    }) {
        this.scrollEl = scrollEl || this.element
        this.filter = isFunc(filter) ? filter : (
            e => !filter || !e.target.closest(filter)
        )
        this.direction = direction
        const noop = () => { }
        this.onStart = onStart || noop
        this.onMove = onMove || noop
        this.onEnd = onEnd || noop
        this.customScroll = customScroll
    }

    ready = e => {
        const {
            button, clientX, clientY
        } = e
        if (button !== 0) return
        if (this.filter(e)) {
            this.start = {
                clientX,
                clientY
            }
            this.onStart(e)
        }
    }

    processScroll(e, xl, yl) {
        if (this.customScroll) {
            this.customScroll(e, xl, yl)
            return
        }
        // 反向乘数
        const reverse = this.direction.reverse ? -1 : 1
        if (this.direction.x) {
            this.scrollEl.scrollLeft += xl * reverse
        }

        if (this.direction.y) {
            this.scrollEl.scrollTop += yl * reverse
        }
    }

    moving = e => {
        if (!this.start || Date.now() - this.preInterval < this.interval) return

        const { clientX, clientY } = this.start
        const xl = e.clientX - clientX
        const yl = e.clientY - clientY
        if (!xl && !yl) return

        this.processScroll(e, xl, yl)

        this.start = {
            clientX: e.clientX,
            clientY: e.clientY
        }
        this.onMove(e)
        this.preInterval = Date.now()
    }

    end = e => {
        if (!this.start) return
        this.start = null
        this.onEnd(e)
    }

    bind() {
        const { element } = this
        element.addEventListener('mousedown', this.ready)
        element.addEventListener('mousemove', this.moving)
        element.addEventListener('mouseup', this.end)
        element.addEventListener('mouseleave', this.end)
    }

    destroy() {
        const { element } = this
        element.removeEventListener('mousedown', this.ready)
        element.removeEventListener('mousemove', this.moving)
        element.removeEventListener('mouseup', this.end)
        element.removeEventListener('mouseleave', this.end)
    }
}

// v-drag-scroll
// value 设置为拖拽容器和过滤节点，省略则为当前节点
// modifiers 设置拖动轴向和正反向，默认与滚动条方向一致
//
// 示例：
//      <div v-drag-scroll.x>X轴/div>
//      <div v-drag-scroll.y>Y轴</div>
//      <div v-drag-scroll.x.y>双轴</div>
//      <div v-drag-scroll.x.reverse>X轴反向</div>
export default {
    bind(el, { value = {}, modifiers: direction }) {
        const dragScroll = new DragScroll(el, {
            ...value,
            direction,
        })
        dragScroll.bind()
        el.__DRAG_SCROLL__ = dragScroll
    },
    unbind(el) {
        el.__DRAG_SCROLL__.destroy()
        delete el.__DRAG_SCROLL__
    }
}
