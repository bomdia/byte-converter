import dataFormatsMap, { DataFormatsMap, DataFormat, FormattedValue } from './dataFormat'
import { DataFormatKey, IDataFormatAutoScaleOptions } from './types'

export class ByteConverter {
  dataFormats: DataFormatsMap
  constructor () {
    this.dataFormats = dataFormatsMap
  }

  get dataFormatsUnit (): DataFormatKey[] {
    return Object.keys(this.dataFormats) as unknown as DataFormatKey[]
  }

  get dataFormatsList (): DataFormat[] {
    return this.dataFormatsUnit.map((value) => this.dataFormats[value])
  }

  convert (from: FormattedValue, to: DataFormat): FormattedValue {
    return from.convert(to)
  }

  compareFormat (from: DataFormat, to: DataFormat, descendent?: boolean): -1 | 0 | 1 {
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
