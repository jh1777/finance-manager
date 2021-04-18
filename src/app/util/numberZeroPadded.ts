declare global {
    export interface Number {
        PadWithZero(): string;
    }
}

Number.prototype.PadWithZero = function (this: number) {
    return this < 10 ? `0${this}` : `${this}`;
}
export { }