# byte-converter
Convert any value from a bit/byte unit measure to an another bit/byte measure, this package is compliant to IEC standard. EX: you can convert from KiB to kB or to Kib

HOW TO USE: 

ES6 syntax:

    import ByteConverter from 'byte-converter'
    console.log(ByteConverter(1,'B','b')) //will output 8

ES5 syntax:

    const ByteConverter = require('byte-converter').default
    console.log(ByteConverter(1024,'MiB','GiB')) //will output 1
