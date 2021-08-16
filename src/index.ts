import { DataFormat, FormattedValue } from './dataFormat'
import { DataFormatsMap, DataFormatUnit, IDataFormatAutoScaleOptions } from './types'

export class ByteConverter {
  get dataFormats (): DataFormatsMap {
    return DataFormat.map
  }

  get dataFormatUnits (): DataFormatUnit[] {
    return Object.keys(this.dataFormats) as unknown as DataFormatUnit[]
  }

  get dataFormatsList (): DataFormat[] {
    return this.dataFormatUnits.map((value) => this.dataFormats[value])
  }

  unit (unit: DataFormatUnit): DataFormat {
    return this.dataFormats[unit]
  }

  value (value: number, unit: DataFormat | DataFormatUnit): FormattedValue {
    if (!(unit instanceof DataFormat)) unit = this.unit(unit)
    return unit.value(value)
  }

  convert (from: FormattedValue, to: DataFormat | DataFormatUnit): FormattedValue {
    if (!(to instanceof DataFormat)) to = this.unit(to)
    return from.convert(to)
  }

  compareFormat (from: DataFormat | DataFormatUnit, to: DataFormat | DataFormatUnit, descendent?: boolean): -1 | 0 | 1 {
    if (!(from instanceof DataFormat)) from = this.unit(from)
    if (!(to instanceof DataFormat)) to = this.unit(to)
    return from.compare(to, descendent)
  }

  compareValue (from: FormattedValue, to: FormattedValue, descendent?: boolean): -1 | 0 | 1 {
    return from.compare(to, descendent)
  }

  autoScale (from: FormattedValue, options?: IDataFormatAutoScaleOptions): FormattedValue {
    return from.autoScale(options)
  }
}

export default ByteConverter
