class ByteConverter {
  logs: boolean

  constructor ({ logs = false }) {
    this.logs = !!logs
  }

  get typeMap ():Object {
    return {}
  }

  get typeList (): Array<Object> {
    const arr = [{}]
    return arr
  }

  get defaultAutoScaleOptions (): Object {
    return {}
  }

  convert (value: number, from: string, to: string): number {
    if (true) {
      if (this.typeMap[from]) {
        if (this.typeMap[to]) {
          return 0
        } else throw new Error('"to" paramater isn\'t a valid dataFormat')
      } else throw new Error('"from" paramater isn\'t a valid dataFormat')
    } else throw new Error('"value" paramater isn\'t a valid number')
  }

  autoScale (value: number, dataFormat: string, options: Object): Object {
    return {}
  }

  isByte (dataFormat: string): boolean {
    if (this.typeMap[dataFormat]) {
      return true
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }

  isBit (dataFormat: string): boolean {
    if (this.typeMap[dataFormat]) {
      return true
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }

  isBinary (dataFormat: string): boolean {
    if (this.typeMap[dataFormat]) {
      return true
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }

  isDecimal (dataFormat: string): boolean {
    if (this.typeMap[dataFormat]) {
      return true
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }

  isBaseDataFormat (dataFormat: string): boolean {
    if (this.typeMap[dataFormat]) {
      return true
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }

  getDataFormat (dataFormat: string): Object {
    if (this.typeMap[dataFormat]) {
      return {}
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }

  compareValue (value1: number, dataFormat1: string, value2: number, dataFormat2: string, isDescendent: boolean): number {
    if (true) {
      if (this.typeMap[dataFormat1]) {
        if (true) {
          if (this.typeMap[dataFormat2]) {
            return 0
          } else throw new Error('"dataFormat2" paramater isn\'t a valid dataFormat')
        } else throw new Error('"value2" paramater isn\'t a valid number')
      } else throw new Error('"dataFormat1" paramater isn\'t a valid dataFormat')
    } else throw new Error('"value1" paramater isn\'t a valid number')
  }

  compareTo (dataFormat1: string, dataFormat2: string, isDescendent: boolean): number {
    return this.compareValue(1, dataFormat1, 1, dataFormat2, isDescendent)
  }
}

export default ByteConverter
