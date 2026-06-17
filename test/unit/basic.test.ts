import { assert, expect, it } from 'vitest'
import { squared } from '../../lib/basic'

// Edit an assertion and save to see HMR in action

it('math.sqrt()', () => {
  expect(Math.sqrt(4)).toBe(2)
  expect(Math.sqrt(144)).toBe(12)
  expect(Math.sqrt(2)).toBe(Math.SQRT2)
})

it('squared', () => {
  expect(squared(2)).toBe(4)
  expect(squared(12)).toBe(144)
})

it('jSON', () => {
  const input = {
    foo: 'hello',
    bar: 'world',
  }

  const output = JSON.stringify(input)

  expect(output).eq('{"foo":"hello","bar":"world"}')
  assert.deepEqual(JSON.parse(output), input, 'matches original')
})
