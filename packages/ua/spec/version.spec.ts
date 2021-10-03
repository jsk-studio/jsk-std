import { BrowserType, getBrowserType, getBrowserVersion, BrowserVersionUnknow, getDeviceTypes } from "../lib"


const ua = {
    chrome: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36',
    chromeMac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    ie9: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0;',
    safari: 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
    firefox: 'Mozilla/5.0 (Windows NT 6.1; rv:2.0.1) Gecko/20100101 Firefox/4.0.1',
    unknow: '',
}
test('test for userAgent type', () => {
   expect(getBrowserType(ua.chrome)).toEqual(BrowserType.Chrome)
   expect(getBrowserType(ua.ie9)).toEqual(BrowserType.IE)
   expect(getBrowserType(ua.safari)).toEqual(BrowserType.Safari)
   expect(getBrowserType(ua.firefox)).toEqual(BrowserType.Firefox)
   expect(getBrowserType(ua.unknow)).toEqual(BrowserType.Unknow)
})

test('test for userAgent version', () => {
    expect(getBrowserVersion(ua.chrome)).toEqual('86.0.4240.198')
    expect(getBrowserVersion(ua.ie9)).toEqual('9.0')
    expect(getBrowserVersion(ua.safari)).toEqual('5.1')
    expect(getBrowserVersion(ua.firefox)).toEqual('4.0.1')
    expect(getBrowserVersion(ua.unknow)).toEqual(BrowserVersionUnknow)
})

test('test for userAgent version', () => {
    expect(getDeviceTypes(ua.chromeMac).isMac).toBe(true)
    expect(getDeviceTypes(ua.ie9).isWindows).toBe(true)
    expect(getDeviceTypes(ua.chrome).isMobile).toBe(true)
})