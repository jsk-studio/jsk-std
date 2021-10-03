import { 
    xEmpty, 
    xObject, 
    xArray, 
    xDate, 
    xBlocking, 
    xSleep, 
    xType, 
    xTypeOf, 
    xParse, 
    xFormat, 
    xSingleton,
} from "../lib";

test('test for xEmpty', () => {
    const empties = [ null, undefined, NaN, '', {}, []]
    const noempties = [true, false, [1], { a: 1 }, 0, -1, '1']

    empties.forEach(x => {
        expect(xEmpty(x)).toBe(true)
    })
    noempties.forEach(x => {
        expect(xEmpty(x)).toBe(false)
    })
})

test('test for xEmpty unstrict', () => {
    const empties = [ null, undefined, NaN, '']
    const noempties = [true, false, [1], { a: 1 }, 0, -1, '1', {}, []]

    empties.forEach(x => {
        expect(xEmpty(x, { strict: false })).toBe(true)
    })
    noempties.forEach(x => {
        expect(xEmpty(x, { strict: false })).toBe(false)
    })
})

test('test for xEmpty extras', () => {
    const empties = [ null, undefined, NaN, '', {}, [], -1, 0]
    const noempties = [true, false, [1], { a: 1 }, 1, '1']

    empties.forEach(x => {
        expect(xEmpty(x, { extras: [-1, 0] })).toBe(true)
    })
    noempties.forEach(x => {
        expect(xEmpty(x, { extras: [-1, 0] })).toBe(false)
    })
    expect(xEmpty('', { exclude: [''] })).toBe(false)
})

test('test for xObject', () => {
    const input = {
        a: null,
        b: {},
        c: '',
        d: 1,
        e: -1,
    }
    expect(xObject(input)).toMatchObject({ d: 1, e: -1 })
    expect(xObject(input, { strict: false })).toMatchObject({ b: {}, d: 1, e: -1 })
    expect(xObject(input, { extras: [-1] })).toMatchObject({ d: 1 })
    expect(xObject(null)).toMatchObject({})
})

test('test for xArray', () => {
    const input = [
        -1, 0, 1, null, {}, '', true
    ]
    expect(xArray(input)).toMatchObject([ -1, 0, 1, true])
    expect(xArray(null)).toMatchObject([])
})

test('test for xType', () => {
    expect(xType(/test/)).toEqual('regexp')
    expect(xType([])).toEqual('array')
    expect(xType(() => {})).toEqual('function')
    expect(xType({})).toEqual('object')
})


test('test for isType', () => {
    expect(xTypeOf({}, 'object')).toEqual(true)
    expect(xTypeOf('', 'string')).toEqual(true)
    expect(xTypeOf(1, 'number')).toEqual(true)
    expect(xTypeOf(false, 'boolean')).toEqual(true)
    expect(xTypeOf(new Date(), 'date')).toEqual(true)
    expect(xTypeOf(Symbol(1), 'symbol')).toEqual(true)
    expect(xTypeOf(() => {}, 'function')).toEqual(true)
    expect(xTypeOf([], 'array')).toEqual(true)
    expect(xTypeOf(Promise.resolve(1), 'promise')).toEqual(true)
    expect(xTypeOf(/1/i, 'regexp')).toEqual(true)
    expect(xTypeOf('', 'any' as any)).toEqual(false)
})

test('test for xDate', () => {
    const now = new Date()
    expect(xDate('2020-1-1')).toMatchObject(new Date('2020/1/1'))
    expect(xDate(now)).toMatchObject(now)
})

test('test for xBlocking', (done) => {
    expect(xBlocking(10)).toEqual(10)
    done()
})

test('test for xSleep', async (done) => {
    expect(await xSleep(10)).toEqual(undefined)
    done()
})

test('test for xParse', () => {
    expect(xParse('')).toEqual('')
    expect(xParse('', 'number')).toEqual(null)
    expect(xParse('1', 'number')).toEqual(1)
    expect(xParse('1', 'string')).toEqual('1')
    expect(xParse('abc', 'number')).toEqual(null)
    expect(xParse('123abc', 'number')).toEqual(null)
    expect(xParse('true', 'boolean')).toEqual(true)
    expect(xParse('false', 'boolean')).toEqual(false)
    expect(xParse(['1', 'ab', '12ab', 'true'])).toEqual([1, 'ab', '12ab', true])
    expect(xParse(['1', 'ab', '12ab', 'true'], 'number')).toEqual([1, null, null, null])
    expect(xParse('2020-1-1')).toEqual(new Date('2020/1/1'))
    expect(xParse('123123', 'date')).toEqual(null)
})

test('test for xFormat', () => {
    expect(xFormat(0, x => `${x}`)).toEqual('0')
    expect(xFormat(0, x => x > 0 && `${x}`) || 1).toEqual(1)
})

test('test for singleton', () => {
    const x = xSingleton(() => {
        return { name: 123 }
    })
    const x1 = x['xx']
    const x2 = x['xx']
    const x3 = x['xxx']
    expect(x1 === x2).toEqual(true)
    expect(x2 === x3).toEqual(false)
})