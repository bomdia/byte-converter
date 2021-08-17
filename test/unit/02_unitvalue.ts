// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mocha from 'mocha'
import * as chai from 'chai'
import { UnitValue } from '../../src/unit'
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
      new SingleGroup('prefer SAME UNIT and prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.SameSame,
        [new UnitValue(1024, 'b'), new UnitValue(1, 'Kib')],
        [new UnitValue(0.128, 'kB'), new UnitValue(0.128, 'kB')]
      )),
      new SingleGroup('Prefer SAME UNIT and prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.SameOpposite,
        [new UnitValue(1024, 'b'), new UnitValue(1.024, 'kb')],
        [new UnitValue(0.128, 'kB'), new UnitValue(128, 'B')]
      )),
      new SingleGroup('prefer SAME UNIT and prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.SameDecimal,
        [new UnitValue(1024, 'b'), new UnitValue(1.024, 'kb')],
        [new UnitValue(0.128, 'kB'), new UnitValue(0.128, 'kB')]
      )),
      new SingleGroup('prefer SAME UNIT and prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.SameBinary,
        [new UnitValue(1024, 'b'), new UnitValue(1, 'Kib')],
        [new UnitValue(0.128, 'kB'), new UnitValue(128, 'B')]
      )),
      new SingleGroup('prefer OPPOSITE UNIT and prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeSame,
        [new UnitValue(1024, 'b'), new UnitValue(128, 'B')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1.024, 'kb')]
      )),
      new SingleGroup('Prefer OPPOSITE UNIT and prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeOpposite,
        [new UnitValue(1024, 'b'), new UnitValue(1024, 'b')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1, 'Kib')]
      )),
      new SingleGroup('prefer OPPOSITE UNIT and prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeDecimal,
        [new UnitValue(1024, 'b'), new UnitValue(1024, 'b')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1.024, 'kb')]
      )),
      new SingleGroup('prefer OPPOSITE UNIT and prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeBinary,
        [new UnitValue(1024, 'b'), new UnitValue(128, 'B')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1, 'Kib')]
      )),
      new SingleGroup('prefer BIT UNIT and prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.BitSame,
        [new UnitValue(1024, 'b'), new UnitValue(1, 'Kib')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1.024, 'kb')]
      )),
      new SingleGroup('Prefer BIT UNIT and prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.BitOpposite,
        [new UnitValue(1024, 'b'), new UnitValue(1.024, 'kb')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1, 'Kib')]
      )),
      new SingleGroup('prefer BIT UNIT and prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.BitDecimal,
        [new UnitValue(1024, 'b'), new UnitValue(1.024, 'kb')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1.024, 'kb')]
      )),
      new SingleGroup('prefer BIT UNIT and prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.BitBinary,
        [new UnitValue(1024, 'b'), new UnitValue(1, 'Kib')],
        [new UnitValue(0.128, 'kB'), new UnitValue(1, 'Kib')]
      )),
      new SingleGroup('prefer BYTE UNIT and prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.ByteSame,
        [new UnitValue(1024, 'b'), new UnitValue(128, 'B')],
        [new UnitValue(0.128, 'kB'), new UnitValue(0.128, 'kB')]
      )),
      new SingleGroup('Prefer BYTE UNIT and prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.ByteOpposite,
        [new UnitValue(1024, 'b'), new UnitValue(1024, 'b')],
        [new UnitValue(0.128, 'kB'), new UnitValue(128, 'B')]
      )),
      new SingleGroup('prefer BYTE UNIT and prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.ByteDecimal,
        [new UnitValue(1024, 'b'), new UnitValue(1024, 'b')],
        [new UnitValue(0.128, 'kB'), new UnitValue(0.128, 'kB')]
      )),
      new SingleGroup('prefer BYTE UNIT and prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.ByteBinary,
        [new UnitValue(1024, 'b'), new UnitValue(128, 'B')],
        [new UnitValue(0.128, 'kB'), new UnitValue(128, 'B')]
      ))
    )
  )
)
