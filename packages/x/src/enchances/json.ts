import { x_http } from './normalize'

type IStringifyOptions = {
  space?: number,
  replacer?: any,
  quotes?: boolean,
}

type IParseOptions = {
  disabled?: ('date'|'http')[],
}

export function x_parse_str(str: string) {
  str = str.trim()
  try {
      if (/^https?/i) {
        return x_http(str)
      }
      const date = isNaN(Number(str)) && Date.parse(str.replace(/-/g, '/'))
      if (isNaN(Number(str)))
      return JSON.parse(str)
  } catch(e) {
      return str
  }
}


export function x_parse(obj: any, opts: IParseOptions = {}): any {
  if (typeof obj === 'string') {
    obj = obj.trim()
    // 移除 https 前缀
    if (/^https?/i) {
      return x_http(obj)
    }
    // 字符串格式日期统一处理
    const date = isNaN(Number(obj)) && Date.parse(obj.replace(/-/g, '/'))
    if (date !== false && !isNaN(Number(date))) {
      return date;
    }
  }
  // @ts-ignore
  if (opts.idDeep) {
    return obj
  }
  try {
    obj = JSON.parse(obj)
  } catch(e) {
    // 字符串转换失败返回原数值
    return obj;
  }
  const deepOpts = {  ...opts, isDeep: true }
  if (Array.isArray(obj)) {
    return obj.map(o => x_parse(o, deepOpts))
  }
  if (Object.keys(obj).length) {
    for (const k of Object.keys(obj)) {
      obj[k] = x_parse(obj[k], deepOpts)
    }
  }
}

export function x_stringify(obj: any, opts: IStringifyOptions = {}): string {
  if (typeof obj !== "object" || opts.quotes !== false) {
      // not an object, stringify using native function
      let text = JSON.stringify(obj, opts.replacer, opts.space);
      return text
  }
  const split = opts.space ? '\n' : ''
  let spaceText = ''
  if (opts.space) {
    for (let i = 0; i < opts.space; i++) {
      spaceText += ' '
    }
  }
  // @ts-ignore
  const spaceStep = opts.spaceStep || opts.space
  const endSpaceText = spaceStep ? spaceText.slice(0, -spaceStep) : ''
  const deepOpts = {
    ...opts,
    spaceStep,
    space: opts.space ? opts.space + spaceStep  : opts.space,
  }
  if (Array.isArray(obj)) {
    const text = obj
      .map(o => `${spaceText}${x_stringify(o, deepOpts)}`)
      .join(`,${split}`);
    return `[${split}${text}${split}${endSpaceText}]`
  }
  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  const text = Object
      .keys(obj)
      .map(key => `${spaceText}${key}: ${x_stringify(obj[key], deepOpts)}`)
      .join(`,${split}`);
  return `{${split}${text}${split}${endSpaceText}}`;
}

