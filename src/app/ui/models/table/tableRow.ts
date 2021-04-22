import { ITableCell } from "./ITableCell";
import { TableRowAction } from "./tableRowAction";

export class TableRow {
    cells: Array<ITableCell> = [];
    actions: Array<TableRowAction> = [];
    hidden: boolean = false;
}