import { Unit, UnitValue } from './unit';
import { AutoScaleDefaultNames, AutoScaleOptionDefaults, UnitMap, UnitNames, IAutoScaleOptions } from './types';
export declare class ByteConverter {
    static get units(): UnitMap;
    static get unitNames(): UnitNames[];
    static get unitsList(): Unit[];
    static get autoScaleDefaults(): AutoScaleOptionDefaults;
    static get autoScaleDefaultNames(): AutoScaleDefaultNames[];
    static get autoScaleDefaultsList(): IAutoScaleOptions[];
    static [Symbol.iterator](): Iterator<Unit>;
    static unit(unit: UnitNames): Unit;
    static value(value: number, unit: Unit | UnitNames): UnitValue;
    static convert(from: UnitValue, to: Unit | UnitNames): UnitValue;
    static compareFormat(from: Unit | UnitNames, to: Unit | UnitNames, descendent?: boolean): -1 | 0 | 1;
    static compareValue(from: UnitValue, to: UnitValue, descendent?: boolean): -1 | 0 | 1;
    static autoScale(from: UnitValue, options?: Partial<IAutoScaleOptions>): UnitValue;
    static plus(a: UnitValue, b: UnitValue, options?: Unit | Partial<IAutoScaleOptions>): UnitValue;
    static minus(a: UnitValue, b: UnitValue, options?: Unit | Partial<IAutoScaleOptions>): UnitValue;
    static multiply(a: UnitValue, b: UnitValue, options?: Unit | Partial<IAutoScaleOptions>): UnitValue;
    static divide(a: UnitValue, b: UnitValue, options?: Unit | Partial<IAutoScaleOptions>): UnitValue;
}
export default ByteConverter;
export { Unit, UnitValue } from './unit';
