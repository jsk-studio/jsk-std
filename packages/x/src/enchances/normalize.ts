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

export function x_call(fun: any, args: any = []) {
  if (typeof fun !== 'function') {
    return fun
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
}
