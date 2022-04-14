// mock 耗时操作 1000 count 约为 700 毫秒，具体时间取决于电脑性能
export function x_blocking(count = 3000) {
  let a = 0
  // tslint:disable-next-line
  const startTime = +new Date()
  for (let i = 1; i < 1000; i++) {
    for (let j = 1; j < 1000; j++) {
      for (let k = 1; k < count; k++) {
        // tslint:disable-next-line
        const b = k * 100
        a = b
      }
    }
  }
  console.log(`mock duration: ${+new Date() - startTime}ms`)
  return (a + 100) / 100
}

// 在 async 函数中设置延时
export function x_sleep(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}
