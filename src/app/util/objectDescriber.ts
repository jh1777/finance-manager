export class Describer {
    static describe<T>(instance: T): Array<string> {
        return Object.getOwnPropertyNames(instance);
    }
}