import { DataFormatKey, IBaseUnitEntry, IDataFormatAutoScaleOptions, IUnitEntry, UnitType } from './types';
export declare class DataFormat implements IUnitEntry {
    readonly unit: DataFormatKey;
    readonly type: UnitType;
    readonly unitOrder: number;
    readonly name: string;
    constructor(dataFormat: DataFormatKey, format: IBaseUnitEntry);
    get asBaseUnit(): number;
    get baseUnit(): string;
    get isInByte(): boolean;
    get isInBit(): boolean;
    get isBinary(): boolean;
    get isDecimal(): boolean;
    get isBit(): boolean;
    get isByte(): boolean;
    get isBaseUnit(): boolean;
    value(value: number): FormattedValue;
    compare(to: DataFormat, descendent?: boolean): -1 | 0 | 1;
}
declare const dFormatMap: DataFormatsMap;
export declare class FormattedValue {
    readonly dataFormat: DataFormat;
    readonly value: number;
    constructor(value: number, dataFormat: DataFormat);
    get formatted(): string;
    convert(to: DataFormat): FormattedValue;
    compare(to: FormattedValue, descendent?: boolean): -1 | 0 | 1;
    autoScale(options?: Partial<IDataFormatAutoScaleOptions>): FormattedValue;
}
export declare type DataFormatsMap = {
    [key in DataFormatKey]: DataFormat;
};
export default dFormatMap;
