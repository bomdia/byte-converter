const UnitTypeValue = {
    decimal: 1000,
    binary: 1024
};
var AutoScalePreferType;
(function (AutoScalePreferType) {
    AutoScalePreferType["SAME"] = "same";
    AutoScalePreferType["OPPOSITE"] = "opposite";
    AutoScalePreferType["DECIMAL"] = "decimal";
    AutoScalePreferType["BINARY"] = "binary";
})(AutoScalePreferType || (AutoScalePreferType = {}));
var AutoScalePreferUnit;
(function (AutoScalePreferUnit) {
    AutoScalePreferUnit["SAME"] = "same";
    AutoScalePreferUnit["OPPOSITE"] = "opposite";
    AutoScalePreferUnit["BIT"] = "bit";
    AutoScalePreferUnit["BYTE"] = "byte";
})(AutoScalePreferUnit || (AutoScalePreferUnit = {}));
function capFirstLetter(str) {
    const ret = str.toLowerCase();
    return ret.charAt(0).toUpperCase() + ret.slice(1);
}
function mapAutoScaleOptions() {
    const ret = {};
    for (const unit in AutoScalePreferUnit) {
        for (const type in AutoScalePreferType) {
            const name = (capFirstLetter(unit) + capFirstLetter(type));
            ret[name] = Object.freeze({
                unit: AutoScalePreferUnit[unit],
                type: AutoScalePreferType[type],
                filter() { return false; }
            });
        }
    }
    return ret;
}
const AutoScaleDefaults = Object.freeze(mapAutoScaleOptions());
const AutoScaleDefault = AutoScaleDefaults.SameSame;

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
class Unit {
    constructor(dataFormat, format) {
        this.unit = dataFormat;
        this.type = format.type;
        this.name = format.name;
        this.unitOrder = format.unitOrder;
    }
    static get map() {
        return Object.freeze(Object.keys(map).reduce((accumulator, target) => {
            accumulator[target] = new Unit(target, map[target]);
            return accumulator;
        }, {}));
    }
    static get AutoScaleDefaults() {
        return AutoScaleDefaults;
    }
    static get AutoScaleDefault() {
        return AutoScaleDefault;
    }
    get asBaseUnit() {
        return Math.pow(UnitTypeValue[this.type], this.unitOrder);
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
    static unit(unit) {
        if (!(unit instanceof Unit))
            unit = this.map[unit];
        return unit;
    }
    static value(value, unit) {
        return this.unit(unit).value(value);
    }
    static compare(unitA, unitB, descendent) {
        return this.unit(unitA).compare(this.unit(unitB), descendent);
    }
    value(value) {
        return new UnitValue(value, this);
    }
    compare(to, descendent) {
        return this.value(1).compare(Unit.unit(to).value(1), descendent);
    }
}
function filterDataformats(value, options, isScalingUp = false) {
    const formats = [];
    for (const formatKey of Object.keys(Unit.map)) {
        const format = Unit.map[formatKey];
        const scaleFilter = isScalingUp ? value.unit.unitOrder > format.unitOrder : value.unit.unitOrder < format.unitOrder;
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
        case AutoScalePreferUnit.OPPOSITE:
            if (value.unit.isInByte === format.isInByte)
                return true;
            break;
        case AutoScalePreferUnit.BIT:
            if (format.isInByte)
                return true;
            break;
        case AutoScalePreferUnit.BYTE:
            if (format.isInBit)
                return true;
            break;
        case AutoScalePreferUnit.SAME:
        default:
            if (value.unit.isInByte !== format.isInByte)
                return true;
            break;
    }
    return false;
}
function filterOnType(type, value, format) {
    switch (type) {
        case AutoScalePreferType.OPPOSITE:
            if (value.unit.type === format.type)
                return true;
            break;
        case AutoScalePreferType.DECIMAL:
            if (format.isBinary)
                return true;
            break;
        case AutoScalePreferType.BINARY:
            if (format.isDecimal)
                return true;
            break;
        case AutoScalePreferType.SAME:
        default:
            if (value.unit.type !== format.type)
                return true;
            break;
    }
    return false;
}
function scaleFormattedValue(value, dataFormats) {
    for (const format of dataFormats) {
        const val = value.convert(format);
        if (val.value < UnitTypeValue[val.unit.type] && val.value >= 1) {
            return val;
        }
    }
    return value;
}
class UnitValue {
    constructor(value, unit) {
        this.unit = unit instanceof Unit ? unit : Unit.unit(unit);
        this.value = value;
    }
    static get AutoScaleDefaults() {
        return Unit.AutoScaleDefaults;
    }
    static get AutoScaleDefault() {
        return Unit.AutoScaleDefault;
    }
    formatted() {
        return this.value.toLocaleString() + ' ' + this.unit.unit;
    }
    convert(to) {
        if (this.unit.unit === to.unit)
            return this;
        let asBaseUnit = this.value * this.unit.asBaseUnit; //  the value in bit or byte * the value of his dataFormat in bit or byte
        if (this.unit.isInByte && !to.isInByte) {
            asBaseUnit = asBaseUnit * 8; //  the value in byte * the value of his dataFormat in byte * 8 to make this value in bit as 1 byte = 8 bit
        }
        else if (!this.unit.isInByte && to.isInByte) {
            asBaseUnit = asBaseUnit / 8; //  the value in bit * the value of his dataFormat in bit / 8 to make this value in byte as 8 bit = 1 byte
        }
        return new UnitValue(asBaseUnit / to.asBaseUnit, to);
    }
    compare(to, descendent) {
        const normTo = this.unit.unit === to.unit.unit ? to : to.convert(this.unit);
        if (this.value < normTo.value)
            return (descendent ? 1 : -1);
        else if (this.value === normTo.value)
            return 0;
        else if (this.value > normTo.value)
            return (descendent ? -1 : 1);
        else
            return 0;
    }
    deepEquals(to) {
        return this.unit.unit === to.unit.unit && this.value === to.value;
    }
    equals(to) {
        return this.compare(to) === 0;
    }
    autoScale(options = UnitValue.AutoScaleDefault) {
        const opt = {
            type: options.type || UnitValue.AutoScaleDefault.type,
            unit: options.unit || UnitValue.AutoScaleDefault.unit,
            filter: options.filter || UnitValue.AutoScaleDefault.filter
        };
        if (this.value >= UnitTypeValue[this.unit.type]) { // upping
            return scaleFormattedValue(this, filterDataformats(this, opt, true));
        }
        else if (this.value < 1) { // downing
            return scaleFormattedValue(this, filterDataformats(this, opt, false));
        }
        return this;
    }
}
Unit.map;

class ByteConverter {
    static get units() {
        return Unit.map;
    }
    static get unitNames() {
        return Object.keys(this.units);
    }
    static get unitsList() {
        return this.unitNames.map((value) => this.units[value]);
    }
    static get autoScaleDefaults() {
        return Unit.AutoScaleDefaults;
    }
    static get autoScaleDefaultNames() {
        return Object.keys(this.autoScaleDefaults);
    }
    static get autoScaleDefaultsList() {
        return this.autoScaleDefaultNames.map((value) => this.autoScaleDefaults[value]);
    }
    static unit(unit) {
        return this.units[unit];
    }
    static value(value, unit) {
        if (!(unit instanceof Unit))
            unit = this.unit(unit);
        return unit.value(value);
    }
    static convert(from, to) {
        if (!(to instanceof Unit))
            to = this.unit(to);
        return from.convert(to);
    }
    static compareFormat(from, to, descendent) {
        if (!(from instanceof Unit))
            from = this.unit(from);
        if (!(to instanceof Unit))
            to = this.unit(to);
        return from.compare(to, descendent);
    }
    static compareValue(from, to, descendent) {
        return from.compare(to, descendent);
    }
    static autoScale(from, options) {
        return from.autoScale(options);
    }
}

export { ByteConverter, Unit, UnitValue, ByteConverter as default };
