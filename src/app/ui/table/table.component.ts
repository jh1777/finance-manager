import { Component, Input, OnInit } from '@angular/core';
import { ITableCell } from '../models/ITableCell';
import { TableRow } from '../models/tableRow';

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

}

