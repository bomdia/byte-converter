
# byte-converter
Convert any value from a bit/byte dataFormat to an another bit/byte dataFormat, this package is compliant to IEC standard. EX: you can convert from KiB to kB or to Kib
Use the autoScale function for scale a given value and dataFormat to te best dataFormat for representing the value
HOW TO USE:

ES6 syntax:

    import ByteConverter from '@wtfcode/byte-converter'

    const byteConverter = new ByteConverter()
    console.log(byteConverter.convert(1,'B','b')) //will output 8
    console.log(byteConverter.autoScale(1024,'B'))
    //will output:
    {value: 1, dataFormat: "KiB"} // the function return the value and the final dataFormat


ES5 syntax:

    const ByteConverter = require('@wtfcode/byte-converter').default

    const byteConverter = new ByteConverter()
    console.log(byteConverter.convert(1024,'MiB','GiB')) //will output 1

    console.log(byteConverter.autoScale(0.7,'GB')) //the function accept a third paramater: an object with some property
    //will output:
    {value: 700, dataFormat: "MB"}

BROWSER use example


    <html>
      <head>
        <title> test </title>
        <style>
          input[type=button] {
            width: 100px
          }
        </style>
        <script src="dist/byte-converter.min.js"></script>
        <script>
        function ready () {
          console.log('ready called')
          window.converter = new ByteConverter.default()
          window.result = document.getElementById('result')
          window.selFrom = document.getElementById('selectFrom')
          window.selTo = document.getElementById('selectTo')
          window.val = document.getElementById('val')
          function recurseListAndCreateElement (destination, isDescendent) {
            const sorted = window.converter.typeList.sort(function (a, b) { return window.converter.compareTo(a.dataFormat, b.dataFormat, isDescendent) })
            for (const { dataFormat, name } of sorted) {
              const opt = document.createElement('option')
              opt.value = dataFormat
              opt.innerText = '(' + dataFormat + ') ' + name
              destination.appendChild(opt)
            }
          }
          recurseListAndCreateElement(window.selFrom)
          recurseListAndCreateElement(window.selTo, true)
        }
        function calc () {
          window.result.value = window.converter.convert(window.val.value, window.selFrom.value, window.selTo.value)
        }
        function change () {
          const from = window.selFrom.value
          const to = window.selTo.value
          window.selTo.value = from
          window.selFrom.value = to
        }
        window.onload = function () { ready() }
        </script>
      </head>
      <body>
        <table>
          <tr>
            <td>from:</td>
            <td><input type="text" id="val"></input></td>
            <td><select id="selectFrom"></select></td>
            <td><input type="button" onclick="change()" value="switch"></input></td>
          </tr>
          <tr>
            <td>to:</td>
            <td><input type="text" disabled id="result"></input></td>
            <td><select id="selectTo"></select></td>
            <td><input type="button" onclick="calc()" value="calc"></input></td>
          </tr>
        </table>
      </body>
    </html>

AVAILABLE dataFormat:

dataFormat|bit|byte|binary|decimal|
|--|--|--|--|--|
|b  |X||X||
|B  ||X|X||
|kb |X|||X|
|kB ||X||X|
|Kib|X||X||
|KiB||X|X||
|Mb |X|||X|
|MB ||X||X|
|Mib|X||X||
|MiB||X|X||
|Gb |X|||X|
|GB ||X||X|
|Gib|X||X||
|GiB||X|X||
|Tb |X|||X|
|TB ||X||X|
|Tib|X||X||
|TiB||X|X||
|Pb |X|||X|
|PB ||X||X|
|Pib|X||X||
|PiB||X|X||
|Eb |X|||X|
|EB ||X||X|
|Eib|X||X||
|EiB||X|X||
|Zb |X|||X|
|ZB ||X||X|
|Zib|X||X||
|ZiB||X|X||
|Yb |X|||X|
|YB ||X||X|
|Yib|X||X||
|YiB||X|X||

