(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.ByteConverter = {}));
}(this, (function (exports) { 'use strict';

  const defaultTypeMap = {
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

  const defaultUnit = {
    decimal: 1000,
    binary: 1024
  };

  const defaultAutoScaleOptions = {
    preferByte: false,
    preferBit: false,
    preferBinary: false,
    preferDecimal: false,
    preferSameBase: true,
    preferOppositeBase: false,
    preferSameUnit: true,
    preferOppositeUnit: false,
    handler: (curDataFormat, isUppingDataFormat) => { return true }
  };

  function isNumber (value) {
    if ((undefined === value) || (value === null)) {
      return false
    }
    if (typeof value === 'number') {
      return true
    }
    return !isNaN(value - 0)
  }

  class ByteConverter {
    constructor (options = { logs: false }) {
      this.logs = !!options.logs;
      this.__compiledTypeMap = Object.assign({}, defaultTypeMap);
      for (const dataFormat of Object.keys(this.__compiledTypeMap)) {
        this.__compiledTypeMap[dataFormat].asBaseValue = Math.pow(defaultUnit[this.__compiledTypeMap[dataFormat].type], this.__compiledTypeMap[dataFormat].unitOrder);
        this.__compiledTypeMap[dataFormat].dataFormat = dataFormat;
      }
    }

    get typeMap () {
      return Object.assign({}, this.__compiledTypeMap)
    }

    get typeList () {
      const arr = [];
      for (const unit of Object.keys(this.typeMap)) {
        arr.push({ ...this.typeMap[unit] });
      }
      arr.sort(
        (a, b) => {
          this.log('a:', a, 'b:', b);
          return this.compareTo(a.dataFormat, b.dataFormat)
        }
      );
      return arr
    }

    get defaultAutoScaleOptions () {
      return Object.assign({}, defaultAutoScaleOptions)
    }

    convert (value, from, to) {
      if (isNumber(value)) {
        if (this.typeMap[from]) {
          if (this.typeMap[to]) {
            const fromIsByte = this.isByte(from);
            const toIsByte = this.isByte(to);
            let asBaseValue = -1;
            if ((fromIsByte && toIsByte) || (!fromIsByte && !toIsByte)) {
              asBaseValue = value * this.typeMap[from].asBaseValue; //  the value in bit or byte * the value of his dataFormat in bit or byte
            } else if (fromIsByte && !toIsByte) {
              asBaseValue = value * this.typeMap[from].asBaseValue * 8; //  the value in byte * the value of his dataFormat in byte * 8 to make this value in bit as 1 byte = 8 bit
            } else if (!fromIsByte && toIsByte) {
              asBaseValue = value * this.typeMap[from].asBaseValue / 8;//  the value in bit * the value of his dataFormat in bit / 8 to make this value in byte as 8 bit = 1 byte
            }
            return asBaseValue / this.typeMap[to].asBaseValue // the value in bit or byte (depend in from e to dataFormat) / the value of the to data format in bit or byte
          } else { throw new Error('"to" paramater isn\'t a valid dataFormat') }
        } else { throw new Error('"from" paramater isn\'t a valid dataFormat') }
      } else { throw new Error('"value" paramater isn\'t a valid number') }
    }

    autoScale (value, dataFormat, options) {
      if (!isNumber(value)) { throw new Error('"value" paramater isn\'t a valid number') }
      dataFormat = this.getDataFormat(dataFormat);
      options = options || this.defaultAutoScaleOptions;
      for (const defaultOption of Object.keys(this.defaultAutoScaleOptions)) {
        if (!(options[defaultOption] === true || options[defaultOption] === false) && defaultOption !== 'handler') {
          options[defaultOption] = false;
        }
        if (defaultOption === 'handler' && !(options[defaultOption] && typeof options[defaultOption] === 'function')) {
          options[defaultOption] = defaultAutoScaleOptions[defaultOption];
        }
      }
      const retVal = { value, dataFormat: dataFormat.dataFormat };
      const scale = (filteredList) => {
        this.log('scale int fn called:', filteredList);
        for (let i = 0; i < filteredList.length; i++) {
          const newVal = this.convert(value, dataFormat.dataFormat, filteredList[i].dataFormat);
          this.log('newVal:', newVal, 'newDataFormat:', filteredList[i].dataFormat);
          if ((newVal < 1000 && newVal >= 1) || i === filteredList.length - 1) {
            return { value: newVal, dataFormat: filteredList[i].dataFormat }
          }
        }
        return retVal
      };
      const filterList = (curDataFormat, isUppingDataFormat) => {
        let retVal = true;
        this.log(options);
        if (options.preferSameBase && !(options.preferBinary || options.preferDecimal || options.preferOppositeBase)) {
          this.log('isUppingDataFormat:', isUppingDataFormat);
          this.log('isBaseDataFormat(curDataFormat.dataFormat):', this.isBaseDataFormat(curDataFormat.dataFormat));
          this.log('isBaseDataFormat(dataFormat.dataFormat):', this.isBaseDataFormat(dataFormat.dataFormat));
          this.log('isDecimal(dataFormat.dataFormat):', this.isDecimal(dataFormat.dataFormat));
          this.log('isDecimal(curDataFormat.dataFormat)', this.isDecimal(curDataFormat.dataFormat));
          this.log('isBinary(dataFormat.dataFormat)', this.isBinary(dataFormat.dataFormat));
          this.log('isBinary(curDataFormat.dataFormat)', this.isBinary(curDataFormat.dataFormat));

          if (
            !(this.isBaseDataFormat(curDataFormat.dataFormat) && !isUppingDataFormat) && (
              this.isDecimal(dataFormat.dataFormat) !== this.isDecimal(curDataFormat.dataFormat) ||
                this.isBinary(dataFormat.dataFormat) !== this.isBinary(curDataFormat.dataFormat)
            )
          ) {
            this.log('preferSameBase');
            retVal = false;
          }
        }
        if (options.preferSameUnit && !(options.preferByte || options.preferBit || options.preferOppositeUnit)) {
          if (this.isByte(dataFormat.dataFormat) !== this.isByte(curDataFormat.dataFormat) ||
              this.isBit(dataFormat.dataFormat) !== this.isBit(curDataFormat.dataFormat)
          ) {
            this.log('preferSameUnit');
            retVal = false;
          }
        }
        if (options.preferOppositeBase && !(options.preferBinary || options.preferDecimal || options.preferSameBase)) {
          if (
            !(this.isBaseDataFormat(curDataFormat.dataFormat) && !isUppingDataFormat) && (
              this.isDecimal(dataFormat.dataFormat) === this.isDecimal(curDataFormat.dataFormat) ||
                this.isBinary(dataFormat.dataFormat) === this.isBinary(curDataFormat.dataFormat)
            )
          ) {
            this.log('preferOppositeBase');
            retVal = false;
          }
        }
        if (options.preferOppositeUnit && !(options.preferByte || options.preferBit || options.preferSameUnit)) {
          if (this.isByte(dataFormat.dataFormat) === this.isByte(curDataFormat.dataFormat) ||
              this.isBit(dataFormat.dataFormat) === this.isBit(curDataFormat.dataFormat)
          ) {
            this.log('preferOppositeUnit');
            retVal = false;
          }
        }
        if (!options.preferSameBase && !options.preferOppositeBase && options.preferBinary && !options.preferDecimal) {
          if (this.isDecimal(curDataFormat.dataFormat)) {
            this.log('preferBinary');
            retVal = false;
          }
        }
        if (!options.preferSameBase && !options.preferOppositeBase && !options.preferBinary && options.preferDecimal) {
          if (this.isBinary(curDataFormat.dataFormat)) {
            this.log('preferDecimal');
            retVal = false;
          }
        }
        if (!options.preferSameUnit && !options.preferOppositeUnit && options.preferByte && !options.preferBit) {
          if (this.isBit(curDataFormat.dataFormat)) {
            this.log('preferByte');
            retVal = false;
          }
        }
        if (!options.preferSameUnit && !options.preferOppositeUnit && !options.preferByte && options.preferBit) {
          if (this.isByte(curDataFormat.dataFormat)) {
            this.log('preferBit');
            retVal = false;
          }
        }
        return retVal
      };
      if (value >= defaultUnit[dataFormat.type]) {
        this.log('value bigger or equals to ', defaultUnit[dataFormat.type], ' that is the defaultUnit of original value dataFormat type (', dataFormat.type, ')');
        const filteredList = this.typeList.filter((curDataFormat) => {
          const compare = this.compareTo(dataFormat.dataFormat, curDataFormat.dataFormat);
          const filter = (compare < 0 ? filterList(curDataFormat, true) : true);
          const handler = options.handler(curDataFormat, true);
          this.log('curDataFormat:', curDataFormat, 'compareTo:', compare, 'filter:', filter, 'handler:', handler);
          return compare < 0 && filter && handler
        });
        return scale(filteredList)
      } else if (value < 1) {
        this.log('value less then 1');
        const filteredList = this.typeList.filter((curDataFormat) => {
          const compare = this.compareTo(dataFormat.dataFormat, curDataFormat.dataFormat);
          const filter = (compare > 0 ? filterList(curDataFormat, false) : true);
          const handler = options.handler(curDataFormat, false);
          this.log('curDataFormat:', curDataFormat, 'compareTo:', compare, 'filter:', filter, 'handler:', handler);
          return compare > 0 && filter && handler
        });
        filteredList.sort((a, b) => { return this.compareTo(a.dataFormat, b.dataFormat, true) });
        return scale(filteredList)
      }
      return retVal
    }

    log (...args) {
      if (this.logs) { console.log(...args); }
    }

    isByte (dataFormat) {
      if (this.typeMap[dataFormat]) {
        const character = dataFormat[dataFormat.length - 1];
        return character === character.toUpperCase()
      } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
    }

    isBit (dataFormat) {
      if (this.typeMap[dataFormat]) {
        const character = dataFormat[dataFormat.length - 1];
        return character === character.toLowerCase()
      } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
    }

    isBinary (dataFormat) {
      if (this.typeMap[dataFormat]) {
        return this.typeMap[dataFormat].type === 'binary'
      } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
    }

    isDecimal (dataFormat) {
      if (this.typeMap[dataFormat]) {
        return this.typeMap[dataFormat].type === 'decimal'
      } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
    }

    isBaseDataFormat (dataFormat) {
      if (this.typeMap[dataFormat]) {
        return dataFormat.toLowerCase() === 'b'
      } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
    }

    getDataFormat (dataFormat) {
      if (this.typeMap[dataFormat]) {
        return Object.assign({}, this.typeMap[dataFormat])
      } else { throw new Error('"dataFormat" paramater isn\'t a valid dataFormat') }
    }

    compareValue (value1, dataFormat1, value2, dataFormat2, isDescendent) {
      isDescendent = (isDescendent ? !!isDescendent : false);
      const val = (value, dataformat) => {
        if (dataformat === 'b' || dataFormat1 === dataFormat2) {
          return value
        } else {
          return this.convert(value, dataformat, 'b')
        }
      };
      if (isNumber(value1)) {
        if (this.typeMap[dataFormat1]) {
          if (isNumber(value2)) {
            if (this.typeMap[dataFormat2]) {
              const val1 = val(value1, dataFormat1);
              const val2 = val(value2, dataFormat2);
              this.log('isDescendent:', isDescendent);
              this.log('val1:', val1, 'val2:', val2);
              if (val1 < val2) { return (isDescendent ? 1 : -1) }
              if (val1 === val2) { return 0 }
              if (val1 > val2) { return (isDescendent ? -1 : 1) }
            } else { throw new Error('"dataFormat2" paramater isn\'t a valid dataFormat') }
          } else { throw new Error('"value2" paramater isn\'t a valid number') }
        } else { throw new Error('"dataFormat1" paramater isn\'t a valid dataFormat') }
      } else { throw new Error('"value1" paramater isn\'t a valid number') }
    }

    compareTo (dataFormat1, dataFormat2, isDescendent) {
      return this.compareValue(1, dataFormat1, 1, dataFormat2, isDescendent)
    }
  }

  exports.default = ByteConverter;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
