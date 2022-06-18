// 处理 date 类型的兼容
// x_data() === null 判断是否为日期
export function x_date(value: Date | string | number): Date | null {
  let date = value
  if (!date) {
    return null
  }
  if (typeof date === 'string') {
    const timestamp = Number(date)
    if (timestamp) {
      date = timestamp
    } else {
      // 兼容 safari 时间, YYYY-MM-DD -> YYYY/MM/DD
     date = date.replace(/-/g, '/')
    }
  }
  if (typeof date === 'number' && String(date).length === 10) {
    // 统一为 13 位时间戳
    date *= 1000
    if (String(date).length !== 13) {
      return null
    }
  }
  const mDate = new Date(date)
  if (!+mDate) {
    return null
  }
  return mDate
}

// 
export function x_http(url: string, prefix = "//") {
 const unschemed = (url || '').split(/^https?:\/\/|^\/\//)[1]
 return unschemed ? `${prefix}${unschemed}` : ''
}

type CallFun<T> = (...args: any) => T
export function x_call<T>(fun: CallFun<T>, args: any = []) {
  if (typeof fun !== 'function') {
    return null
  }
  if (typeof args === 'function') {
    args = args()
  }
  if (!Array.isArray(args)) {
    args = [args]
  }
  if (typeof fun === 'function') {
    return fun(...args)
  }
  return null
}

type InstanceCreator<T> = (cachekey: string) => T
export function x_instance<T>(creator: InstanceCreator<T>) {
  const instances = {} as { x: T } & { [key in string] : T }
  return new Proxy(instances, {
      get(target, key) {
          const keystr = String(key)
          if (!target[keystr]) {
            try {
              target[keystr] = creator(JSON.parse(keystr))
            } catch (e) {
              console.error('Create Instance Failure!', e)
            }
          }
          return Reflect.get(target, keystr)
      },
      set(target, key, val) {
        if (val !== null) {
          return false
        }
        return Reflect.set(target, key, val)
      }
  })
}

// export function x_pipe<T>(...args: CallFun<T>[]) {
//   return args.reduce((pre, cur) => x_call(cur, pre), null)
// } 


// async function xxx() {
//   const x = await x_pipe(
//     (a: any) => 1,
//     (a: any) => 1,
//   )
// }