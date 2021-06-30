import { xTypeOf } from "./type"

const EMPTIES = [null, undefined, NaN, '']

export type IEmptyOpts = {
    extras?: any[],
    strict?: boolean,
    exclude?: any[],
}

export function xEmpty(value: any, opts: IEmptyOpts = {} ) {
    const { extras = [], strict = true, exclude = [] } = opts
    const filters = [ ...extras, ...EMPTIES ].filter(x => !exclude.includes(x))
    if (strict && xTypeOf(value, 'object')) {
      return Object.keys(value).length === 0
    } else if (strict && xTypeOf(value, 'array')) {
      return value.length === 0
    } else {
      return filters.includes(value)
    }
}

export function xFormat(value: any, formatter: (x: any) => any) {
  return xEmpty(value) || formatter(value)
}

export function xSingleton<T>(create: (key: string) => T) {
  const clients = {} as { [key in string] : T }
  return new Proxy(clients, {
      get(target, key) {
          const keystr = String(key)
          if (!target[keystr]) {
            try {
              target[keystr] = create(keystr)
            } catch (e) {
              console.error('Create Singleton Failure!', e)
            }
          }
          return target[keystr]
      }
  })
}

export function xTransfer<T>(target: T, values?: Partial<T>) {
  if (!values) {
      return
  }
  for (const key of Object.keys(values)) {
      const val = values[key as keyof typeof target]
      if (val !== undefined) {
          target[key as keyof typeof target] = val as any
      }
  }
}
