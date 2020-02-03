class ByteConverter {
  logs: boolean

  constructor (options = { logs: false }) {
    this.logs = !!options.logs
  }

  get typeMap ():Object {
    return {}
  }

  get typeList (): Array<{ dataFormat: string, name: string, type: string, unitOrder: number, asBaseValue: number }> {
    const arr = [{ type: null, unitOrder: null, name: null, asBaseValue: null, dataFormat: null}]
    return arr
  }

  get defaultAutoScaleOptions (): {
    preferByte: boolean,
    preferBit: boolean,
    preferBinary: boolean,
    preferDecimal: boolean,
    preferSameBase: boolean,
    preferOppositeBase: boolean,
    preferSameUnit: boolean,
    preferOppositeUnit: boolean,
    handler: (curDataFormat: string, isUppingDataFormat: boolean) => {}
  } {
    return {
      preferByte: false,
      preferBit: false,
      preferBinary: false,
      preferDecimal: false,
      preferSameBase: true,
      preferOppositeBase: false,
      preferSameUnit: true,
      preferOppositeUnit: false,
      handler: (curDataFormat: string, isUppingDataFormat: boolean):boolean => { return true }
    }
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

  autoScale (value: number, dataFormat: string, options=this.defaultAutoScaleOptions): {value:number,dataFormat:string} {
    return {value:null,dataFormat:null}
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

  getDataFormat (dataFormat: string): { dataFormat: string, name: string, type: string, unitOrder: number, asBaseValue: number } {
    if (this.typeMap[dataFormat]) {
      return { type: null, unitOrder: null, name: null, asBaseValue: null, dataFormat: null}
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
