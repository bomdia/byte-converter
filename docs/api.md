# API

### AutoScale Option

All property of the object can be omitted and the default will be loaded instead

- **IAutoScaleOptions**:
  - **type**: AutoScalePreferType
    - choose the preferred type for autoScale
  - **unit**: AutoScalePreferUnit
    - choose the preferred unit for autoScale
  - **filter**(unit: Unit, isScalingUp: boolean): boolean
    - callback invoked for additionally filtering the available units
    - invoked with the UnitValue as **this**
    - returns false for keeping and true for filtering out the unit

##### Enums

- **AutoScalePreferType**:
  | Key | Value |
  |-----|-------|
  | SAME | same |
  | OPPOSITE | opposite|
  | DECIMAL | decimal |
  | BINARY | binary |
- **AutoScalePreferUnit**:
  |Key|Value|
  |---|-----|
  |SAME|same|
  |OPPOSITE|opposite|
  |BIT|bit|
  |BYTE|byte|

---

### Unit

**Don't Instanciate new instances!** use static method **unit(name)**
The Unit class represent only the format and provide only method to work on it  
is **static iterable** and will return all unit

##### Static Properties

- **map**: UnitMap
  - a map of all Unit instances 1 for unit
- **AutoScaleDefaults**: AutoScaleOptionDefaults
  - a map of possible autoScale default option
- **AutoScaleDefault**: IAutoScaleOptions
  - the default autoScale option

##### Instance Properties

- **unit**: UnitNames
  - is the format for the name ex: MiB
- **type**: UnitType
  - can be decimal or binary
