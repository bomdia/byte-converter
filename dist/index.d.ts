import { DataFormatsMap, DataFormat, FormattedValue } from './dataFormat';
import { DataFormatKey, IDataFormatAutoScaleOptions } from './types';
export declare class ByteConverter {
    dataFormats: DataFormatsMap;
    constructor();
    get dataFormatsUnit(): DataFormatKey[];
    get dataFormatsList(): DataFormat[];
    convert(from: FormattedValue, to: DataFormat): FormattedValue;
    compareFormat(from: DataFormat, to: DataFormat, descendent?: boolean): -1 | 0 | 1;
    compareValue(from: FormattedValue, to: FormattedValue, descendent?: boolean): -1 | 0 | 1;
    autoScale(from: FormattedValue, options?: IDataFormatAutoScaleOptions): FormattedValue;
}
export default ByteConverter;
