import { IEmptyOpts, xEmpty } from "./base"

type ITypes<T = any> = {
  string: string,
  number: number,
  boolean: boolean,
  symbol: symbol,
  date: Date,
  promise: Promise<T>,
  array: Array<T>,
  function: Function,
  regexp: RegExp,
  object: object,
}

export function xType(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase()
}

type ITypesKeys = keyof ITypes

export function xTypeOf<
  T extends any = undefined,
  U extends ITypesKeys = ITypesKeys,
  V = T extends undefined ? ITypes[U] : T,
>(value: any, ...datatypes: U[]): value is V {
    return datatypes.includes(xType(value) as U)
}

// 数组归一化, 转换成一个元素类型一致且没有空元素的数组
export function xArray<T>(value?: T | T[], opts: IEmptyOpts = {} ): T[] {
    const empty = [] as T[]
    if (!value) {
      return empty
    }
    return empty.concat(value).filter(v => !xEmpty(v, opts))
  }

// 处理 date 类型的兼容
export function xDate(value: Date | string | number): Date {
    const param = typeof value === 'string' ? value.replace(/-/g, '/') : value
    return new Date(param)
}

export function xObject<T>(obj: T, opts: IEmptyOpts = {} ): Partial<T> {
    const newObj = {} as Partial<T>
    if (!obj) {
      return newObj
    }
    for (const key of Object.keys(obj)) {
      const value = (obj as any)[key]
      if (!xEmpty(value, opts)) {
          (newObj as any)[key] = value
      }
    }
    return newObj
  }
