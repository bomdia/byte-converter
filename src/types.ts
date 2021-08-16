import { DataFormat } from './dataFormat'

export type UnitType = 'binary' | 'decimal'
export const DataFormatType = {
  decimal: 1000,
  binary: 1024
}
export type DataFormatUnit = 'b' | 'B' | 'kb' | 'kB' | 'Kib' | 'KiB' | 'Mb' | 'MB' | 'Mib' | 'MiB' | 'Gb' | 'GB' | 'Gib' | 'GiB' | 'Tb' | 'TB' | 'Tib' | 'TiB' | 'Pb' | 'PB' | 'Pib' | 'PiB' | 'Eb' | 'EB' | 'Eib' | 'EiB' | 'Zb' | 'ZB' | 'Zib' | 'ZiB' | 'Yb' | 'YB' | 'Yib' | 'YiB'

export interface IBaseUnitEntry {
  type: UnitType
  unitOrder: number
  name: string
}

export interface IUnitEntry extends IBaseUnitEntry {
  unit: DataFormatUnit
  asBaseUnit: number
}

export enum AutoScalePreferTypeOptions {
  SAME = 'same',
  OPPOSITE = 'opposite',
  DECIMAL = 'decimal',
  BINARY = 'binary'
}

export enum AutoScalePreferUnitOptions {
  SAME = 'same',
  OPPOSITE = 'opposite',
  BIT = 'bit',
  BYTE = 'byte'
}

export interface IDataFormatAutoScaleOptions {
  type: AutoScalePreferTypeOptions
  unit: AutoScalePreferUnitOptions
  /**
   *
   * @param dataFormat
   * @param isScalingUp
   *
   * @returns false for keeping and true for filtering out the dataFormat
   */
  filter(dataFormat: DataFormat, isScalingUp: boolean): boolean
}

export const DataFormatDefaultAutoScaleOptions = Object.freeze<IDataFormatAutoScaleOptions>({
  type: AutoScalePreferTypeOptions.SAME,
  unit: AutoScalePreferUnitOptions.SAME,
  filter () { return false }
})

export type DataFormatsMap = {
  [key in DataFormatUnit]: DataFormat
}
