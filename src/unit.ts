/* eslint-disable no-use-before-define */
import { AutoScalePreferType, AutoScalePreferUnit, AutoScaleDefault, UnitNames, UnitTypeValue, IBaseUnitEntry, IAutoScaleOptions, IUnitEntry, UnitType, UnitMap, AutoScaleOptionDefaults, AutoScaleDefaults } from './types'
type BaseUnitMap = {
    [key in UnitNames]: IBaseUnitEntry
}

const map: BaseUnitMap = {
  b: { type: 'binary', unitOrder: 0, name: 'bit' },
  B: { type: 'binary', unitOrder: 0, name: 'byte' },
  kb: { type: 'decimal', unitOrder: 1, name: 'kilobit' },
  kB: { type: 'decimal', unitOrder: 1, name: 'kilobyte' },
  Kib: { type: 'binary', unitOrder: 1, name: 'kibibit' },
  KiB: { type: 'binary', unitOrder: 1, name: 'kibibyte' },
  Mb: { type: 'decimal', unitOrder: 2, name: 'megabit' },
  MB: { type: 'decimal', unitOrder: 2, name: 'megabyte' },
  Mib: { type: 'binary', unitOrder: 2, name: 'mebibit' },
  MiB: { type: 'binary', unitOrder: 2, name: 'mebibyte' },
  Gb: { type: 'decimal', unitOrder: 3, name: 'gigabit' },
  GB: { type: 'decimal', unitOrder: 3, name: 'gigabyte' },
  Gib: { type: 'binary', unitOrder: 3, name: 'gibibit' },
  GiB: { type: 'binary', unitOrder: 3, name: 'gibibyte' },
  Tb: { type: 'decimal', unitOrder: 4, name: 'terabit' },
  TB: { type: 'decimal', unitOrder: 4, name: 'terabyte' },
  Tib: { type: 'binary', unitOrder: 4, name: 'tebibit' },
  TiB: { type: 'binary', unitOrder: 4, name: 'tebibyte' },
  Pb: { type: 'decimal', unitOrder: 5, name: 'petabit' },
  PB: { type: 'decimal', unitOrder: 5, name: 'petabyte' },
  Pib: { type: 'binary', unitOrder: 5, name: 'pebibit' },
  PiB: { type: 'binary', unitOrder: 5, name: 'pebibyte' },
  Eb: { type: 'decimal', unitOrder: 6, name: 'exabyte' },
  EB: { type: 'decimal', unitOrder: 6, name: 'exabit' },
  Eib: { type: 'binary', unitOrder: 6, name: 'exbibit' },
  EiB: { type: 'binary', unitOrder: 6, name: 'exbibyte' },
  Zb: { type: 'decimal', unitOrder: 7, name: 'zettabit' },
  ZB: { type: 'decimal', unitOrder: 7, name: 'zettabyte' },
  Zib: { type: 'binary', unitOrder: 7, name: 'zebibit' },
  ZiB: { type: 'binary', unitOrder: 7, name: 'zebibyte' },
  Yb: { type: 'decimal', unitOrder: 8, name: 'yottabit' },
  YB: { type: 'decimal', unitOrder: 8, name: 'yottabyte' },
  Yib: { type: 'binary', unitOrder: 8, name: 'yobibit' },
  YiB: { type: 'binary', unitOrder: 8, name: 'yobibyte' }
}

export class Unit implements IUnitEntry {
  static get map (): UnitMap {
    return Object.freeze<UnitMap>(
      Object.keys(map).reduce((accumulator, target: UnitNames) => {
        accumulator[target] = new Unit(target, map[target])
        return accumulator
      }, {}) as UnitMap
    )
  }

  static get AutoScaleDefaults (): AutoScaleOptionDefaults {
    return AutoScaleDefaults
  }

  static get AutoScaleDefault (): IAutoScaleOptions {
    return AutoScaleDefault
  }

  readonly unit: UnitNames
  readonly type: UnitType
  readonly unitOrder: number
  readonly name: string

  constructor (dataFormat: UnitNames, format: IBaseUnitEntry) {
    this.unit = dataFormat
    this.type = format.type
    this.name = format.name
    this.unitOrder = format.unitOrder
  }

  get asBaseUnit (): number {
    return Math.pow(UnitTypeValue[this.type], this.unitOrder)
  }

  get baseUnit (): string {
    return this.unit[this.unit.length - 1]
  }

  get isInByte (): boolean {
    return this.baseUnit === 'B'
  }

  get isInBit (): boolean {
    return this.baseUnit === 'b'
  }

  get isBinary (): boolean {
    return this.type === 'binary'
  }

  get isDecimal (): boolean {
    return this.type === 'decimal'
  }

  get isBit (): boolean {
    return this.unit === 'b'
  }

  get isByte (): boolean {
    return this.unit === 'B'
  }

  get isBaseUnit (): boolean {
    return this.isBit || this.isByte
  }

  static unit (unit: UnitNames | Unit): Unit {
    if (!(unit instanceof Unit)) unit = this.map[unit]
    return unit
  }

  static value (value: number, unit: UnitNames | Unit): UnitValue {
    return this.unit(unit).value(value)
  }

