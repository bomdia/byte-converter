// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mocha from 'mocha'
import * as chai from 'chai'
import { Unit, UnitValue } from '../../src/index'
import { GroupedIT, ITElement, MultiGroup, SingleGroup } from '../helper'
import { IAutoScaleOptions, AutoScaleDefaults } from '../../src/types'

const expect = chai.expect

function expectAutoScale (value: UnitValue, result: UnitValue, options: Partial<IAutoScaleOptions>): ITElement {
  return new ITElement(value.value + ' ' + value.unit.unit + ' = ' + result.value + ' ' + result.unit.unit, () => {
    expect(value.autoScale(options)).to.deep.equal(result)
  })
}
function expectAutoScales (options: Partial<IAutoScaleOptions>, ...values: [UnitValue, UnitValue][]): ITElement[] {
  const ret: ITElement[] = []
  for (const val of values) {
    ret.push(expectAutoScale(val[0], val[1], options))
  }
  return ret
}
enum op { plus='+', minus='-', multiply='*', divide='/' }
function expectOperation (a: UnitValue, oper: op, b: UnitValue, result: UnitValue, options: Unit | Partial<IAutoScaleOptions>): ITElement {
  const aOPb = a.value + ' ' + a.unit.unit + ' ' + oper + ' ' + b.value + ' ' + b.unit.unit
  return new ITElement(aOPb + ' = ' + result.value + ' ' + result.unit.unit, () => {
    let ope = a
    switch (oper) {
      case op.plus:
        ope = a.plus(b, options)
        break
      case op.minus:
        ope = a.minus(b, options)
        break
      case op.multiply:
        ope = a.multiply(b, options)
        break
      case op.divide:
        ope = a.divide(b, options)
        break
    }
    expect(ope).to.deep.equal(result)
  })
}
function expectOperations (options: Unit | Partial<IAutoScaleOptions>, ...values: [UnitValue, op, UnitValue, UnitValue][]) {
  const ret: ITElement[] = []
  for (const val of values) {
    ret.push(expectOperation(val[0], val[1], val[2], val[3], options))
  }
  return ret
}

