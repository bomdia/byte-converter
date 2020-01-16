# byte-converter
Convert any value from a bit/byte unit measure to an another bit/byte measure, this package is compliant to IEC standard. EX: you can convert from KiB to kB or to Kib

HOW TO USE: 

ES6 syntax:

    import ByteConverter from '@wtfcode/byte-converter'
    console.log(ByteConverter(1,'B','b')) //will output 8

ES5 syntax:

    const ByteConverter = require('@wtfcode/byte-converter').default
    console.log(ByteConverter(1024,'MiB','GiB')) //will output 1
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
