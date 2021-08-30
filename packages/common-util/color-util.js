/**
 * rgba转16进制
 * @param {*} color
 */
function rgbaToHex(color) {
    const arr = color.match(/(\d+(\.\d+)?)/g)
    const [r, g, b, a] = arr
    const _r = `0${Number(r).toString(16)}`.slice(-2)
    const _g = `0${Number(g).toString(16)}`.slice(-2)
    const _b = `0${Number(b).toString(16)}`.slice(-2)
    const _a = `0${Number(a).toString(16)}`.slice(-2)
    return `${_r}${_g}${_b}${_a}`
}

/**
 * 16进制转rgba
 * @param {*} color
 */
function hexToRgba(color) {
    if (!color) return ''
    const arr = color.match(/([\da-zA-Z]{2})/g)
    const r = parseInt(arr[0], 16)
    const g = parseInt(arr[1], 16)
    const b = parseInt(arr[2], 16)
    const a = parseInt(arr[3], 16)
    return `rgba(${r},${g},${b},${a})`
}

export default {
    rgbaToHex,
    hexToRgba
}