  static compare (unitA: UnitNames | Unit, unitB: UnitNames | Unit, descendent?: boolean): -1 | 0 | 1 {
    return this.unit(unitA).compare(this.unit(unitB), descendent)
  }

  value (value: number): UnitValue {
    return new UnitValue(value, this)
  }

  compare (to: Unit | UnitNames, descendent?: boolean): -1 | 0 | 1 {
    return this.value(1).compare(Unit.unit(to).value(1), descendent)
  }
}

function filterDataformats (value: UnitValue, options: IAutoScaleOptions, isScalingUp = false): Unit[] {
  const formats:Unit[] = []
  for (const formatKey of Object.keys(Unit.map) as unknown as UnitNames[]) {
    const format = Unit.map[formatKey]

    const scaleFilter = isScalingUp ? value.unit.unitOrder > format.unitOrder : value.unit.unitOrder < format.unitOrder

    if (!(
      scaleFilter ||
      filterOnType(options.type, value, format) ||
      filterOnUnit(options.unit, value, format) ||
      options.filter.call(value, format, isScalingUp)
    )) {
      formats.push(format)
    }
  }
  return formats.sort((a, b) => a.compare(b, !isScalingUp))
}

function filterOnUnit (unit: AutoScalePreferUnit, value: UnitValue, format: Unit) {
  switch (unit) {
    case AutoScalePreferUnit.OPPOSITE:
      if (value.unit.isInByte === format.isInByte) return true
      break
    case AutoScalePreferUnit.BIT:
      if (format.isInByte) return true
      break
    case AutoScalePreferUnit.BYTE:
      if (format.isInBit) return true
      break
    case AutoScalePreferUnit.SAME:
    default:
      if (value.unit.isInByte !== format.isInByte) return true
      break
  }
  return false
}

function filterOnType (type: AutoScalePreferType, value: UnitValue, format: Unit) {
  switch (type) {
    case AutoScalePreferType.OPPOSITE:
      if (value.unit.type === format.type) return true
      break
    case AutoScalePreferType.DECIMAL:
      if (format.isBinary) return true
      break
    case AutoScalePreferType.BINARY:
      if (format.isDecimal) return true
      break
    case AutoScalePreferType.SAME:
    default:
      if (value.unit.type !== format.type) return true
      break
  }
  return false
}

function scaleFormattedValue (value: UnitValue, dataFormats: Unit[]): UnitValue {
  for (const format of dataFormats) {
    const val = value.convert(format)
    if (val.value < UnitTypeValue[val.unit.type] && val.value >= 1) {
      return val
    }
  }
  return value
}

export class UnitValue {
  readonly unit: Unit
  readonly value: number

  constructor (value: number, unit: Unit | UnitNames) {
    this.unit = unit instanceof Unit ? unit : Unit.unit(unit)
    this.value = value
  }

  static get AutoScaleDefaults (): AutoScaleOptionDefaults {
    return Unit.AutoScaleDefaults
  }

  static get AutoScaleDefault (): IAutoScaleOptions {
    return Unit.AutoScaleDefault
  }

  formatted (): string {
    return this.value.toLocaleString() + ' ' + this.unit.unit
  }

  convert (to: Unit): UnitValue {
    if (this.unit.unit === to.unit) return this
    let asBaseUnit = this.value * this.unit.asBaseUnit //  the value in bit or byte * the value of his dataFormat in bit or byte
    if (this.unit.isInByte && !to.isInByte) {
      asBaseUnit = asBaseUnit * 8 //  the value in byte * the value of his dataFormat in byte * 8 to make this value in bit as 1 byte = 8 bit
    } else if (!this.unit.isInByte && to.isInByte) {
      asBaseUnit = asBaseUnit / 8 //  the value in bit * the value of his dataFormat in bit / 8 to make this value in byte as 8 bit = 1 byte
    }
    return new UnitValue(asBaseUnit / to.asBaseUnit, to)
  }

  compare (to: UnitValue, descendent?: boolean): -1 | 0 | 1 {
    const normTo = this.unit.unit === to.unit.unit ? to : to.convert(this.unit)
    if (this.value < normTo.value) return (descendent ? 1 : -1)
    if (this.value === normTo.value) return 0
    if (this.value > normTo.value) return (descendent ? -1 : 1)
  }

  deepEquals (to: UnitValue): boolean {
    return this.unit.unit === to.unit.unit && this.value === to.value
  }

  equals (to: UnitValue): boolean {
    return this.compare(to) === 0
  }

  autoScale (options: Partial<IAutoScaleOptions> = UnitValue.AutoScaleDefault): UnitValue {
    const opt: IAutoScaleOptions = {
      type: options.type || UnitValue.AutoScaleDefault.type,
      unit: options.unit || UnitValue.AutoScaleDefault.unit,
      filter: options.filter || UnitValue.AutoScaleDefault.filter
    }

    if (this.value >= UnitTypeValue[this.unit.type]) { // upping
      return scaleFormattedValue(this, filterDataformats(this, opt, true))
    } else if (this.value < 1) { // downing
      return scaleFormattedValue(this, filterDataformats(this, opt, false))
    }
    return this
  }
}

export default Unit.map
