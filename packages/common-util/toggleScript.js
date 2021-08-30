export default (category, value) => new Promise((resolve) => {
    const exists = document.querySelector(`script[${category}]`)
    if (!exists) {
        resolve('SUCCESS')
        return
    }
    const current = exists.getAttribute(category)
    if (current === value) {
        resolve('SUCCESS')
        return
    }
    const script = document.createElement('script')
    script.onload = () => {
        resolve('SUCCESS')
    }
    script.src = exists.src.replace(current, value)
    script.setAttribute(category, value)
    exists.after(script)
    exists.remove()
})