GroupedIT.multi(
  new MultiGroup('class UnitValue',
    new MultiGroup('compare()',
      new MultiGroup('basic unit',
        new SingleGroup('Ascending',
          new ITElement('1 B > 1 b', () => { expect(new UnitValue(1, 'B').compare(new UnitValue(1, 'b'))).to.equal(1) }),
          new ITElement('1 b < 1 B', () => { expect(new UnitValue(1, 'b').compare(new UnitValue(1, 'B'))).to.equal(-1) }),
          new ITElement('1 b = 1 b', () => { expect(new UnitValue(1, 'b').compare(new UnitValue(1, 'b'))).to.equal(0) })
        ),
        new SingleGroup('Descending',
          new ITElement('1 B < 1 b', () => { expect(new UnitValue(1, 'B').compare(new UnitValue(1, 'b'), true)).to.equal(-1) }),
          new ITElement('1 b > 1 B', () => { expect(new UnitValue(1, 'b').compare(new UnitValue(1, 'B'), true)).to.equal(1) }),
          new ITElement('1 b = 1 b', () => { expect(new UnitValue(1, 'b').compare(new UnitValue(1, 'b'), true)).to.equal(0) })
        )
      ),
      new MultiGroup('inter unit',
        new SingleGroup('Ascending',
          new ITElement('1 B = 8 b', () => { expect(new UnitValue(1, 'B').compare(new UnitValue(8, 'b'))).to.equal(0) }),
          new ITElement('1024 b > 1 kb', () => { expect(new UnitValue(1024, 'b').compare(new UnitValue(1, 'kb'))).to.equal(1) }),
          new ITElement('10000000 B = 10 MB', () => { expect(new UnitValue(10000000, 'B').compare(new UnitValue(10, 'MB'))).to.equal(0) })
        ),
        new SingleGroup('Descending',
          new ITElement('1 B = 8 b', () => { expect(new UnitValue(1, 'B').compare(new UnitValue(8, 'b'), true)).to.equal(0) }),
          new ITElement('1024 b < 1 kb', () => { expect(new UnitValue(1024, 'b').compare(new UnitValue(1, 'kb'), true)).to.equal(-1) }),
          new ITElement('10000000 B = 10 MB', () => { expect(new UnitValue(10000000, 'B').compare(new UnitValue(10, 'MB'), true)).to.equal(0) })
        )
      )
    ),
    new SingleGroup('equals()',
      new ITElement('1 B = 8 b', () => { expect(new UnitValue(1, 'B').equals(new UnitValue(8, 'b'))).to.equal(true) }),
      new ITElement('1 B = 1 B', () => { expect(new UnitValue(1, 'B').equals(new UnitValue(1, 'B'))).to.equal(true) })

    ),
    new SingleGroup('deepEquals()',
      new ITElement('1 B != 8 b', () => { expect(new UnitValue(1, 'B').deepEquals(new UnitValue(8, 'b'))).to.equal(false) }),
      new ITElement('1 B = 1 B', () => { expect(new UnitValue(1, 'B').deepEquals(new UnitValue(1, 'B'))).to.equal(true) })
    ),
    new MultiGroup('autoScale()',
      new SingleGroup('Prefer SAME UNIT and Prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.SameSame,
        [new UnitValue(1024, 'b'), new UnitValue(1, 'Kib')],
        [new UnitValue(0.128, 'kB'), new UnitValue(0.128, 'kB')]
      )),
      new SingleGroup('Prefer SAME UNIT and Prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.SameOpposite,
        [new UnitValue(1024, 'b'), new UnitValue(1.024, 'kb')],
        [new UnitValue(0.128, 'kB'), new UnitValue(128, 'B')]
      )),
      new SingleGroup('Prefer SAME UNIT and Prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.SameDecimal,
        [new UnitValue(1024, 'b'), new UnitValue(1.024, 'kb')],
        [new UnitValue(0.128, 'kB'), new UnitValue(0.128, 'kB')]
      )),
      new SingleGroup('Prefer SAME UNIT and Prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.SameBinary,
        [new UnitValue(1024, 'b'), new UnitValue(1, 'Kib')],
        [new UnitValue(0.128, 'kB'), new UnitValue(128, 'B')]
      )),
      new SingleGroup('Prefer OPPOSITE UNIT and Prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeSame,
        [new UnitValue(1024, 'b'), new UnitValue(128, 'B')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1.024, 'kb')]
      )),
      new SingleGroup('Prefer OPPOSITE UNIT and Prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeOpposite,
        [new UnitValue(1024, 'b'), new UnitValue(1024, 'b')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1, 'Kib')]
      )),
      new SingleGroup('Prefer OPPOSITE UNIT and Prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeDecimal,
        [new UnitValue(1024, 'b'), new UnitValue(1024, 'b')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1.024, 'kb')]
      )),
      new SingleGroup('Prefer OPPOSITE UNIT and Prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeBinary,
        [new UnitValue(1024, 'b'), new UnitValue(128, 'B')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1, 'Kib')]
      )),
      new SingleGroup('Prefer BIT UNIT and Prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.BitSame,
        [new UnitValue(1024, 'b'), new UnitValue(1, 'Kib')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1.024, 'kb')]
      )),
      new SingleGroup('Prefer BIT UNIT and Prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.BitOpposite,
        [new UnitValue(1024, 'b'), new UnitValue(1.024, 'kb')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1, 'Kib')]
      )),
      new SingleGroup('Prefer BIT UNIT and Prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.BitDecimal,
        [new UnitValue(1024, 'b'), new UnitValue(1.024, 'kb')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1.024, 'kb')]
      )),
      new SingleGroup('Prefer BIT UNIT and Prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.BitBinary,
        [new UnitValue(1024, 'b'), new UnitValue(1, 'Kib')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1, 'Kib')]
      )),
      new SingleGroup('Prefer BYTE UNIT and Prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.ByteSame,
        [new UnitValue(1024, 'b'), new UnitValue(128, 'B')],
        [new UnitValue(0.128, 'kB'), new UnitValue(0.128, 'kB')]
      )),
      new SingleGroup('Prefer BYTE UNIT and Prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.ByteOpposite,
        [new UnitValue(1024, 'b'), new UnitValue(1024, 'b')],
        [new UnitValue(0.128, 'kB'), new UnitValue(128, 'B')]
      )),
      new SingleGroup('Prefer BYTE UNIT and Prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.ByteDecimal,
        [new UnitValue(1024, 'b'), new UnitValue(1024, 'b')],
        [new UnitValue(0.128, 'kB'), new UnitValue(0.128, 'kB')]
      )),
      new SingleGroup('Prefer BYTE UNIT and Prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.ByteBinary,
        [new UnitValue(1024, 'b'), new UnitValue(128, 'B')],
        [new UnitValue(0.128, 'kB'), new UnitValue(128, 'B')]
      ))
    ),
    new MultiGroup('mathematichal function',
      new SingleGroup('fixed units: kB', ...expectOperations(Unit.unit('kB'),
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(0.256, 'kB')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'kB')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(0.000125, 'kB')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(0.256, 'kB')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'kB')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(0.000125, 'kB')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.152, 'kB')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0.896, 'kB')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(0.008, 'kB')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.152, 'kB')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0.896, 'kB')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(0.008, 'kB')]
      )),
      new SingleGroup('Prefer SAME UNIT and Prefer SAME TYPE', ...expectOperations(AutoScaleDefaults.SameSame,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2, 'Kib')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2, 'Kib')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.125, 'KiB')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.125, 'KiB')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer SAME UNIT and Prefer OPPOSITE TYPE', ...expectOperations(AutoScaleDefaults.SameOpposite,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2.048, 'kb')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2.048, 'kb')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.152, 'kB')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.152, 'kB')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer SAME UNIT and Prefer DECIMAL TYPE', ...expectOperations(AutoScaleDefaults.SameDecimal,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2.048, 'kb')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2.048, 'kb')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.152, 'kB')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.152, 'kB')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer SAME UNIT and Prefer BINARY TYPE', ...expectOperations(AutoScaleDefaults.SameBinary,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2, 'Kib')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2, 'Kib')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.125, 'KiB')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.125, 'KiB')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer OPPOSITE UNIT and Prefer SAME TYPE', ...expectOperations(AutoScaleDefaults.OppositeSame,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(256, 'B')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(256, 'B')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9, 'Kib')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9, 'Kib')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer OPPOSITE UNIT and Prefer OPPOSITE TYPE', ...expectOperations(AutoScaleDefaults.OppositeOpposite,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2048, 'b')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2048, 'b')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9.216, 'kb')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9.216, 'kb')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer OPPOSITE UNIT and Prefer DECIMAL TYPE', ...expectOperations(AutoScaleDefaults.OppositeDecimal,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2048, 'b')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2048, 'b')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9.216, 'kb')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9.216, 'kb')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer OPPOSITE UNIT and Prefer BINARY TYPE', ...expectOperations(AutoScaleDefaults.OppositeBinary,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(256, 'B')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(256, 'B')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9, 'Kib')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9, 'Kib')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer BIT UNIT and Prefer SAME TYPE', ...expectOperations(AutoScaleDefaults.BitSame,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2, 'Kib')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2, 'Kib')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9, 'Kib')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9, 'Kib')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer BIT UNIT and Prefer OPPOSITE TYPE', ...expectOperations(AutoScaleDefaults.BitOpposite,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2.048, 'kb')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2.048, 'kb')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9.216, 'kb')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9.216, 'kb')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer BIT UNIT and Prefer DECIMAL TYPE', ...expectOperations(AutoScaleDefaults.BitDecimal,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2.048, 'kb')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2.048, 'kb')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9.216, 'kb')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9.216, 'kb')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1.048576, 'Mb')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer BIT UNIT and Prefer BINARY TYPE', ...expectOperations(AutoScaleDefaults.BitBinary,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2, 'Kib')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2, 'Kib')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9, 'Kib')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(9, 'Kib')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(1, 'Mib')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer BYTE UNIT and Prefer SAME TYPE', ...expectOperations(AutoScaleDefaults.ByteSame,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(256, 'B')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(256, 'B')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.125, 'KiB')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.125, 'KiB')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer BYTE UNIT and Prefer OPPOSITE TYPE', ...expectOperations(AutoScaleDefaults.ByteOpposite,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2048, 'b')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2048, 'b')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.152, 'kB')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.152, 'kB')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer BYTE UNIT and Prefer DECIMAL TYPE', ...expectOperations(AutoScaleDefaults.ByteDecimal,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2048, 'b')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(2048, 'b')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.152, 'kB')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.152, 'kB')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(131.072, 'kB')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      )),
      new SingleGroup('Prefer BYTE UNIT and Prefer BINARY TYPE', ...expectOperations(AutoScaleDefaults.ByteBinary,
        [new UnitValue(1024, 'b'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(256, 'B')],
        [new UnitValue(1024, 'b'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1024, 'b'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1024, 'b'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1, 'Kib'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(256, 'B')],
        [new UnitValue(1, 'Kib'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(0, 'b')],
        [new UnitValue(1, 'Kib'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1, 'Kib'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(1, 'b')],
        [new UnitValue(1024, 'B'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.125, 'KiB')],
        [new UnitValue(1024, 'B'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1024, 'B'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1024, 'B'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')],
        [new UnitValue(1, 'KiB'), op.plus, new UnitValue(1, 'Kib'), new UnitValue(1.125, 'KiB')],
        [new UnitValue(1, 'KiB'), op.minus, new UnitValue(1, 'Kib'), new UnitValue(896, 'B')],
        [new UnitValue(1, 'KiB'), op.multiply, new UnitValue(1, 'Kib'), new UnitValue(128, 'KiB')],
        [new UnitValue(1, 'KiB'), op.divide, new UnitValue(1, 'Kib'), new UnitValue(8, 'B')]
      ))
    )
  )
)
