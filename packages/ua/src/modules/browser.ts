import { xArray, xTypeOf } from '@jsk-std/x'

export enum BrowserType {
    IE = 'IE',
    Edge = 'Edge',
    Firefox = 'Firefox',
    Opera = 'Opera',
    Safari = 'Safari',
    Chrome = 'Chrome',
    QQ = 'QQBrowser',
    QQWebView = 'QQWebView',
    WeChatWebView = 'WeChatWebView',
    UC = 'UC',
    Baidu = 'Baidu',
    BaiduWebView = 'BaiduWebView',
    Unknow = 'Unknow',
}

export const BrowserVersionUnknow = '0.0.0'

type IUserAgentValue<T extends boolean | string> = RegExp | RegExp[] | ((ua: string) => T)
type IbrowserTypeMap = {
    [key in BrowserType]?: IUserAgentValue<boolean>
}
type IbrowserVersionMap = {
    [key in BrowserType]?: IUserAgentValue<string>
}

const browserTypeMap: IbrowserTypeMap = {
    [BrowserType.Opera]: /Opera/i,
    [BrowserType.IE]: [ /MSIE/i, /Trident/i ],
    [BrowserType.Edge]: /Edge/i,
    [BrowserType.Firefox]: /FireFox/i,
    [BrowserType.Safari]: ua => /Safari/i.test(ua) && !/Chrome/i.test(ua),
    [BrowserType.Chrome]: ua => /Chrome/i.test(ua) && /Safari/i.test(ua),
    [BrowserType.WeChatWebView]: ua => /micromessenger/i.test(ua.toLocaleLowerCase()),
    [BrowserType.QQ]: /MQQBrowser/i,
    [BrowserType.QQWebView]: /\Wqq\W/i,
    [BrowserType.UC]: /UCBrowser/i,
    [BrowserType.Baidu]: /Baidu/i,
    [BrowserType.BaiduWebView]: /baiduboxapp/i,
}

const browserVersionMap: IbrowserVersionMap = {
    [BrowserType.Opera]: /Opera.([\d.]+)/,
    [BrowserType.IE]: [/MSIE ([\d.]+)/, /rv:([\d.]+)/],
    [BrowserType.Edge]: /Edge\/([\d.]+)/,
    [BrowserType.Firefox]: /Firefox\/([\d.]+)/,
    [BrowserType.Safari]: /Version\/([\d.]+)/,
    [BrowserType.Chrome]: /Chrome\/([\d.]+)/,
}

export function getBrowserType(ua: string): BrowserType {
    for (const browserType of Object.keys(browserTypeMap) as BrowserType[]) {
        const matchType = browserTypeMap[browserType]
        if (xTypeOf(matchType, 'function')) {
            if (matchType(ua)) {
                return browserType
            }
            continue
        }
        for (const regexp of xArray(matchType) as RegExp[]) {
            if (regexp.test(ua)) {
                return browserType
            }
        }
    }
    return BrowserType.Unknow
}


export function getBrowserVersion(ua: string): string {
    const browserType = getBrowserType(ua)
    const matchVersion = xArray(browserVersionMap[browserType])
    if (xTypeOf(matchVersion, 'function')) {
        return matchVersion(ua)
    }
    for (const regexp of xArray(matchVersion) as RegExp[]) {
        const match = ua.match(regexp)
        if (match) {
            return match[1]
        }
    }
    return BrowserVersionUnknow
}
