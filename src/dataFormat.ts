/* eslint-disable no-use-before-define */
import { AutoScalePreferTypeOptions, AutoScalePreferUnitOptions, DataFormatDefaultAutoScaleOptions, DataFormatKey, DataFormatType, IBaseUnitEntry, IDataFormatAutoScaleOptions, IUnitEntry, UnitType } from './types'

type BaseDataFormatsMap = {
    [key in DataFormatKey]: IBaseUnitEntry
}

const map: BaseDataFormatsMap = {
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

export class DataFormat implements IUnitEntry {
  readonly unit: DataFormatKey
  readonly type: UnitType
  readonly unitOrder: number
  readonly name: string

  constructor (dataFormat: DataFormatKey, format: IBaseUnitEntry) {
    this.unit = dataFormat
    this.type = format.type
    this.name = format.name
    this.unitOrder = format.unitOrder
  }

  get asBaseUnit (): number {
    return Math.pow(DataFormatType[this.type], this.unitOrder)
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

  value (value: number): FormattedValue {
    return new FormattedValue(value, this)
  }

  compare (to: DataFormat, descendent?: boolean): -1 | 0 | 1 {
    if (!(to instanceof DataFormat)) throw new TypeError('"to" paramater isn\'t a valid DataFormat Object')
    return this.value(1).compare(to.value(1), descendent)
  }
}

function calculateMap (): DataFormatsMap {
  const nmap = {}
  for (const dataFormat of Object.keys(map) as unknown as DataFormatKey[]) {
    nmap[dataFormat] = new DataFormat(dataFormat, map[dataFormat])
  }
  return nmap as DataFormatsMap
}
const dFormatMap = calculateMap()

function filterDataformats (value: FormattedValue, options: IDataFormatAutoScaleOptions, isScalingUp = false): DataFormat[] {
  const formats:DataFormat[] = []
  for (const formatKey of Object.keys(dFormatMap) as unknown as DataFormatKey[]) {
    const format = dFormatMap[formatKey]

    const scaleFilter = isScalingUp ? value.dataFormat.unitOrder > format.unitOrder : value.dataFormat.unitOrder < format.unitOrder

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

function filterOnUnit (unit: AutoScalePreferUnitOptions, value: FormattedValue, format: DataFormat) {
  switch (unit) {
    case AutoScalePreferUnitOptions.OPPOSITE:
      if (value.dataFormat.isInByte === format.isInByte) return true
      break
    case AutoScalePreferUnitOptions.BIT:
      if (format.isInByte) return true
      break
    case AutoScalePreferUnitOptions.BYTE:
      if (format.isInBit) return true
      break
    case AutoScalePreferUnitOptions.SAME:
    default:
      if (value.dataFormat.isInByte !== format.isInByte) return true
      break
  }
  return false
}

function filterOnType (type: AutoScalePreferTypeOptions, value: FormattedValue, format: DataFormat) {
  switch (type) {
    case AutoScalePreferTypeOptions.OPPOSITE:
      if (value.dataFormat.type === format.type) return true
      break
    case AutoScalePreferTypeOptions.DECIMAL:
      if (format.isBinary) return true
      break
    case AutoScalePreferTypeOptions.BINARY:
      if (format.isDecimal) return true
      break
    case AutoScalePreferTypeOptions.SAME:
    default:
      if (value.dataFormat.type !== format.type) return true
      break
  }
  return false
}

function scaleFormattedValue (value: FormattedValue, dataFormats: DataFormat[]): FormattedValue {
  for (const format of dataFormats) {
    const val = value.convert(format)
    if (val.value < DataFormatType[val.dataFormat.type] && val.value >= 1) {
      return val
    }
  }
  return value
}

export class FormattedValue {
  readonly dataFormat: DataFormat
  readonly value: number

  constructor (value: number, dataFormat: DataFormat) {
    this.dataFormat = dataFormat
    this.value = value
  }

  get formatted (): string {
    return this.value.toLocaleString() + ' ' + this.dataFormat.unit
  }

  convert (to: DataFormat): FormattedValue {
    if (this.dataFormat.unit === to.unit) return this
    let asBaseUnit = this.value * this.dataFormat.asBaseUnit //  the value in bit or byte * the value of his dataFormat in bit or byte
    if (this.dataFormat.isInByte && !to.isInByte) {
      asBaseUnit = asBaseUnit * 8 //  the value in byte * the value of his dataFormat in byte * 8 to make this value in bit as 1 byte = 8 bit
    } else if (!this.dataFormat.isInByte && to.isInByte) {
      asBaseUnit = asBaseUnit / 8 //  the value in bit * the value of his dataFormat in bit / 8 to make this value in byte as 8 bit = 1 byte
    }
    return new FormattedValue(asBaseUnit / to.asBaseUnit, to)
  }

  compare (to: FormattedValue, descendent?: boolean): -1 | 0 | 1 {
    const normTo = this.dataFormat.unit === to.dataFormat.unit ? to : to.convert(this.dataFormat)
    if (this.value < normTo.value) return (descendent ? 1 : -1)
    if (this.value === normTo.value) return 0
    if (this.value > normTo.value) return (descendent ? -1 : 1)
  }

  autoScale (options: Partial<IDataFormatAutoScaleOptions> = DataFormatDefaultAutoScaleOptions): FormattedValue {
    const opt: IDataFormatAutoScaleOptions = {
      type: options.type || DataFormatDefaultAutoScaleOptions.type,
      unit: options.unit || DataFormatDefaultAutoScaleOptions.unit,
      filter: options.filter || DataFormatDefaultAutoScaleOptions.filter
    }

    if (this.value >= DataFormatType[this.dataFormat.type]) { // upping
      return scaleFormattedValue(this, filterDataformats(this, opt, true))
    } else if (this.value < 1) { // downing
      return scaleFormattedValue(this, filterDataformats(this, opt, false))
    }
    return this
  }
}
export type DataFormatsMap = {
  [key in DataFormatKey]: DataFormat
}

export default dFormatMap
