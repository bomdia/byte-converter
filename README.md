# byte-converter
Convert any value from a bit/byte unit measure to an another bit/byte measure, this package is compliant to IEC standard. EX: you can convert from KiB to kB or to Kib

HOW TO USE:

ES6 syntax:

    import ByteConverter from '@wtfcode/byte-converter'

    const byteConverter = new ByteConverter()
    console.log(byteConverter.convert(1,'B','b')) //will output 8

ES5 syntax:

    const ByteConverter = require('@wtfcode/byte-converter').default

    const byteConverter = new ByteConverter()
    console.log(byteConverter.convert(1024,'MiB','GiB')) //will output 1

BROWSER use example

    <html>
    	<head>
    		<title> test </title>
    		<style>
    			input[type=button] {
    			  width: 100px
    			}
    		</style>
    		<script src="/byte-converter/index.js"></script>
    		<script>
    		function ready(){
    			console.log('ready called')
    			converter = new ByteConverter()
    			result = document.getElementById("result")
    			selFrom = document.getElementById("selectFrom")
    			selTo = document.getElementById("selectTo")
    			val = document.getElementById("val")
    			function recurseListAndCreateElement(destination, isDescendent) {
    				sorted = converter.typeList.sort(function(a,b){return converter.compareTo(a.unit,b.unit,isDescendent)})
    				for({unit, name} of sorted){
    					opt = document.createElement('option')
    					opt.value = unit
    					opt.innerText = '(' + unit + ') ' + name
    					destination.appendChild(opt)
    				}
    			}
    			recurseListAndCreateElement(selFrom)
    			recurseListAndCreateElement(selTo,true)
    		}
    		function calc(){
    			result.value = converter.convert(val.value, selFrom.value, selTo.value)
    		}
    		function change() {
    			from = selFrom.value
    			to = selTo.value
    			selTo.value = from
    			selFrom.value = to
    		}
    		window.onload = function(){ ready() }
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
AVAILABLE UNIT:

 - b
 - B
 - kb
 - kB
 - Kib
 - KiB
 - Mb
 - MB
 - Mib
 - MiB
 - Gb
 - GB
 - Gib
 - GiB
 - Tb
 - TB
 - Tib
 - TiB
 - Pb
 - PB
 - Pib
 - PiB
 - Eb
 - EB
 - Eib
 - EiB
 - Zb
 - ZB
 - Zib
 - ZiB
 - Yb
 - YB
 - Yib
 - YiB

AVAILABLE class constructor paramater:
 1. **logs**: Boolean (activate console.log of some thing is mostly useful for quick dev debug)

PROVIDED getters:
1. **typeMap**
	- return an object with as keys the available unit with an object that describe it:
		- name: the name of the unit
		- type: the type of the unit (decimal, binary)
		- unitOrder:  the relative order for the unit (use compare function for comparing unit)
		- asBaseValue: the value of 1 of the unit in his base unit (decimal, binary)
2. **typeList**
	- return an ordered ascendant array of object:
		- unit: the unit in iec notations
		- name: the name of the unit
		- type: the type of the unit (decimal, binary)
		- unitOrder:  the relative order for the unit (use compare function for comparing unit)
		- asBaseValue: the value of 1 of the unit in his base unit (decimal, binary)

PROVIDED function:
1.  **convert** -> convert byte value
	- **parameter**:
		- **value**: Number,
		- **from**: available unit,
		- **to**: available unit
		- **throws**: 3 different errors for invalid parameter
	- **return** the converted value
2.   **isBit** -> assert if is Bit
	- **parameter**:
		- **dataFormat**: an available unit
	- **throw** error on invalid unit
	- **return** true or false
3.   **isByte** -> assert if is Byte
	- **parameter**:
		- **dataFormat**: an available unit
	- **throw** error on invalid unit
	- **return** the converted value
4.   **isBinary** ->assert if is Bynary Based
	- **parameter**:
		- **dataFormat**: an available unit
	- **throw** error on invalid unit
	- **return** the converted value
5.   **isDecimal** -> assert if is Decimal Based
	- **parameter**:
		- **dataFormat**: an available unit
	- **throw** error on invalid unit
	- **return** the converted value
6.   **compareTo** -> compare available unit
	- **parameter**:
		- **dataFormat1**: an available unit
		- **dataFormat2**: an available unit
		- **isDescendent**: Boolean
	- **throws** 2 differents errors on invalid parameter
	- **return** -1,0,1 in ascendent or descendent order
7.   **compareValue** -> compare values with available units
	- **parameter**:
		- **value1**: Number,
		- **dataFormat1**: an available unit
		- **value2**: Number,
		- **dataFormat2**: an available unit
		- **isDescendent**: Boolean
	- **throws** 4 differents errors on invalid parameter
	- **return** -1,0,1 in ascendent or descendent order
