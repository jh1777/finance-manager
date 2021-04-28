import { ITableCell } from "./ITableCell";

export class TextTableCell implements ITableCell {
    label: string;
    id?: number;
    action?: () => void;
    actionIcon?: string;

    constructor(init?: Partial<TextTableCell>) {
        Object.assign(this, init);
    }
}