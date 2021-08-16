import { Unit } from './unit';
export declare type UnitType = 'binary' | 'decimal';
export declare const UnitTypeValue: {
    decimal: number;
    binary: number;
};
export declare type UnitNames = 'b' | 'B' | 'kb' | 'kB' | 'Kib' | 'KiB' | 'Mb' | 'MB' | 'Mib' | 'MiB' | 'Gb' | 'GB' | 'Gib' | 'GiB' | 'Tb' | 'TB' | 'Tib' | 'TiB' | 'Pb' | 'PB' | 'Pib' | 'PiB' | 'Eb' | 'EB' | 'Eib' | 'EiB' | 'Zb' | 'ZB' | 'Zib' | 'ZiB' | 'Yb' | 'YB' | 'Yib' | 'YiB';
export declare type AutoScaleDefaultNames = 'SameSame' | 'SameOpposite' | 'SameDecimal' | 'SameBinary' | 'OppositeSame' | 'OppositeOpposite' | 'OppositeDecimal' | 'OppositeBinary' | 'BitSame' | 'BitOpposite' | 'BitDecimal' | 'BitBinary' | 'ByteSame' | 'ByteOpposite' | 'ByteDecimal' | 'ByteBinary';
export interface IBaseUnitEntry {
    type: UnitType;
    unitOrder: number;
    name: string;
}
export interface IUnitEntry extends IBaseUnitEntry {
    unit: UnitNames;
    asBaseUnit: number;
}
export declare enum AutoScalePreferType {
    SAME = "same",
    OPPOSITE = "opposite",
    DECIMAL = "decimal",
    BINARY = "binary"
}
export declare enum AutoScalePreferUnit {
    SAME = "same",
    OPPOSITE = "opposite",
    BIT = "bit",
    BYTE = "byte"
}
export interface IAutoScaleOptions {
    type: AutoScalePreferType;
    unit: AutoScalePreferUnit;
    /**
     *
     * @param dataFormat
     * @param isScalingUp
     *
     * @returns false for keeping and true for filtering out the dataFormat
     */
    filter(dataFormat: Unit, isScalingUp: boolean): boolean;
}
export declare type AutoScaleOptionDefaults = {
    [key in AutoScaleDefaultNames]: IAutoScaleOptions;
};
export declare const AutoScaleDefaults: Readonly<AutoScaleOptionDefaults>;
export declare const AutoScaleDefault: IAutoScaleOptions;
export declare type UnitMap = {
    [key in UnitNames]: Unit;
};
