declare class ByteConverter {
    logs: boolean;
    constructor({ logs }: {
        logs?: boolean;
    });
    get typeMap(): Object;
    get typeList(): Array<Object>;
    get defaultAutoScaleOptions(): Object;
    convert(value: number, from: string, to: string): number;
    autoScale(value: number, dataFormat: string, options: Object): Object;
    isByte(dataFormat: string): boolean;
    isBit(dataFormat: string): boolean;
    isBinary(dataFormat: string): boolean;
    isDecimal(dataFormat: string): boolean;
    isBaseDataFormat(dataFormat: string): boolean;
    getDataFormat(dataFormat: string): Object;
    compareValue(value1: number, dataFormat1: string, value2: number, dataFormat2: string, isDescendent: boolean): number;
    compareTo(dataFormat1: string, dataFormat2: string, isDescendent: boolean): number;
}
export default ByteConverter;
