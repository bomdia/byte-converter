# byte-converter

Convert any value from a bit/byte dataFormat to an another bit/byte dataFormat, this package is compliant to IEC standard. EX: you can convert from KiB to kB or to Kib
Use the autoScale function for scale a given value and dataFormat to te best dataFormat for representing the value

CHANGES:

2.0.1 => (Rewrited the byteConverter implementation in typescript and heavily simplified the algorithm)

1.7.10 => 1.7.11 (autoScale now choose between 1000 and 1024 if is decimal type or binary type, the autoscaling is now better)

HOW TO USE:

ES6 syntax:

    import { ByteConverter, Unit, UnitValue } from '@wtfcode/byte-converter'

    console.log(ByteConverter.convert(ByteConverter.value(1,'B'),'b'))
    //will output 8
    console.log(new UnitValue(1024,'B').autoScale())
    //will output:
    UnitValue {value: 1, unit: Unit { unit: "KiB", type: "binary", unitOrder: 1, name: "kibibyte" ... } } // the function return a UnitValue scaled

ES5 syntax:

    const ByteConverter = require('@wtfcode/byte-converter').default

    console.log(ByteConverter.convert(ByteConverter.value(1024,'MiB'),'GiB')) //will output 1

    console.log(ByteConverter.autoScale(ByteConverter.value(0.7,'GB'))) //the function accept a third paramater: an object with some property
    //will output:
     UnitValue {value: 700, unit: Unit { unit: "MB", type: "decimal", unitOrder: 2, name: "megabyte" ... } }

AVAILABLE dataFormat:

| dataFormat | bit | byte | binary | decimal |
| ---------- | --- | ---- | ------ | ------- |
| b          | X   |      | X      |         |
| B          |     | X    | X      |         |
| kb         | X   |      |        | X       |
| kB         |     | X    |        | X       |
| Kib        | X   |      | X      |         |
| KiB        |     | X    | X      |         |
| Mb         | X   |      |        | X       |
| MB         |     | X    |        | X       |
| Mib        | X   |      | X      |         |
| MiB        |     | X    | X      |         |
| Gb         | X   |      |        | X       |
| GB         |     | X    |        | X       |
| Gib        | X   |      | X      |         |
| GiB        |     | X    | X      |         |
| Tb         | X   |      |        | X       |
| TB         |     | X    |        | X       |
| Tib        | X   |      | X      |         |
| TiB        |     | X    | X      |         |
| Pb         | X   |      |        | X       |
| PB         |     | X    |        | X       |
| Pib        | X   |      | X      |         |
| PiB        |     | X    | X      |         |
| Eb         | X   |      |        | X       |
| EB         |     | X    |        | X       |
| Eib        | X   |      | X      |         |
| EiB        |     | X    | X      |         |
| Zb         | X   |      |        | X       |
| ZB         |     | X    |        | X       |
| Zib        | X   |      | X      |         |
| ZiB        |     | X    | X      |         |
| Yb         | X   |      |        | X       |
| YB         |     | X    |        | X       |
| Yib        | X   |      | X      |         |
| YiB        |     | X    | X      |         |