- **unitOrder**: number
  - the position of the unit (type and base unit doesn't count)
- **asBaseUnit**: number
  - the value of the unit in is base unit
- **baseUnit**: UnitNames
  - the base unit of the unit (bit or Byte)
- **isInByte**: boolean
  - true if the baseUnit is Byte
- **isInBit**: boolean
  - true if the baseUnit is bit
- **isBinary**: boolean
  - true if the type is binary
- **isDecimal**: boolean
  - true if the type is decimal
- **isByte**: boolean
  - true if the unit is Byte
- **isBit**: boolean
  - true if the unit is bit
- **isBaseUnit**: boolean
  - true if the unit is a baseUnit (bit or Byte)

##### Instance Methods

- **toString**(): string
  - return the unit property
- **value**(value: number): UnitValue
  - return a new UnitValue with the specificated value and with this unit
- **compare**(to: UnitNames | Unit, descendent?: boolean): -1 | 0 | 1
  - compare this unit to the arg unit using ascendent or descendent order

##### Static Methods

- **unit**(unit: UnitNames | Unit): Unit
  - return the corrispondent Unit
- **value**(value: number, unit: UnitNames | Unit): UnitValue
  - return a new UnitValue with value and unit from argouments
- **compare**(unitA: UnitNames | Unit, unitB: UnitNames | Unit, descendent?: boolean): -1 | 0 | 1
  - compare this unit to the arg unit using ascendent or descendent order
  - if descendent isn't specificated the order is ascendent

---

### UnitValue

The UnitValue class represent a Value with his Unit.  
It's this class that provide the main Methods for working with units and values

##### Instance Creation

- **value**: number
- **unit**: Unit | UnitNames

##### Instance Properties

- **value**: number
- **unit**: Unit

##### Static Properties

- **AutoScaleDefaults**: AutoScaleOptionDefaults
  - a map of possible autoScale default option
- **AutoScaleDefault**: IAutoScaleOptions
  - the default autoScale option

##### Methods

- **formatted**(): string
  - return this UnitValue as a formatted string using toLocaleString for the value
- **toString**(): string
  - return the value concatenated to the unit
- **convert**(to: Unit | UnitNames): UnitValue
  - return a **new UnitValue** with the converted value to the arg unit
- **compare**(to: UnitValue, descendent?: boolean): -1 | 0 | 1
  - compare this UnitValue to arg UnitValue using ascending or descending order
  - if descendent isn't specificated the order is ascendent
- **deepEquals**(to: UnitValue): boolean
  - true only if this UnitValue has same unit and value of the arg UnitValue
- **equals**(to: UnitValue): boolean
  - compare this UnitValue to arg UnitValue and return if has the same value whetever the unit is
- **autoScale**(options: Partial<IAutoScaleOptions\> = UnitValue.AutoScaleDefault): UnitValue
  - find a good unit to better display this UnitValue to human
  - accepts options for scaling see [AutoScale Option](#autoscale-option)
  - return a **new UnitValue** with founded unit or **this** if can't find anything
- **plus**(value: UnitValue, options?: Unit | Partial<IAutoScaleOptions/>): UnitValue
  - if options is omitted the new Unit will be the same of this UnitValue
  - if options is a Unit this will be the new Unit used
  - if options is and AutoScale Option object the result will be autoScaled according to the options passed
  - return a **new UnitValue** that represent the sum from this and arg UnitValue
- **minus**(value: UnitValue, options?: Unit | Partial<IAutoScaleOptions/>): UnitValue
  - if options is omitted the new Unit will be the same of this UnitValue
  - if options is a Unit this will be the new Unit used
  - if options is and AutoScale Option object the result will be autoScaled according to the options passed
  - return a **new UnitValue** that represent the subtraction from this and arg UnitValue
- **multiply**(value: UnitValue, options?: Unit | Partial<IAutoScaleOptions/>): UnitValue
  - if options is omitted the new Unit will be the same of this UnitValue
  - if options is a Unit this will be the new Unit used
  - if options is and AutoScale Option object the result will be autoScaled according to the options passed
  - return a **new UnitValue** that represent the moltiplication from this and arg UnitValue
- **divide**(value: UnitValue, options?: Unit | Partial<IAutoScaleOptions/>): UnitValue
  - if options is omitted the new Unit will be the same of this UnitValue
  - if options is a Unit this will be the new Unit used
  - if options is and AutoScale Option object the result will be autoScaled according to the options passed
  - return a **new UnitValue** that represent the division from this and arg UnitValue

---

### ByteConverter

The ByteConverter class is a **static wrapper** around Unit class and UnitValue class  
provide all method and properties needed to work with this library  
The ByteConverter class wrap the Unit static iterable behavior so you can iterate over all unit from ByteConverter too.  
The choose to use this wrapper or UnitValue class is up to you they behave the same.

##### Static Properties

- **units** : UnitMap
  - the map of all Unit Supported
- **unitNames** : UnitNames[]
  - the names of all Unit Supported ex: B, b, kB ...
- **unitsList** : Unit[]
  - an array with all Unit Supported
- **autoScaleDefaults** : AutoScaleOptionDefaults
  - the map of all precompiled defaults autoScale option
- **autoScaleDefaultNames** : AutoScaleDefaultNames[]
  - the names of all precompiled defaults autoScale option
- **autoScaleDefaultsList** : IAutoScaleOptions[]
  - an array with all precompiled defaults autoScale option

##### Static Methods

- **unit**(unit: UnitNames): Unit
  - return the corrispondent Unit
- **value**(value: number, unit: Unit | UnitNames): UnitValue
  - return a new UnitValue with value and unit from argouments
- **convert**(from: UnitValue, to: Unit | UnitNames): UnitValue
  - return a **new UnitValue** with the converted value of "from UnitValue" to "to Unit"
- **compareFormat**(from: Unit | UnitNames, to: Unit | UnitNames, descendent?: boolean): -1 | 0 | 1
  - compare "from unit" to "to unit" using ascendent or descendent order
  - if descendent isn't specificated the order is ascendent
- **compareValue**(from: UnitValue, to: UnitValue, descendent?: boolean): -1 | 0 | 1
  - compare "from UnitValue" to "to UnitValue" using ascending or descending order
  - if descendent isn't specificated the order is ascendent
- **autoScale**(from: UnitValue, options?: Partial<IAutoScaleOptions/>): UnitValue
  - find a good unit to better display "from UnitValue" to human
  - accepts options for scaling see [AutoScale Option](#autoscale-option)
  - return a **new UnitValue** with founded unit, or "**from UnitValue**" if can't find anything
- **plus**(a: UnitValue, b: UnitValue, options?: Unit | Partial<IAutoScaleOptions/>): UnitValue
  - if options is omitted the new Unit will be the same of this UnitValue
  - if options is a Unit this will be the new Unit used
  - if options is and AutoScale Option object the result will be autoScaled according to the options passed
  - return a **new UnitValue** that represent the sum of "from UnitValue" and "to UnitValue"
- **minus**(a: UnitValue, b: UnitValue, options?: Unit | Partial<IAutoScaleOptions/>): UnitValue
  - if options is omitted the new Unit will be the same of this UnitValue
  - if options is a Unit this will be the new Unit used
  - if options is and AutoScale Option object the result will be autoScaled according to the options passed
  - return a **new UnitValue** that represent the subtraction of "from UnitValue" and "to UnitValue"
- **multiply**(a: UnitValue, b: UnitValue, options?: Unit | Partial<IAutoScaleOptions/>): UnitValue
  - if options is omitted the new Unit will be the same of this UnitValue
  - if options is a Unit this will be the new Unit used
  - if options is and AutoScale Option object the result will be autoScaled according to the options passed
  - return a **new UnitValue** that represent the moltiplication of "from UnitValue" and "to UnitValue"
- **divide**(a: UnitValue, b: UnitValue, options?: Unit | Partial<IAutoScaleOptions/>): UnitValue
  - if options is omitted the new Unit will be the same of this UnitValue
  - if options is a Unit this will be the new Unit used
  - if options is and AutoScale Option object the result will be autoScaled according to the options passed
  - return a **new UnitValue** that represent the division of "from UnitValue" and "to UnitValue"