AVAILABLE class constructor paramater object property:
1. **logs**: Boolean (activate console.log of some thing is mostly useful for quick dev debug)

PROVIDED getters:
1. **typeMap**
	- return an object with as keys the available dataFormat with an object that describe it:
		- dataFormat: the dataFormat in iec notations
		- name: the name of the dataFormat
		- type: the type of the unit (decimal, binary)
		- unitOrder:  the relative order for the dataFormat (use compare function for comparing dataFormat)
		- asBaseValue: the value of 1 for the current dataformat in his base dataFormat (bit, byte)
2. **typeList**
	- return an ordered ascendant array of object:
		- dataFormat: the dataFormat in iec notations
		- name: the name of the dataFormat
		- type: the type of the unit (decimal, binary)
		- unitOrder:  the relative order for the dataFormat (use compare function for comparing dataFormat)
		- asBaseValue: the value of 1 for the current dataformat in his base dataFormat (bit, byte)
3. **defaultAutoScaleOptions**
	- return an object that represent the default autoScaleOption if the method is invoked without one:
		- preferByte: false,
		- preferBit: false,
		- preferBinary: false,
		- preferDecimal: false,
		- **preferSameBase: true**,
		- preferOppositeBase: false,
		- **preferSameUnit: true**,
		- preferOppositeUnit: false,
		- handler: (curDataFormat,isUppingDataFormat) => { return true }


PROVIDED function:

|Name|Description|Parameter|Throws|Return|
|--|--|--|------|--|
|**convert**|convert value from a dataFormat to another dataFormat|**value**: Number, **from**: available dataFormat, **to**: an available dataFormat| 3 different errors for each invalid parameter|the converted value as Number|
|**autoScale**|scale automatically a value in a dataFormat to a better readable dataFormat, accept a custom option object if one of the available property isn't setted then is false|**value**: Number, **dataFormat**: an available dataFormat, **options**: (OPTIONAL) an object like the default one or one empty for no default filtering the available dataFormat, the preference order is: preferSame>preferOpposite>prefer, you can set to true only 1 type of preference for base and unit|2 different errors for each invalid parameter|an object: { *value*: Number, *dataFormat*: the resulting dataFormat }|
|**getDataFormat**|retrieve an object that describe the requested dataFormat|**dataFormat**: an available dataFormat|error on invalid dataFormat parameter|dataFormatObject: { **dataFormat**: the dataFormat in iec notations (b,B...) , **name**: the name of the dataFormat, **type**: the type of the unit (decimal, binary), **unitOrder**:  the relative order for the dataFormat (use compare function for comparing dataFormat), **asBaseValue**: the value of 1 for the current dataformat in his base dataFormat (bit, byte) }|
|**isBit**|assert if a dataFormat is in Bit base|**dataFormat**: an available dataFormat|error on invalid dataFormat parameter|Boolean|
|**isByte**|assert if a dataFormat is in Byte base|**dataFormat**: an available dataFormat|error on invalid dataFormat parameter|Boolean|
|**isBinary**|assert if a dataFormat is Binary unit|**dataFormat**: an available dataFormat|error on invalid dataFormat parameter|Boolean|
|**isDecimal**|assert if a dataFormat is Decimal unit|**dataFormat**: an available dataFormat|error on invalid dataFormat parameter|Boolean|
|**isBaseDataFormat**|assert if a dataFormat is a bit or a byte|**dataFormat**: an available dataFormat|error on invalid dataFormat parameter|Boolean|
|**compareTo**|compare available dataFormat|**dataFormat1**: an available dataFormat, **dataFormat2**: an available dataFormat, **isDescendent**: Boolean|2 differents errors on invalid parameter|-1,0,1 in ascendent or descendent order|
|**compareValue**|compare values with available dataFormats|**value1**: Number, **dataFormat1**: an available dataFormat, **value2**: Number, **dataFormat2**: an available dataFormat, **isDescendent**: Boolean|4 differents errors on invalid parameter|-1,0,1 in ascendent or descendent order|
