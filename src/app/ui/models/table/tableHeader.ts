import { ITableCell } from "./ITableCell";
export class TableHeader implements ITableCell {
    label: string;
    isSortable?: boolean = false;
    isGroupable?: boolean = false;
    summarizeWhenGrouped?: boolean = false;

    constructor(init?: Partial<TableHeader>) {
        Object.assign(this, init);
    }
}