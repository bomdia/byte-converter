// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as mocha from 'mocha'
import * as chai from 'chai'
import { DataFormat } from '../../src/dataFormat'
import { GroupedIT, ITElement, MultiGroup, SingleGroup } from '../helper'

const expect = chai.expect

GroupedIT.multi(
  new MultiGroup('class DataFormat',
    new MultiGroup('compare()',
      new SingleGroup('Ascending',
        new ITElement('B > b', () => {
          expect(DataFormat.unit('B').compare('b')).to.equal(1)
        }),
        new ITElement('b < B', () => {
          expect(DataFormat.unit('b').compare('B')).to.equal(-1)
        }),
        new ITElement('b = b', () => {
          expect(DataFormat.unit('b').compare('b')).to.equal(0)
        })
      ),
      new SingleGroup('Descending',
        new ITElement('B < b', () => {
          expect(DataFormat.unit('B').compare('b', true)).to.equal(-1)
        }),
        new ITElement('b > B', () => {
          expect(DataFormat.unit('b').compare('B', true)).to.equal(1)
        }),
        new ITElement('b = b', () => {
          expect(DataFormat.unit('b').compare('b', true)).to.equal(0)
        })
      )
    )
  )
)
