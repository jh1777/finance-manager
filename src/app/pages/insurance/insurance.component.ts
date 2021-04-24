import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
/* import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime'; */

import { ApiService } from 'src/app/services/api.service';
import { Versicherung } from 'src/app/services/models/versicherung';
import { NavigationService } from 'src/app/services/navigation.service';
import { ITableCell, TableRow, TableSize, TextTableCell } from 'src/app/ui';
import { StyledTextTableCell } from 'src/app/ui/models/table/styledTextTableCell';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {

  public pageTitle: string = "Insurance";

  public rows: Array<TableRow> = [];
  public header: Array<ITableCell> = [];
  public groupCell: ITableCell;
  public tableSize: TableSize = TableSize.Medium;
  public footerText: string;

  public data: Array<Versicherung>;
 
  constructor(
    private navigationService: NavigationService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private api: ApiService
  ) { 
    this.navigationService.activeMenu.next(3);
    // no loonger used: dayjs.extend(relativeTime);
  }

  ngOnInit(): void {
    this.getData();
  }

  public rowClicked(row: TableRow) {
    console.log(row);
  }


  private getData() {
    this.api.setService("versicherungen");
    this.api.getAllEntries<Versicherung>().subscribe({
      next: (result) => {
        this.data = result.body.SortDescending('Datum');
        if (environment.mockData) {
          this.data.map(d => d.Rueckkaufswert = d.Rueckkaufswert * 45 * Math.random());
        }
        this.mapDataToTableModel();
      },
      error: (e) => {
        console.error("Error getting Versicherungen!", e);
      }
    })
  }

  private mapDataToTableModel() {
    this.createHeader();
    this.createFooter();

    let result = new Array<TableRow>();
    this.data.forEach(entry => {
      let row = new TableRow();

      // Cells
      let cell = new TextTableCell({ id: entry.id, label: entry.id ? `${entry.id}` : "n/a"});
      row.cells.push(cell);
      
      cell = new StyledTextTableCell({ id: entry.id, label:`${entry.Name}`, style:{ 'font-weight': '500' } });
      row.cells.push(cell);

      cell = new TextTableCell({ id: entry.id, label:`${ this.currencyPipe.transform(entry.Rueckkaufswert) }`});
      row.cells.push(cell);

      cell = new StyledTextTableCell({ id: entry.id, label:`${ this.datePipe.transform(entry.Datum, 'dd.MM.yyyy') }`, style:{ 'color': '#909090' } });
      row.cells.push(cell);

      cell = new StyledTextTableCell({ id: entry.id, label:`${ entry.Erstellt }`, style:{ 'color': '#909090' } });
      row.cells.push(cell);

      result.push(row);
    })

    this.rows = result;
  }

  private createFooter() {
    this.footerText = `${this.data.map(d => d.Name).Distinct().length} Categories`;
  }

  private createHeader() {
    this.header.push({
      label: 'No.',
      type: 'header'
    });
    this.header.push({
      label: 'Name',
      type: 'header'
    });
    this.header.push({
      label: 'Rückkaufswert',
      type: 'header'
    });
    this.header.push({
      label: 'Datum',
      type: 'header'
    });
    this.header.push({
      label: 'Erstellt',
      type: 'header'
    });

    this.groupCell = this.header[1];
  }
}