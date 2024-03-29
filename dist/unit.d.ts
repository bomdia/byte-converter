import { UnitNames, IBaseUnitEntry, IAutoScaleOptions, IUnitEntry, UnitType, UnitMap, AutoScaleOptionDefaults } from './types';
export declare class Unit implements IUnitEntry {
    static get map(): UnitMap;
    static get AutoScaleDefaults(): AutoScaleOptionDefaults;
    static get AutoScaleDefault(): IAutoScaleOptions;
    static [Symbol.iterator](): Iterator<Unit>;
    readonly unit: UnitNames;
    readonly type: UnitType;
    readonly unitOrder: number;
    readonly name: string;
    constructor(unit: UnitNames, format: IBaseUnitEntry);
    toString(): string;
    get asBaseUnit(): number;
    get baseUnit(): UnitNames;
    get isInByte(): boolean;
    get isInBit(): boolean;
    get isBinary(): boolean;
    get isDecimal(): boolean;
    get isBit(): boolean;
    get isByte(): boolean;
    get isBaseUnit(): boolean;
    static unit(unit: UnitNames | Unit): Unit;
    static value(value: number, unit: UnitNames | Unit): UnitValue;
    static compare(unitA: UnitNames | Unit, unitB: UnitNames | Unit, descendent?: boolean): -1 | 0 | 1;
    value(value: number): UnitValue;
    compare(to: Unit | UnitNames, descendent?: boolean): -1 | 0 | 1;
}
export declare class UnitValue {
    readonly unit: Unit;
    readonly value: number;
    constructor(value: number, unit: Unit | UnitNames);
    static get AutoScaleDefaults(): AutoScaleOptionDefaults;
    static get AutoScaleDefault(): IAutoScaleOptions;
    formatted(): string;
    toString(): string;
    convert(to: Unit | UnitNames): UnitValue;
    compare(to: UnitValue, descendent?: boolean): -1 | 0 | 1;
    deepEquals(to: UnitValue): boolean;
    equals(to: UnitValue): boolean;
    autoScale(options?: Partial<IAutoScaleOptions>): UnitValue;
    plus(value: UnitValue, options?: Unit | Partial<IAutoScaleOptions>): UnitValue;
    minus(value: UnitValue, options?: Unit | Partial<IAutoScaleOptions>): UnitValue;
    multiply(value: UnitValue, options?: Unit | Partial<IAutoScaleOptions>): UnitValue;
    divide(value: UnitValue, options?: Unit | Partial<IAutoScaleOptions>): UnitValue;
}
declare const _default: UnitMap;
export default _default;
