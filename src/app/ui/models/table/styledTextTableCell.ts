import { TextTableCell } from "./textTableCell";

export class StyledTextTableCell extends TextTableCell {

    style?: any = {};

    constructor(init?: Partial<StyledTextTableCell>) {
        super(init);
        Object.assign(this, init);
    }
}