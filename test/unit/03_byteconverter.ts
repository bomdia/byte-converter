// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mocha from 'mocha'
import * as chai from 'chai'
import { ByteConverter, UnitValue } from '../../src/index'
import { AutoScaleDefaults, IAutoScaleOptions } from '../../src/types'
import { GroupedIT, ITElement, MultiGroup, SingleGroup } from '../helper'

const expect = chai.expect

function expectAutoScale (value: UnitValue, result: UnitValue, options: Partial<IAutoScaleOptions>): ITElement {
  return new ITElement(value.value + ' ' + value.unit.unit + ' = ' + result.value + ' ' + result.unit.unit, () => {
    expect(ByteConverter.autoScale(value, options)).to.deep.equal(result)
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
  new MultiGroup('class ByteConverter',
    new MultiGroup('compareFormat()',
      new SingleGroup('Ascending',
        new ITElement('B > b', () => {
          expect(ByteConverter.compareFormat('B', 'b')).to.equal(1)
        }),
        new ITElement('b < B', () => {
          expect(ByteConverter.compareFormat('b', 'B')).to.equal(-1)
        }),
        new ITElement('b = b', () => {
          expect(ByteConverter.compareFormat('b', 'b')).to.equal(0)
        })
      ),
      new SingleGroup('Descending',
        new ITElement('B < b', () => {
          expect(ByteConverter.compareFormat('B', 'b', true)).to.equal(-1)
        }),
        new ITElement('b > B', () => {
          expect(ByteConverter.compareFormat('b', 'B', true)).to.equal(1)
        }),
        new ITElement('b = b', () => {
          expect(ByteConverter.compareFormat('b', 'b', true)).to.equal(0)
        })
      )
    ),
    new MultiGroup('compareValue()',
      new MultiGroup('basic unit',
        new SingleGroup('Ascending',
          new ITElement('1 B > 1 b', () => { expect(ByteConverter.compareValue(ByteConverter.value(1, 'B'), ByteConverter.value(1, 'b'))).to.equal(1) }),
          new ITElement('1 b < 1 B', () => { expect(ByteConverter.compareValue(ByteConverter.value(1, 'b'), ByteConverter.value(1, 'B'))).to.equal(-1) }),
          new ITElement('1 b = 1 b', () => { expect(ByteConverter.compareValue(ByteConverter.value(1, 'b'), ByteConverter.value(1, 'b'))).to.equal(0) })
        ),
        new SingleGroup('Descending',
          new ITElement('1 B < 1 b', () => { expect(ByteConverter.compareValue(ByteConverter.value(1, 'B'), ByteConverter.value(1, 'b'), true)).to.equal(-1) }),
          new ITElement('1 b > 1 B', () => { expect(ByteConverter.compareValue(ByteConverter.value(1, 'b'), ByteConverter.value(1, 'B'), true)).to.equal(1) }),
          new ITElement('1 b = 1 b', () => { expect(ByteConverter.compareValue(ByteConverter.value(1, 'b'), ByteConverter.value(1, 'b'), true)).to.equal(0) })
        )
      ),
      new MultiGroup('inter unit',
        new SingleGroup('Ascending',
          new ITElement('1 B = 8 b', () => { expect(ByteConverter.compareValue(ByteConverter.value(1, 'B'), ByteConverter.value(8, 'b'))).to.equal(0) }),
          new ITElement('1024 b > 1 kb', () => { expect(ByteConverter.compareValue(ByteConverter.value(1024, 'b'), ByteConverter.value(1, 'kb'))).to.equal(1) }),
          new ITElement('10000000 B = 10 MB', () => { expect(ByteConverter.compareValue(ByteConverter.value(10000000, 'B'), ByteConverter.value(10, 'MB'))).to.equal(0) })
        ),
        new SingleGroup('Descending',
          new ITElement('1 B = 8 b', () => { expect(ByteConverter.compareValue(ByteConverter.value(1, 'B'), ByteConverter.value(8, 'b'), true)).to.equal(0) }),
          new ITElement('1024 b < 1 kb', () => { expect(ByteConverter.compareValue(ByteConverter.value(1024, 'b'), ByteConverter.value(1, 'kb'), true)).to.equal(-1) }),
          new ITElement('10000000 B = 10 MB', () => { expect(ByteConverter.compareValue(ByteConverter.value(10000000, 'B'), ByteConverter.value(10, 'MB'), true)).to.equal(0) })
        )
      )
    ),
    new SingleGroup('equals()',
      new ITElement('1 B = 8 b', () => { expect(ByteConverter.value(1, 'B').equals(ByteConverter.value(8, 'b'))).to.equal(true) }),
      new ITElement('1 B = 1 B', () => { expect(ByteConverter.value(1, 'B').equals(ByteConverter.value(1, 'B'))).to.equal(true) })

    ),
    new SingleGroup('deepEquals()',
      new ITElement('1 B != 8 b', () => { expect(ByteConverter.value(1, 'B').deepEquals(ByteConverter.value(8, 'b'))).to.equal(false) }),
      new ITElement('1 B = 1 B', () => { expect(ByteConverter.value(1, 'B').deepEquals(ByteConverter.value(1, 'B'))).to.equal(true) })
    ),
    new MultiGroup('autoScale()',
      new SingleGroup('prefer SAME UNIT and prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.SameSame,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1, 'Kib')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(0.128, 'kB')]
      )),
      new SingleGroup('Prefer SAME UNIT and prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.SameOpposite,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1.024, 'kb')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(128, 'B')]
      )),
      new SingleGroup('prefer SAME UNIT and prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.SameDecimal,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1.024, 'kb')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(0.128, 'kB')]
      )),
      new SingleGroup('prefer SAME UNIT and prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.SameBinary,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1, 'Kib')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(128, 'B')]
      )),
      new SingleGroup('prefer OPPOSITE UNIT and prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeSame,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(128, 'B')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(1.024, 'kb')]
      )),
      new SingleGroup('Prefer OPPOSITE UNIT and prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeOpposite,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1024, 'b')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(1, 'Kib')]
      )),
      new SingleGroup('prefer OPPOSITE UNIT and prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeDecimal,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1024, 'b')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(1.024, 'kb')]
      )),
      new SingleGroup('prefer OPPOSITE UNIT and prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.OppositeBinary,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(128, 'B')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(1, 'Kib')]
      )),
      new SingleGroup('prefer BIT UNIT and prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.BitSame,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1, 'Kib')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(1.024, 'kb')]
      )),
      new SingleGroup('Prefer BIT UNIT and prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.BitOpposite,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1.024, 'kb')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(1, 'Kib')]
      )),
      new SingleGroup('prefer BIT UNIT and prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.BitDecimal,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1.024, 'kb')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(1.024, 'kb')]
      )),
      new SingleGroup('prefer BIT UNIT and prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.BitBinary,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1, 'Kib')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(1, 'Kib')]
      )),
      new SingleGroup('prefer BYTE UNIT and prefer SAME TYPE', ...expectAutoScales(AutoScaleDefaults.ByteSame,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(128, 'B')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(0.128, 'kB')]
      )),
      new SingleGroup('Prefer BYTE UNIT and prefer OPPOSITE TYPE', ...expectAutoScales(AutoScaleDefaults.ByteOpposite,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1024, 'b')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(128, 'B')]
      )),
      new SingleGroup('prefer BYTE UNIT and prefer DECIMAL TYPE', ...expectAutoScales(AutoScaleDefaults.ByteDecimal,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(1024, 'b')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(0.128, 'kB')]
      )),
      new SingleGroup('prefer BYTE UNIT and prefer BINARY TYPE', ...expectAutoScales(AutoScaleDefaults.ByteBinary,
        [ByteConverter.value(1024, 'b'), ByteConverter.value(128, 'B')],
        [ByteConverter.value(0.128, 'kB'), ByteConverter.value(128, 'B')]
      ))
    )
  )
)
