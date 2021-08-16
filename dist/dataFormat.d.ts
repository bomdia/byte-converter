import { DataFormatUnit, IBaseUnitEntry, IDataFormatAutoScaleOptions, IUnitEntry, UnitType, DataFormatsMap } from './types';
export declare class DataFormat implements IUnitEntry {
    static get map(): DataFormatsMap;
    readonly unit: DataFormatUnit;
    readonly type: UnitType;
    readonly unitOrder: number;
    readonly name: string;
    constructor(dataFormat: DataFormatUnit, format: IBaseUnitEntry);
    static unit(unit: DataFormatUnit): DataFormat;
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
    compare(to: DataFormat | DataFormatUnit, descendent?: boolean): -1 | 0 | 1;
}
export declare class FormattedValue {
    readonly dataFormat: DataFormat;
    readonly value: number;
    constructor(value: number, dataFormat: DataFormat | DataFormatUnit);
    get formatted(): string;
    convert(to: DataFormat): FormattedValue;
    compare(to: FormattedValue, descendent?: boolean): -1 | 0 | 1;
    deepEquals(to: FormattedValue): boolean;
    equals(to: FormattedValue): boolean;
    autoScale(options?: Partial<IDataFormatAutoScaleOptions>): FormattedValue;
}
declare const _default: DataFormatsMap;
export default _default;
