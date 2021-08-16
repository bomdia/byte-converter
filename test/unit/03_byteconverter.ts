// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mocha from 'mocha'
import * as chai from 'chai'
import { ByteConverter } from '../../src/index'

const expect = chai.expect
describe('ByteConverter', () => {
  it('should be able to convert beetween B and b correctly', () => {
    expect(ByteConverter.convert(ByteConverter.value(1, 'B'), ByteConverter.unit('b'))).to.deep.equal(ByteConverter.value(8, 'b'))
  })
})
