const DataFormatType = {
    decimal: 1000,
    binary: 1024
};
var AutoScalePreferTypeOptions;
(function (AutoScalePreferTypeOptions) {
    AutoScalePreferTypeOptions["SAME"] = "same";
    AutoScalePreferTypeOptions["OPPOSITE"] = "opposite";
    AutoScalePreferTypeOptions["DECIMAL"] = "decimal";
    AutoScalePreferTypeOptions["BINARY"] = "binary";
})(AutoScalePreferTypeOptions || (AutoScalePreferTypeOptions = {}));
var AutoScalePreferUnitOptions;
(function (AutoScalePreferUnitOptions) {
    AutoScalePreferUnitOptions["SAME"] = "same";
    AutoScalePreferUnitOptions["OPPOSITE"] = "opposite";
    AutoScalePreferUnitOptions["BIT"] = "bit";
    AutoScalePreferUnitOptions["BYTE"] = "byte";
})(AutoScalePreferUnitOptions || (AutoScalePreferUnitOptions = {}));
const DataFormatDefaultAutoScaleOptions = Object.freeze({
    type: AutoScalePreferTypeOptions.SAME,
    unit: AutoScalePreferUnitOptions.SAME,
    filter() { return false; }
});

/* eslint-disable no-use-before-define */
const map = {
    b: { type: 'binary', unitOrder: 0, name: 'bit' },
    B: { type: 'binary', unitOrder: 0, name: 'byte' },
    kb: { type: 'decimal', unitOrder: 1, name: 'kilobit' },
    kB: { type: 'decimal', unitOrder: 1, name: 'kilobyte' },
    Kib: { type: 'binary', unitOrder: 1, name: 'kibibit' },
    KiB: { type: 'binary', unitOrder: 1, name: 'kibibyte' },
    Mb: { type: 'decimal', unitOrder: 2, name: 'megabit' },
    MB: { type: 'decimal', unitOrder: 2, name: 'megabyte' },
    Mib: { type: 'binary', unitOrder: 2, name: 'mebibit' },
    MiB: { type: 'binary', unitOrder: 2, name: 'mebibyte' },
    Gb: { type: 'decimal', unitOrder: 3, name: 'gigabit' },
    GB: { type: 'decimal', unitOrder: 3, name: 'gigabyte' },
    Gib: { type: 'binary', unitOrder: 3, name: 'gibibit' },
    GiB: { type: 'binary', unitOrder: 3, name: 'gibibyte' },
    Tb: { type: 'decimal', unitOrder: 4, name: 'terabit' },
    TB: { type: 'decimal', unitOrder: 4, name: 'terabyte' },
    Tib: { type: 'binary', unitOrder: 4, name: 'tebibit' },
    TiB: { type: 'binary', unitOrder: 4, name: 'tebibyte' },
    Pb: { type: 'decimal', unitOrder: 5, name: 'petabit' },
    PB: { type: 'decimal', unitOrder: 5, name: 'petabyte' },
    Pib: { type: 'binary', unitOrder: 5, name: 'pebibit' },
    PiB: { type: 'binary', unitOrder: 5, name: 'pebibyte' },
    Eb: { type: 'decimal', unitOrder: 6, name: 'exabyte' },
    EB: { type: 'decimal', unitOrder: 6, name: 'exabit' },
    Eib: { type: 'binary', unitOrder: 6, name: 'exbibit' },
    EiB: { type: 'binary', unitOrder: 6, name: 'exbibyte' },
    Zb: { type: 'decimal', unitOrder: 7, name: 'zettabit' },
    ZB: { type: 'decimal', unitOrder: 7, name: 'zettabyte' },
    Zib: { type: 'binary', unitOrder: 7, name: 'zebibit' },
    ZiB: { type: 'binary', unitOrder: 7, name: 'zebibyte' },
    Yb: { type: 'decimal', unitOrder: 8, name: 'yottabit' },
    YB: { type: 'decimal', unitOrder: 8, name: 'yottabyte' },
    Yib: { type: 'binary', unitOrder: 8, name: 'yobibit' },
    YiB: { type: 'binary', unitOrder: 8, name: 'yobibyte' }
};
class DataFormat {
    static get map() {
        const nmap = {};
        for (const dataFormat of Object.keys(map)) {
            nmap[dataFormat] = new DataFormat(dataFormat, map[dataFormat]);
        }
        return nmap;
    }
    unit;
    type;
    unitOrder;
    name;
    constructor(dataFormat, format) {
        this.unit = dataFormat;
        this.type = format.type;
        this.name = format.name;
        this.unitOrder = format.unitOrder;
    }
    static unit(unit) {
        return this.map[unit];
    }
    get asBaseUnit() {
        return Math.pow(DataFormatType[this.type], this.unitOrder);
    }
    get baseUnit() {
        return this.unit[this.unit.length - 1];
    }
    get isInByte() {
        return this.baseUnit === 'B';
    }
    get isInBit() {
        return this.baseUnit === 'b';
    }
    get isBinary() {
        return this.type === 'binary';
    }
    get isDecimal() {
        return this.type === 'decimal';
    }
    get isBit() {
        return this.unit === 'b';
    }
    get isByte() {
        return this.unit === 'B';
    }
    get isBaseUnit() {
        return this.isBit || this.isByte;
    }
    value(value) {
        return new FormattedValue(value, this);
    }
    compare(to, descendent) {
        if (!(to instanceof DataFormat))
            to = DataFormat.unit(to);
        return this.value(1).compare(to.value(1), descendent);
    }
}
function filterDataformats(value, options, isScalingUp = false) {
    const formats = [];
    for (const formatKey of Object.keys(DataFormat.map)) {
        const format = DataFormat.map[formatKey];
        const scaleFilter = isScalingUp ? value.dataFormat.unitOrder > format.unitOrder : value.dataFormat.unitOrder < format.unitOrder;
        if (!(scaleFilter ||
            filterOnType(options.type, value, format) ||
            filterOnUnit(options.unit, value, format) ||
            options.filter.call(value, format, isScalingUp))) {
            formats.push(format);
        }
    }
    return formats.sort((a, b) => a.compare(b, !isScalingUp));
}
function filterOnUnit(unit, value, format) {
    switch (unit) {
        case AutoScalePreferUnitOptions.OPPOSITE:
            if (value.dataFormat.isInByte === format.isInByte)
                return true;
            break;
        case AutoScalePreferUnitOptions.BIT:
            if (format.isInByte)
                return true;
            break;
        case AutoScalePreferUnitOptions.BYTE:
            if (format.isInBit)
                return true;
            break;
        case AutoScalePreferUnitOptions.SAME:
        default:
            if (value.dataFormat.isInByte !== format.isInByte)
                return true;
            break;
    }
    return false;
}
function filterOnType(type, value, format) {
    switch (type) {
        case AutoScalePreferTypeOptions.OPPOSITE:
            if (value.dataFormat.type === format.type)
                return true;
            break;
        case AutoScalePreferTypeOptions.DECIMAL:
            if (format.isBinary)
                return true;
            break;
        case AutoScalePreferTypeOptions.BINARY:
            if (format.isDecimal)
                return true;
            break;
        case AutoScalePreferTypeOptions.SAME:
        default:
            if (value.dataFormat.type !== format.type)
                return true;
            break;
    }
    return false;
}
function scaleFormattedValue(value, dataFormats) {
    for (const format of dataFormats) {
        const val = value.convert(format);
        if (val.value < DataFormatType[val.dataFormat.type] && val.value >= 1) {
            return val;
        }
    }
    return value;
}
class FormattedValue {
    dataFormat;
    value;
    constructor(value, dataFormat) {
        this.dataFormat = dataFormat instanceof DataFormat ? dataFormat : DataFormat.unit(dataFormat);
        this.value = value;
    }
    get formatted() {
        return this.value.toLocaleString() + ' ' + this.dataFormat.unit;
    }
    convert(to) {
        if (this.dataFormat.unit === to.unit)
            return this;
        let asBaseUnit = this.value * this.dataFormat.asBaseUnit; //  the value in bit or byte * the value of his dataFormat in bit or byte
        if (this.dataFormat.isInByte && !to.isInByte) {
            asBaseUnit = asBaseUnit * 8; //  the value in byte * the value of his dataFormat in byte * 8 to make this value in bit as 1 byte = 8 bit
        }
        else if (!this.dataFormat.isInByte && to.isInByte) {
            asBaseUnit = asBaseUnit / 8; //  the value in bit * the value of his dataFormat in bit / 8 to make this value in byte as 8 bit = 1 byte
        }
        return new FormattedValue(asBaseUnit / to.asBaseUnit, to);
    }
    compare(to, descendent) {
        const normTo = this.dataFormat.unit === to.dataFormat.unit ? to : to.convert(this.dataFormat);
        if (this.value < normTo.value)
            return (descendent ? 1 : -1);
        if (this.value === normTo.value)
            return 0;
        if (this.value > normTo.value)
            return (descendent ? -1 : 1);
    }
    deepEquals(to) {
        return this.dataFormat.unit === to.dataFormat.unit && this.value === to.value;
    }
    equals(to) {
        return this.compare(to) === 0;
    }
    autoScale(options = DataFormatDefaultAutoScaleOptions) {
        const opt = {
            type: options.type || DataFormatDefaultAutoScaleOptions.type,
            unit: options.unit || DataFormatDefaultAutoScaleOptions.unit,
            filter: options.filter || DataFormatDefaultAutoScaleOptions.filter
        };
        if (this.value >= DataFormatType[this.dataFormat.type]) { // upping
            return scaleFormattedValue(this, filterDataformats(this, opt, true));
        }
        else if (this.value < 1) { // downing
            return scaleFormattedValue(this, filterDataformats(this, opt, false));
        }
        return this;
    }
}
DataFormat.map;

class ByteConverter {
    get dataFormats() {
        return DataFormat.map;
    }
    get dataFormatUnits() {
        return Object.keys(this.dataFormats);
    }
    get dataFormatsList() {
        return this.dataFormatUnits.map((value) => this.dataFormats[value]);
    }
    unit(unit) {
        return this.dataFormats[unit];
    }
    value(value, unit) {
        if (!(unit instanceof DataFormat))
            unit = this.unit(unit);
        return unit.value(value);
    }
    convert(from, to) {
        if (!(to instanceof DataFormat))
            to = this.unit(to);
        return from.convert(to);
    }
    compareFormat(from, to, descendent) {
        if (!(from instanceof DataFormat))
            from = this.unit(from);
        if (!(to instanceof DataFormat))
            to = this.unit(to);
        return from.compare(to, descendent);
    }
    compareValue(from, to, descendent) {
        return from.compare(to, descendent);
    }
    autoScale(from, options) {
        return from.autoScale(options);
    }
}

export { ByteConverter, ByteConverter as default };
