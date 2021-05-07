export class TableSpan {
    columnsToSpan: number;
    columnId: number;
    constructor(init?: Partial<TableSpan>) {
        Object.assign(this, init);
    }
}