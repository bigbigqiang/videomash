const baseUrl = `ws://${window.location.host}/darwin/websocket/`

export default (options) => {
    const {
        url, onopen, onclose, onerror, onmessage
    } = options
    const NewWebSocket = new WebSocket(`${baseUrl}${url}`)
    NewWebSocket.onopen = (event) => {
        console.log('WebSocket - onopen')
        if(onopen) {
            onopen(event)
        }
    }

    NewWebSocket.onclose = (event) => {
        console.log('WebSocket - onclose')
        if(onclose) {
            onclose(event)
        }
    }
    NewWebSocket.onerror = (event) => {
        console.log('WebSocket - onerror')
        if(onerror) {
            onerror(event)
        }
    }
    NewWebSocket.onmessage = (event) => {
        console.log('WebSocket - onmessage')
        if(onmessage) {
            onmessage(event)
        }
    }
    return NewWebSocket
}
