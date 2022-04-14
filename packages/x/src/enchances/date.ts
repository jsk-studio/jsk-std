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
  }
  const mDate = new Date(date)
  if (!+mDate) {
    return null
  }
  return mDate
}
