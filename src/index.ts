import { Unit, UnitValue } from './unit'
import { AutoScaleDefaultNames, AutoScaleOptionDefaults, UnitMap, UnitNames, IAutoScaleOptions } from './types'

export class ByteConverter {
  static get units (): UnitMap {
    return Unit.map
  }

  static get unitNames (): UnitNames[] {
    return Object.keys(this.units) as unknown as UnitNames[]
  }

  static get unitsList (): Unit[] {
    return this.unitNames.map((value) => this.units[value])
  }

  static get autoScaleDefaults (): AutoScaleOptionDefaults {
    return Unit.AutoScaleDefaults
  }

  static get autoScaleDefaultNames (): AutoScaleDefaultNames[] {
    return Object.keys(this.autoScaleDefaults) as unknown as AutoScaleDefaultNames[]
  }

  static get autoScaleDefaultsList (): IAutoScaleOptions[] {
    return this.autoScaleDefaultNames.map((value) => this.autoScaleDefaults[value])
  }

  static unit (unit: UnitNames): Unit {
    return this.units[unit]
  }

  static value (value: number, unit: Unit | UnitNames): UnitValue {
    if (!(unit instanceof Unit)) unit = this.unit(unit)
    return unit.value(value)
  }

  static convert (from: UnitValue, to: Unit | UnitNames): UnitValue {
    if (!(to instanceof Unit)) to = this.unit(to)
    return from.convert(to)
  }

  static compareFormat (from: Unit | UnitNames, to: Unit | UnitNames, descendent?: boolean): -1 | 0 | 1 {
    if (!(from instanceof Unit)) from = this.unit(from)
    if (!(to instanceof Unit)) to = this.unit(to)
    return from.compare(to, descendent)
  }

  static compareValue (from: UnitValue, to: UnitValue, descendent?: boolean): -1 | 0 | 1 {
    return from.compare(to, descendent)
  }

  static autoScale (from: UnitValue, options?: IAutoScaleOptions): UnitValue {
    return from.autoScale(options)
  }
}

export default ByteConverter
