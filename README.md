# [Full Documentation](https://bomdia.github.io/byte-converter/#/)

# Getting Started

**This package is compliant to IEC standard units.** see [Units Table](#units-table) for supported units  
Convert any value from a supported unit to an another supported unit.  
Compare any value or unit to another one.
Sum, Subtract, Multiply and Divide two value with any supported unit.  
Use the **autoScale** function for scale a given value and unit to te best unit for representing the value.

## Install

- `yarn add @wtfcode/byte-converter`

or

- `npm i @wtfcode/byte-converter`

## Exports

#### Default

- class **ByteConverter**

#### Named

- class **Unit**
- class **UnitValue**
- class **ByteConverter**
- const **b**: Unit
- const **B**: Unit

## Changelog

| from   | to     | description                                                                                                 |
| ------ | ------ | ----------------------------------------------------------------------------------------------------------- |
| 2.0.1  | 2.0.5  | Added Arithmetic method to UnitValue                                                                        |
|        | 2.0.1  | Rewrited the byteConverter implementation in typescript and heavily simplified the algorithm                |
| 1.7.10 | 1.7.11 | autoScale now choose between 1000 and 1024 if is decimal type or binary type, the autoscaling is now better |

## Example

ES6 syntax:

```js
import {
  ByteConverter,
  Unit,
  UnitValue,
  B as Byte,
} from "@wtfcode/byte-converter";

console.log(ByteConverter.convert(Byte.value(1), "b")); //will output 8

console.log(ByteConverter.convert(ByteConverter.value(1024, "MiB"), "GiB")); //will output 1

console.log(new UnitValue(1024, "B").autoScale());

//will output: UnitValue {value: 1, unit: Unit { unit: "KiB", type: "binary", unitOrder: 1, name: "kibibyte" ... } } // the function return a UnitValue scaled
```

ES5 syntax:

```js
const ByteConverter = require("@wtfcode/byte-converter").default;

console.log(ByteConverter.convert(ByteConverter.value(1024, "MiB"), "GiB")); //will output 1

console.log(ByteConverter.autoScale(ByteConverter.value(0.7, "GB"))); //the function accept a third paramater: an option object

//will output: UnitValue {value: 700, unit: Unit { unit: "MB", type: "decimal", unitOrder: 2, name: "megabyte" ... } }
```

## Units Table

| unit    | bit | byte | binary | decimal |
| ------- | --- | ---- | ------ | ------- |
| **b**   | ✅  |      | ✅     |         |
| **B**   |     | ✅   | ✅     |         |
| **kb**  | ✅  |      |        | ✅      |
| **kB**  |     | ✅   |        | ✅      |
| **Kib** | ✅  |      | ✅     |         |
| **KiB** |     | ✅   | ✅     |         |
| **Mb**  | ✅  |      |        | ✅      |
| **MB**  |     | ✅   |        | ✅      |
| **Mib** | ✅  |      | ✅     |         |
| **MiB** |     | ✅   | ✅     |         |
| **Gb**  | ✅  |      |        | ✅      |
| **GB**  |     | ✅   |        | ✅      |
| **Gib** | ✅  |      | ✅     |         |
| **GiB** |     | ✅   | ✅     |         |
| **Tb**  | ✅  |      |        | ✅      |
| **TB**  |     | ✅   |        | ✅      |
| **Tib** | ✅  |      | ✅     |         |
| **TiB** |     | ✅   | ✅     |         |
| **Pb**  | ✅  |      |        | ✅      |
| **PB**  |     | ✅   |        | ✅      |
| **Pib** | ✅  |      | ✅     |         |
| **PiB** |     | ✅   | ✅     |         |
| **Eb**  | ✅  |      |        | ✅      |
| **EB**  |     | ✅   |        | ✅      |
| **Eib** | ✅  |      | ✅     |         |
| **EiB** |     | ✅   | ✅     |         |
| **Zb**  | ✅  |      |        | ✅      |
| **ZB**  |     | ✅   |        | ✅      |
| **Zib** | ✅  |      | ✅     |         |
| **ZiB** |     | ✅   | ✅     |         |
| **Yb**  | ✅  |      |        | ✅      |
| **YB**  |     | ✅   |        | ✅      |
| **Yib** | ✅  |      | ✅     |         |
| **YiB** |     | ✅   | ✅     |         |
