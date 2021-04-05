import { Component, OnInit } from '@angular/core';
import { ITableCell } from 'src/app/ui/models/ITableCell';
import { TableRow } from 'src/app/ui/models/tableRow';
import { TextTableCell } from 'src/app/ui/models/textTableCell';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {

  public rows: Array<TableRow> = [];
  public header: Array<ITableCell> = [];

  constructor() { 

    this.createMockdata();

  }

  ngOnInit(): void {
  }

  private createMockdata() {
    this.header.push({
      label: 'No.',
      type: 'header'
    });
    this.header.push({
      label: 'Monat',
      type: 'header'
    });
    this.header.push({
      label: 'Brutto',
      type: 'header'
    });

    let row = new TableRow();
    let cell = new TextTableCell();
    cell.label = "1";
    row.cells.push(cell);
    cell = new TextTableCell();
    cell.label = "2020/03";
    row.cells.push(cell);
    cell = new TextTableCell();
    cell.label = "9898.22";
    row.cells.push(cell);
    
    this.rows.push(row);

  }

}
