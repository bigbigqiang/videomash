export default {
    padLeft(originalStr, total, pad) {
        const str = `${originalStr}`
        return (Array(total).join(pad || 0) + str).slice(-total)
    },
    padRight(originalStr, total, pad) {
        const str = `${originalStr}`
        return str + Array(total - str.length + 1).join(pad || 0)
    }
}
