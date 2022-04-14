
type IStringifyOptions = {
  space?: number,
  replacer?: any,
  quotes?: boolean,
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

