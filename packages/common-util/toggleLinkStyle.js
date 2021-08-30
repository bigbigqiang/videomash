export default (category, value) => new Promise((resolve) => {
    const exists = document.querySelector(`link[${category}]`)
    if (!exists) {
        resolve('SUCCESS')
        return
    }
    const current = exists.getAttribute(category)
    const link = document.createElement('link')
    link.onload = () => {
        resolve('SUCCESS')
    }
    link.href = exists.getAttribute('href').replace(current, value)
    link.setAttribute(category, value)
    link.setAttribute('rel', 'stylesheet')
    exists.after(link)
    exists.remove()
})
