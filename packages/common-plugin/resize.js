const events = []

window.addEventListener('resize', e => {
    events.forEach(fn => fn(e))
})

export default {
    add(fn) {
        events.push(fn)
    },
    remove(fn) {
        const index = events.indexOf(fn)
        events.splice(index, 1)
    }
}
