import { Unit } from './unit'

export type UnitType = 'binary' | 'decimal'
export const UnitTypeValue = {
  decimal: 1000,
  binary: 1024
}
export type UnitNames = 'b' | 'B' | 'kb' | 'kB' | 'Kib' | 'KiB' | 'Mb' | 'MB' | 'Mib' | 'MiB' | 'Gb' | 'GB' | 'Gib' | 'GiB' | 'Tb' | 'TB' | 'Tib' | 'TiB' | 'Pb' | 'PB' | 'Pib' | 'PiB' | 'Eb' | 'EB' | 'Eib' | 'EiB' | 'Zb' | 'ZB' | 'Zib' | 'ZiB' | 'Yb' | 'YB' | 'Yib' | 'YiB'

export type AutoScaleDefaultNames = 'SameSame' | 'SameOpposite' | 'SameDecimal' | 'SameBinary' | 'OppositeSame' | 'OppositeOpposite' | 'OppositeDecimal' | 'OppositeBinary' | 'BitSame' | 'BitOpposite' | 'BitDecimal' | 'BitBinary' | 'ByteSame' | 'ByteOpposite' | 'ByteDecimal' | 'ByteBinary'

export interface IBaseUnitEntry {
  type: UnitType
  unitOrder: number
  name: string
}

export interface IUnitEntry extends IBaseUnitEntry {
  unit: UnitNames
  asBaseUnit: number
}

export enum AutoScalePreferType {
  SAME = 'same',
  OPPOSITE = 'opposite',
  DECIMAL = 'decimal',
  BINARY = 'binary'
}

export enum AutoScalePreferUnit {
  SAME = 'same',
  OPPOSITE = 'opposite',
  BIT = 'bit',
  BYTE = 'byte'
}

export interface IAutoScaleOptions {
  type: AutoScalePreferType
  unit: AutoScalePreferUnit
  /**
   *
   * @param unit
   * @param isScalingUp
   *
   * @returns false for keeping and true for filtering out the unit
   */
  filter(unit: Unit, isScalingUp: boolean): boolean
}

export type AutoScaleOptionDefaults = {
  [key in AutoScaleDefaultNames]: IAutoScaleOptions
}

function capFirstLetter (str: string):string {
  const ret = str.toLowerCase()
  return ret.charAt(0).toUpperCase() + ret.slice(1)
}

function mapAutoScaleOptions (): AutoScaleOptionDefaults {
  const ret:{[key:string]:IAutoScaleOptions} = {}
  for (const unit in AutoScalePreferUnit) {
    for (const type in AutoScalePreferType) {
      const name: AutoScaleDefaultNames = (capFirstLetter(unit) + capFirstLetter(type)) as AutoScaleDefaultNames
      ret[name] = Object.freeze<IAutoScaleOptions>({
        unit: (AutoScalePreferUnit as { [key: string]: AutoScalePreferUnit })[unit],
        type: (AutoScalePreferType as { [key: string]: AutoScalePreferType })[type],
        filter () { return false }
      })
    }
  }
  return ret as AutoScaleOptionDefaults
}
export const AutoScaleDefaults = Object.freeze<AutoScaleOptionDefaults>(mapAutoScaleOptions())

export const AutoScaleDefault = AutoScaleDefaults.SameSame

export type UnitMap = {
  [key in UnitNames]: Unit
}
