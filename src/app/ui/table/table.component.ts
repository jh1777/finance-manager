import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITableCell } from '../models/table/ITableCell';
import { TableRow } from '../models/table/tableRow';
import { TableRowAction } from '../models/table/tableRowAction';
import { TableSize } from '../models/table/tableSize';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit {
  public tableSizeEnum = TableSize;

  @Input()
  rows: Array<TableRow> = [];
  
  @Input()
  header: Array<ITableCell> = [];

  @Input()
  footer: string;

  @Input()
  size: TableSize = TableSize.Small;

  @Output()
  rowAction = new EventEmitter<TableRow>();

  constructor() { }

  ngOnInit(): void {
  }

  public rowEvent(row: TableRow) {
    this.rowAction.emit(row);
  }
  
  public hasActions(): boolean {
    return this.rows.some(r => r.actions.length > 0);
  }

  public callback(id: number, $event: TableRowAction) {
    $event.action(id);
  }

  public cellAction(cell: ITableCell) {
    console.log("Action in Cell triggered:", cell);
    cell.action();
  }
}

