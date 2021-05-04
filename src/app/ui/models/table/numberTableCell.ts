import { TextTableCell } from "./textTableCell";

export class NumberTableCell extends TextTableCell {
    numericValue: number;

    constructor(init?: Partial<NumberTableCell>) {
        super(init);
        Object.assign(this, init);
    }
}