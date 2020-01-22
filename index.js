const ByteConverter = function (logs) {

  logs = !!logs

  const log = function (...args) {
    if(logs) console.log(...args)
  }

  const defaultUnit = {
    decimal: 1000,
    binary: 1024
  }

  const typeMap = {
    b: {type: "binary", unitOrder: 0,   name:"bit" },
    B: {type: "binary", unitOrder: 0,   name:"byte" },
    kb: {type: "decimal", unitOrder: 1, name:"kilobit" },
    kB: {type: "decimal", unitOrder: 1, name:"kilobyte" },
    Kib: {type: "binary", unitOrder: 1, name:"kibibit" },
    KiB: {type: "binary", unitOrder: 1, name:"kibibyte" },
    Mb: {type: "decimal", unitOrder: 2, name:"megabit" },
    MB: {type: "decimal", unitOrder: 2, name:"megabyte" },
    Mib: {type: "binary", unitOrder: 2, name:"mebibit" },
    MiB: {type: "binary", unitOrder: 2, name:"mebibyte" },
    Gb: {type: "decimal", unitOrder: 3, name:"gigabit" },
    GB: {type: "decimal", unitOrder: 3, name:"gigabyte" },
    Gib: {type: "binary", unitOrder: 3, name:"gibibit" },
    GiB: {type: "binary", unitOrder: 3, name:"gibibyte" },
    Tb: {type: "decimal", unitOrder: 4, name:"terabit" },
    TB: {type: "decimal", unitOrder: 4, name:"terabyte" },
    Tib: {type: "binary", unitOrder: 4, name:"tebibit" },
    TiB: {type: "binary", unitOrder: 4, name:"tebibyte" },
    Pb: {type: "decimal", unitOrder: 5, name:"petabit" },
    PB: {type: "decimal", unitOrder: 5, name:"petabyte" },
    Pib: {type: "binary", unitOrder: 5, name:"pebibit" },
    PiB: {type: "binary", unitOrder: 5, name:"pebibyte" },
    Eb: {type: "decimal", unitOrder: 6, name:"exabyte" },
    EB: {type: "decimal", unitOrder: 6, name:"exabit" },
    Eib: {type: "binary", unitOrder: 6, name:"exbibit" },
    EiB: {type: "binary", unitOrder: 6, name:"exbibyte" },
    Zb: {type: "decimal", unitOrder: 7, name:"zettabit" },
    ZB: {type: "decimal", unitOrder: 7, name:"zettabyte" },
    Zib: {type: "binary", unitOrder: 7, name:"zebibit" },
    ZiB: {type: "binary", unitOrder: 7, name:"zebibyte" },
    Yb: {type: "decimal", unitOrder: 8, name:"yottabit" },
    YB: {type: "decimal", unitOrder: 8, name:"yottabyte" },
    Yib: {type: "binary", unitOrder: 8, name:"yobibit" },
    YiB: {type: "binary", unitOrder: 8, name:"yobibyte" }
  }

  const isNumber = function(value) {
    if ((undefined === value) || (null === value)) {
      return false;
    }
    if (typeof value === 'number') {
      return true;
    }
    return !isNaN(value - 0);
  }

  const isByte = function (dataFormat) {
    if (typeMap[dataFormat]) {
      const character = dataFormat[dataFormat.length - 1]
      return character === character.toUpperCase()
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }
  const isBit = function (dataFormat) {
    if (typeMap[dataFormat]) {
      const character = dataFormat[dataFormat.length - 1]
      return character === character.toLowerCase()
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }
  const isBinary = function (dataFormat){
    if (typeMap[dataFormat]) {
      return typeMap[dataFormat].type === "binary"
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }
  const isDecimal = function (dataFormat){
    if (typeMap[dataFormat]) {
      return typeMap[dataFormat].type === "decimal"
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }
  const isBaseDataFormat =  function(dataFormat){
    if(typeMap[dataFormat]) {
      return dataFormat.toLowerCase() === 'b'
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }

  for(dataFormat of Object.keys(typeMap)) {
    typeMap[dataFormat].asBaseValue = Math.pow(defaultUnit[typeMap[dataFormat].type],typeMap[dataFormat].unitOrder)
  }

  const convert = function(value, from, to) {
    if (isNumber(value)) {
      if (typeMap[from]) {
        if(typeMap[to]) {
          const fromIsByte = isByte(from)
          const toIsByte = isByte(to)
          let asBaseValue = -1
          if ((fromIsByte && toIsByte) || (!fromIsByte && !toIsByte)) {
            asBaseValue = value * typeMap[from].asBaseValue //  the value in bit or byte * the value of his dataFormat in bit or byte
          } else if (fromIsByte && !toIsByte) {
            asBaseValue = value * typeMap[from].asBaseValue * 8 //  the value in byte * the value of his dataFormat in byte * 8 to make this value in bit as 1 byte = 8 bit
          } else if (!fromIsByte && toIsByte) {
            asBaseValue = value * typeMap[from].asBaseValue / 8//  the value in bit * the value of his dataFormat in bit / 8 to make this value in byte as 8 bit = 1 byte
          }
          return asBaseValue / typeMap[to].asBaseValue // the value in bit or byte (depend in from e to dataFormat) / the value of the to data format in bit or byte
        } else throw new Error('"to" paramater isn\'t a valid dataFormat')
      } else throw new Error('"from" paramater isn\'t a valid dataFormat')
    } else throw new Error('"value" paramater isn\'t a valid number')
  }
  const compareValue = function(value1, dataFormat1, value2, dataFormat2, isDescendent) {
    isDescendent = (isDescendent?!!isDescendent:false)
    if(isNumber(value1)){
      if (typeMap[dataFormat1]) {
        if(isNumber(value2)){
          if (typeMap[dataFormat2]) {
            function val(value, dataformat){
              if(dataformat === 'b' || dataFormat1 === dataFormat2) {
                return value
              } else {
                return convert(value, dataformat, 'b')
              }
            }
            const val1 = val(value1, dataFormat1)
            const val2 = val(value2, dataFormat2)
            log('isDescendent:', isDescendent)
            log('val1:', val1, 'val2:', val2)
            if(val1 < val2) return (isDescendent ? 1 : -1)
            if(val1 === val2) return 0
            if(val1 > val2) return (isDescendent ? -1 : 1)
          } else throw new Error('"dataFormat2" paramater isn\'t a valid dataFormat')
        } else throw new Error('"value2" paramater isn\'t a valid number')
      } else throw new Error('"dataFormat1" paramater isn\'t a valid dataFormat')
    } else throw new Error('"value1" paramater isn\'t a valid number')
  }
  const compareTo = function(dataFormat1, dataFormat2, isDescendent) {
    return compareValue(1, dataFormat1, 1, dataFormat2, isDescendent)
  }

  const getDataFormat = function(dataFormat) {
    if(typeMap[dataFormat]) {
      const obj = Object.assign({},typeMap[dataFormat])
      obj.dataFormat=dataFormat
      return obj
    } else throw new Error('"dataFormat" paramater isn\'t a valid dataFormat')
  }

  const obj ={
    get typeMap(){
      return Object.assign({},typeMap)
    },
    get typeList(){
      const arr = []
      for(const unit of Object.keys(typeMap)){
        arr.push({dataFormat:unit, ...typeMap[unit]})
      }
      arr.sort(
        function(a, b){
          log('a:',a,'b:',b)
          return compareTo(a.dataFormat,b.dataFormat)
        }
      )
      return arr
    },
    convert,
    isBit,
    isByte,
    isBinary,
    isDecimal,
    isBaseDataFormat,
    compareTo,
    compareValue,
    getDataFormat
  }
  const defaultAutoScaleOptions = {
    preferByte: false,
    preferBit: false,
    preferBinary: false,
    preferDecimal: false,
    preferSameBase: true,
    preferOppositeBase: false,
    preferSameUnit: true,
    preferOppositeUnit: false,
    handler: (curDataFormat,isUppingDataFormat) => { return true }
  }
  const autoScale = function(value, dataFormat, options) {
    if (!isNumber(value)) throw new Error('"value" paramater isn\'t a valid number')
    dataFormat = getDataFormat(dataFormat)
    options = options || defaultAutoScaleOptions
    for(const defaultOption of Object.keys(defaultAutoScaleOptions)){
      if(!( options[defaultOption] === true || options[defaultOption] === false) && defaultOption !== 'handler'){
        options[defaultOption] = false
      }
      if( defaultOption === 'handler' && !(options[defaultOption] && typeof options[defaultOption] === 'function')){
        options[defaultOption] = defaultAutoScaleOptions[defaultOption]
      }
    }
    const retVal = {value,dataFormat:dataFormat.dataFormat}
    function scale(filteredList) {
      log('scale int fn called:',filteredList)
      for(let i = 0; i<filteredList.length; i++){
        const { unit } = filteredList[i]
        const newVal = obj.convert(value,dataFormat.dataFormat,unit)
        log('newVal:',newVal, 'newUnit:',unit)
        if((newVal < 1000 && newVal >= 1) || i === filteredList.length-1) {
          return {value:newVal, unit}
        }
      }
      return retVal
    }
    const filterList = (curDataFormat,isUppingDataFormat) => {
      let retVal = true
      log(options)
      if(options.preferSameBase && !(options.preferBinary || options.preferDecimal || options.preferOppositeBase)){
        log('isUppingDataFormat:',isUppingDataFormat)
        log('isBaseUnit(curDataFormat.dataFormat):',isBaseDataFormat(curDataFormat.dataFormat))
        log('isBaseUnit(dataFormat.dataFormat):',isBaseDataFormat(dataFormat.dataFormat))
        log('isDecimal(dataFormat.dataFormat):',isDecimal(dataFormat.dataFormat))
        log('isDecimal(curDataFormat.dataFormat)',isDecimal(curDataFormat.dataFormat))
        log('isBinary(dataFormat.dataFormat)',isBinary(dataFormat.dataFormat))
        log('isBinary(curDataFormat.dataFormat)',isBinary(curDataFormat.dataFormat))

        if(
            !(isBaseDataFormat(curDataFormat.dataFormat) && !isUppingDataFormat) && (
              isDecimal(dataFormat.dataFormat) !== isDecimal(curDataFormat.dataFormat) ||
              isBinary(dataFormat.dataFormat) !== isBinary(curDataFormat.dataFormat)
            )
          ){
          log('preferSameBase')
          retVal = false
        }
      }
      if(options.preferSameUnit && !(options.preferByte || options.preferBit || options.preferOppositeUnit)){
        if(isByte(dataFormat.dataFormat) !== isByte(curDataFormat.dataFormat) ||
            isBit(dataFormat.dataFormat) !== isBit(curDataFormat.dataFormat)
          ){
          log('preferSameUnit')
          retVal = false
        }
      }
      if(options.preferOppositeBase && !(options.preferBinary || options.preferDecimal || options.preferSameBase)){
        if(
            !(isBaseDataFormat(curDataFormat.dataFormat) && !isUppingDataFormat) && (
              isDecimal(dataFormat.dataFormat) === isDecimal(curDataFormat.dataFormat) ||
              isBinary(dataFormat.dataFormat) === isBinary(curDataFormat.dataFormat)
            )
          ){
          log('preferOppositeBase')
          retVal = false
        }
      }
      if(options.preferOppositeUnit && !(options.preferByte || options.preferBit || options.preferSameUnit)){
        if(isByte(dataFormat.dataFormat) === isByte(curDataFormat.dataFormat) ||
            isBit(dataFormat.dataFormat) === isBit(curDataFormat.dataFormat)
          ){
          log('preferOppositeUnit')
          retVal = false
        }
      }
      if(!options.preferSameBase && !options.preferOppositeBase && options.preferBinary && !options.preferDecimal) {
        if(isDecimal(curDataFormat.dataFormat)){
          log('preferBinary')
          retVal = false
        }
      }
      if(!options.preferSameBase && !options.preferOppositeBase && !options.preferBinary && options.preferDecimal) {
        if(isBinary(curDataFormat.dataFormat)){
          log('preferDecimal')
          retVal = false
        }
      }
      if(!options.preferSameUnit && !options.preferOppositeUnit && options.preferByte && !options.preferBit){
        if(isBit(curDataFormat.dataFormat)){
          log('preferByte')
          retVal = false
        }
      }
      if(!options.preferSameUnit && !options.preferOppositeUnit && !options.preferByte && options.preferBit){
        if(isByte(curDataFormat.dataFormat)){
          log('preferBit')
          retVal = false
        }
      }
      return retVal
    }
    if(value >= 1000){
      log('value bigger or equals to 1000')
      const filteredList = obj.typeList.filter((curDataFormat)=>{
        const compare = obj.compareTo(dataFormat.dataFormat,curDataFormat.dataFormat)
        const filter = (compare < 0 ? filterList(curDataFormat,true) : true)
        const handler =  options.handler(curDataFormat,true)
        log('curDataFormat:',curDataFormat,'compareTo:',compare,'filter:',filter,'handler:',handler)
        return compare < 0 && filter && handler
      })
      return scale(filteredList,true)
    } else if(value < 1){
      log('value less then 1')
      const filteredList = obj.typeList.filter((curDataFormat)=>{
        const compare = obj.compareTo(dataFormat.dataFormat,curDataFormat.dataFormat)
        const filter = (compare > 0 ? filterList(curDataFormat,false) : true)
        const handler =  options.handler(curDataFormat,false)
        log('curDataFormat:',curDataFormat,'compareTo:',compare,'filter:',filter,'handler:',handler)
        return compare > 0 && filter && handler
      })
      filteredList.sort((a, b) => {return compareTo(a.dataFormat,b.dataFormat,true)})
      return scale(filteredList,false)
    }
    return retVal
  }

  return {
    ...obj,
    autoScale,
    get defaultAutoScaleOptions(){
      return Object.assign({},defaultAutoScaleOptions)
    }
  }
}
// console.log('module:',module)s
if(typeof module !== 'undefined') {
  module.exports = ByteConverter
  // console.log('module.exports exists:',module.exports)
}
