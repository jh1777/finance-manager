import { Component, Input, OnInit } from '@angular/core';
import { ITableCell } from '../models/ITableCell';
import { TableRow } from '../models/tableRow';
import { TableRowAction } from '../models/tableRowAction';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input()
  rows: Array<TableRow> = [];
  
  @Input()
  header: Array<ITableCell> = [];

  @Input()
  footer: string;




  constructor() { }

  ngOnInit(): void {
  }

  public hasActions(): boolean {
    return this.rows.some(r => r.actions.length > 0);
  }

  public callback(id: number, $event: TableRowAction) {
    $event.action(id);
  }
}

