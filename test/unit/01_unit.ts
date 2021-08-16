// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mocha from 'mocha'
import * as chai from 'chai'
import { Unit } from '../../src/unit'
import { GroupedIT, ITElement, MultiGroup, SingleGroup } from '../helper'

const expect = chai.expect

GroupedIT.multi(
  new MultiGroup('class Unit',
    new MultiGroup('compare()',
      new SingleGroup('Ascending',
        new ITElement('B > b', () => {
          expect(Unit.unit('B').compare('b')).to.equal(1)
        }),
        new ITElement('b < B', () => {
          expect(Unit.unit('b').compare('B')).to.equal(-1)
        }),
        new ITElement('b = b', () => {
          expect(Unit.unit('b').compare('b')).to.equal(0)
        })
      ),
      new SingleGroup('Descending',
        new ITElement('B < b', () => {
          expect(Unit.unit('B').compare('b', true)).to.equal(-1)
        }),
        new ITElement('b > B', () => {
          expect(Unit.unit('b').compare('B', true)).to.equal(1)
        }),
        new ITElement('b = b', () => {
          expect(Unit.unit('b').compare('b', true)).to.equal(0)
        })
      )
    )
  )
)
