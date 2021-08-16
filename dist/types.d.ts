import { DataFormat } from './dataFormat';
export declare type UnitType = 'binary' | 'decimal';
export declare const DataFormatType: {
    decimal: number;
    binary: number;
};
export declare type DataFormatUnit = 'b' | 'B' | 'kb' | 'kB' | 'Kib' | 'KiB' | 'Mb' | 'MB' | 'Mib' | 'MiB' | 'Gb' | 'GB' | 'Gib' | 'GiB' | 'Tb' | 'TB' | 'Tib' | 'TiB' | 'Pb' | 'PB' | 'Pib' | 'PiB' | 'Eb' | 'EB' | 'Eib' | 'EiB' | 'Zb' | 'ZB' | 'Zib' | 'ZiB' | 'Yb' | 'YB' | 'Yib' | 'YiB';
export interface IBaseUnitEntry {
    type: UnitType;
    unitOrder: number;
    name: string;
}
export interface IUnitEntry extends IBaseUnitEntry {
    unit: DataFormatUnit;
    asBaseUnit: number;
}
export declare enum AutoScalePreferTypeOptions {
    SAME = "same",
    OPPOSITE = "opposite",
    DECIMAL = "decimal",
    BINARY = "binary"
}
export declare enum AutoScalePreferUnitOptions {
    SAME = "same",
    OPPOSITE = "opposite",
    BIT = "bit",
    BYTE = "byte"
}
export interface IDataFormatAutoScaleOptions {
    type: AutoScalePreferTypeOptions;
    unit: AutoScalePreferUnitOptions;
    /**
     *
     * @param dataFormat
     * @param isScalingUp
     *
     * @returns false for keeping and true for filtering out the dataFormat
     */
    filter(dataFormat: DataFormat, isScalingUp: boolean): boolean;
}
export declare const DataFormatDefaultAutoScaleOptions: Readonly<IDataFormatAutoScaleOptions>;
export declare type DataFormatsMap = {
    [key in DataFormatUnit]: DataFormat;
};
