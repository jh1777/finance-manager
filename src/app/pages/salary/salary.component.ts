import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Gehalt } from 'src/app/services/models/gehalt';
import { NavigationService } from 'src/app/services/navigation.service';
import { ITableCell } from 'src/app/ui/models/ITableCell';
import { TableRow } from 'src/app/ui/models/tableRow';
import { TextTableCell } from 'src/app/ui/models/textTableCell';
import { FillZero } from 'src/app/util/fillZero';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {

  public rows: Array<TableRow> = [];
  public header: Array<ITableCell> = [];

  constructor(
    private api: ApiService,
    private navigationService: NavigationService,
    private currencyPipe: CurrencyPipe
    ) { 

    this.createHeader();
    this.navigationService.activeMenu.next(2);

  }

  ngOnInit(): void {

    this.api.getAllEntries<Gehalt>().subscribe(
      result => {
        let data = result.body;
        // Sort by id
        data.sort((n1, n2) => {
          if (n1.id > n2.id) {
            return -1;
          }

          if (n1.id < n2.id) {
            return 1;
          }

          return 0;
        });
        // Map to generic table model
        this.rows = this.mapToTableModel(data);
      }
    );

  }

  private mapToTableModel(data: Array<Gehalt>): Array<TableRow> {
    let result = new Array<TableRow>();
    data.forEach(entry => {
      let row = new TableRow();
      let cell = new TextTableCell(entry.id ? `${entry.id}` : "n/a");
      row.cells.push(cell);
      
      cell = new TextTableCell(`${entry.Jahr}`);
      row.cells.push(cell);

      cell = new TextTableCell(FillZero(entry.Monat));
      row.cells.push(cell);
      
      cell = new TextTableCell(`${this.currencyPipe.transform(entry.Brutto)}`);
      row.cells.push(cell);
      
      cell = new TextTableCell(`${this.currencyPipe.transform(entry.Netto)}`);
      row.cells.push(cell);
            
      cell = new TextTableCell(`${this.currencyPipe.transform(entry.AKP)}`);
      row.cells.push(cell);
            
      cell = new TextTableCell(`${this.currencyPipe.transform(entry.Kantine)}`);
      row.cells.push(cell);
            
      cell = new TextTableCell(`${entry.Wochenstunden}`);
      row.cells.push(cell);

      result.push(row);
    })

    return result;
  }

  private createHeader() {
    this.header.push({
      label: 'No.',
      type: 'header'
    });
    this.header.push({
      label: 'Jahr',
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
    this.header.push({
      label: 'Netto',
      type: 'header'
    });
    this.header.push({
      label: 'AKP',
      type: 'header'
    });
    this.header.push({
      label: 'Kantine',
      type: 'header'
    });
    this.header.push({
      label: 'Stunden/Woche',
      type: 'header'
    });

/*     let row = new TableRow();
    let cell = new TextTableCell("1");
    row.cells.push(cell);
    cell = new TextTableCell("2020/03");
    row.cells.push(cell);
    cell = new TextTableCell("9898.22");
    row.cells.push(cell);
    
    this.rows.push(row); */

  }

}
