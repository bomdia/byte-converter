declare class ByteConverter {
    logs: boolean;
    constructor(options?: {
        logs: boolean;
    });
    get typeMap(): Object;
    get typeList(): Array<{
        dataFormat: string;
        name: string;
        type: string;
        unitOrder: number;
        asBaseValue: number;
    }>;
    get defaultAutoScaleOptions(): {
        preferByte: boolean;
        preferBit: boolean;
        preferBinary: boolean;
        preferDecimal: boolean;
        preferSameBase: boolean;
        preferOppositeBase: boolean;
        preferSameUnit: boolean;
        preferOppositeUnit: boolean;
        handler: (curDataFormat: string, isUppingDataFormat: boolean) => {};
    };
    convert(value: number, from: string, to: string): number;
    autoScale(value: number, dataFormat: string, options?: {
        preferByte: boolean;
        preferBit: boolean;
        preferBinary: boolean;
        preferDecimal: boolean;
        preferSameBase: boolean;
        preferOppositeBase: boolean;
        preferSameUnit: boolean;
        preferOppositeUnit: boolean;
        handler: (curDataFormat: string, isUppingDataFormat: boolean) => {};
    }): {
        value: number;
        dataFormat: string;
    };
    isByte(dataFormat: string): boolean;
    isBit(dataFormat: string): boolean;
    isBinary(dataFormat: string): boolean;
    isDecimal(dataFormat: string): boolean;
    isBaseDataFormat(dataFormat: string): boolean;
    getDataFormat(dataFormat: string): {
        dataFormat: string;
        name: string;
        type: string;
        unitOrder: number;
        asBaseValue: number;
    };
    compareValue(value1: number, dataFormat1: string, value2: number, dataFormat2: string, isDescendent: boolean): number;
    compareTo(dataFormat1: string, dataFormat2: string, isDescendent: boolean): number;
}
export default ByteConverter;
