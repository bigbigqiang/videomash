export default function postDownload(params, url, mimeType) {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8')
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4 || xhr.status !== 200) {
            return
        }
        const data = xhr.response
        const contentDisposition = String(xhr.getResponseHeader('content-disposition')).split(';')
        const blob = new Blob([data], { type: mimeType })
        const elink = document.createElement('a')
        elink.style.display = 'none'
        const href = window.URL.createObjectURL(blob)
        elink.href = href
        if (contentDisposition[1]) {
            const fileNameQuery = contentDisposition[1].split('=')
            if (fileNameQuery[0] === 'filename' && fileNameQuery[1]) {
                elink.download = decodeURIComponent(fileNameQuery['1'])
            }
        }
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
        window.URL.revokeObjectURL(href)
    }
    xhr.send(JSON.stringify(params))
}
