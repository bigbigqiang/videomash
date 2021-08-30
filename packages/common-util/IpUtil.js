export default {
    parseIpToNumber(ip) {
        let num = 0
        const _ip = ip.split('.')
        num = Number(_ip[0]) * 256 * 256 * 256 + Number(_ip[1]) * 256 * 256 + Number(_ip[2]) * 256 + Number(_ip[3])
        num >>>= 0
        return num
    },
    parseNumberToIp(num) {
        const tt = []
        tt[0] = (num >>> 24) >>> 0
        tt[1] = ((num << 8) >>> 24) >>> 0
        tt[2] = (num << 16) >>> 24
        tt[3] = (num << 24) >>> 24
        return tt.join('.')
    },
    getOffsetIp(ip, offset) {
        const value = this.parseIpToNumber(ip)
        if(value === 0) {
            return ip
        }
        return this.parseNumberToIp(value + offset)
    }
}
