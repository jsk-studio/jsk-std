export enum DeviceType {
    Mobile = 'Mobile',
    IOS = 'IOS',
    Android = 'Android',
    IPad = 'IPad',
    Mac = 'Mac',
    Windows = 'Windows',
    WinPhone = 'WinPhone',
}

type IUserAgentValue<T extends boolean> = RegExp
type IDeviceTypeMap = {
    [key in DeviceType]?: IUserAgentValue<boolean>
}
const browserTypeMap: IDeviceTypeMap = {
    [DeviceType.Mobile]: /AppleWebKit.*Mobile.*/i,
    [DeviceType.IOS]: /(iPhone|iPod|iPad);?/i,
    [DeviceType.Android]: /Android/i,
    [DeviceType.IPad]: /iPad/i,
    [DeviceType.Mac]: /macintosh|mac os x/i,
    [DeviceType.Windows]: /windows|win32/i,
    [DeviceType.WinPhone]: /Windows Phone/i,
}

export function getDeviceTypes(ua: string) {
    return {
        isMobile: /AppleWebKit.*Mobile.*/i.test(ua),
        isIOS: /(iPhone|iPod|iPad);?/i.test(ua),
        isAndroid: /Android/i.test(ua),
        isIPad: /iPad/i.test(ua),
        isMac: /macintosh|mac os x/i.test(ua),
        isWindows: /windows|win32/i.test(ua),
        isWinPhone: /Windows Phone/i.test(ua),
    } as const
}
