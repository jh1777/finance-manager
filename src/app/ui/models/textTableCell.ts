import { ITableCell } from "./ITableCell";

export class TextTableCell implements ITableCell {
    label: string;
    id?: number;
    type: "text" | "header" = 'text';
    constructor(label: string) {
        this.label = label;
    }
    
}