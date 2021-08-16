// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mocha from 'mocha'
import * as chai from 'chai'
import { ByteConverter } from '../../src/index'

const converter = new ByteConverter()

const expect = chai.expect
describe('ByteConverter', () => {
  it('should be able to convert beetween B and b correctly', () => {
    expect(converter.convert(converter.value(1, 'B'), converter.unit('b'))).to.deep.equal(converter.value(8, 'b'))
  })
})
