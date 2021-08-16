import { DataFormat, FormattedValue } from './dataFormat';
import { DataFormatsMap, DataFormatUnit, IDataFormatAutoScaleOptions } from './types';
export declare class ByteConverter {
    get dataFormats(): DataFormatsMap;
    get dataFormatUnits(): DataFormatUnit[];
    get dataFormatsList(): DataFormat[];
    unit(unit: DataFormatUnit): DataFormat;
    value(value: number, unit: DataFormat | DataFormatUnit): FormattedValue;
    convert(from: FormattedValue, to: DataFormat | DataFormatUnit): FormattedValue;
    compareFormat(from: DataFormat | DataFormatUnit, to: DataFormat | DataFormatUnit, descendent?: boolean): -1 | 0 | 1;
    compareValue(from: FormattedValue, to: FormattedValue, descendent?: boolean): -1 | 0 | 1;
    autoScale(from: FormattedValue, options?: IDataFormatAutoScaleOptions): FormattedValue;
}
export default ByteConverter;
