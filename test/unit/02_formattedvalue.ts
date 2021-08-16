// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mocha from 'mocha'
import * as chai from 'chai'
import { FormattedValue } from '../../src/dataFormat'
import { GroupedIT, ITElement, MultiGroup, SingleGroup } from '../helper'

const expect = chai.expect

GroupedIT.multi(
  new MultiGroup('class FormattedValue',
    new MultiGroup('compare()',
      new MultiGroup('basic unit',
        new SingleGroup('Ascending',
          new ITElement('1 B > 1 b', () => { expect(new FormattedValue(1, 'B').compare(new FormattedValue(1, 'b'))).to.equal(1) }),
          new ITElement('1 b < 1 B', () => { expect(new FormattedValue(1, 'b').compare(new FormattedValue(1, 'B'))).to.equal(-1) }),
          new ITElement('1 b = 1 b', () => { expect(new FormattedValue(1, 'b').compare(new FormattedValue(1, 'b'))).to.equal(0) })
        ),
        new SingleGroup('Descending',
          new ITElement('1 B < 1 b', () => { expect(new FormattedValue(1, 'B').compare(new FormattedValue(1, 'b'), true)).to.equal(-1) }),
          new ITElement('1 b > 1 B', () => { expect(new FormattedValue(1, 'b').compare(new FormattedValue(1, 'B'), true)).to.equal(1) }),
          new ITElement('1 b = 1 b', () => { expect(new FormattedValue(1, 'b').compare(new FormattedValue(1, 'b'), true)).to.equal(0) })
        )
      ),
      new MultiGroup('inter unit',
        new SingleGroup('Ascending',
          new ITElement('1 B = 8 b', () => { expect(new FormattedValue(1, 'B').compare(new FormattedValue(8, 'b'))).to.equal(0) }),
          new ITElement('1024 b > 1 kb', () => { expect(new FormattedValue(1024, 'b').compare(new FormattedValue(1, 'kb'))).to.equal(1) }),
          new ITElement('10000000 B = 10 MB', () => { expect(new FormattedValue(10000000, 'B').compare(new FormattedValue(10, 'MB'))).to.equal(0) })
        ),
        new SingleGroup('Descending',
          new ITElement('1 B = 8 b', () => { expect(new FormattedValue(1, 'B').compare(new FormattedValue(8, 'b'), true)).to.equal(0) }),
          new ITElement('1024 b < 1 kb', () => { expect(new FormattedValue(1024, 'b').compare(new FormattedValue(1, 'kb'), true)).to.equal(-1) }),
          new ITElement('10000000 B = 10 MB', () => { expect(new FormattedValue(10000000, 'B').compare(new FormattedValue(10, 'MB'), true)).to.equal(0) })
        )
      )
    ),
    new SingleGroup('equals()',
      new ITElement('1 B = 8 b', () => { expect(new FormattedValue(1, 'B').equals(new FormattedValue(8, 'b'))).to.equal(true) }),
      new ITElement('1 B = 1 B', () => { expect(new FormattedValue(1, 'B').equals(new FormattedValue(1, 'B'))).to.equal(true) })
    ),
    new SingleGroup('deepEquals()',
      new ITElement('1 B != 8 b', () => { expect(new FormattedValue(1, 'B').deepEquals(new FormattedValue(8, 'b'))).to.equal(false) }),
      new ITElement('1 B = 1 B', () => { expect(new FormattedValue(1, 'B').deepEquals(new FormattedValue(1, 'B'))).to.equal(true) })
    )
  )
)
