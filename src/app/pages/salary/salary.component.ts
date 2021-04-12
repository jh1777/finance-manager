import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { getIconWithName } from 'src/app/data/iconFactory';
import { ApiService } from 'src/app/services/api.service';
import { Gehalt } from 'src/app/services/models/gehalt';
import { NavigationService } from 'src/app/services/navigation.service';
import { ITableCell } from 'src/app/ui/models/ITableCell';
import { TableRow } from 'src/app/ui/models/tableRow';
import { TableRowAction } from 'src/app/ui/models/tableRowAction';
import { TableSize } from 'src/app/ui/models/tableSize';
import { TextTableCell } from 'src/app/ui/models/textTableCell';
import { ModalComponent, ShowJsonComponent } from 'src/app/ui/ui.module';
import { FillZero } from 'src/app/util/fillZero';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {
  priv
  public pageTitle = "Payments";

  public tableSizeEnum = TableSize;

  public rows: Array<TableRow> = [];
  public header: Array<ITableCell> = [];

  public tableSize: TableSize = TableSize.Medium;
  public details: string;

  bsModalRef: BsModalRef;

  public showAddEntry: boolean = false;
  public addEntryLabel: string = "Add Entry";
  public addEntryIcon: string = getIconWithName('plus-circle-line');

  constructor(
    private api: ApiService,
    private bsModalService: BsModalService,
    private navigationService: NavigationService,
    private currencyPipe: CurrencyPipe
    ) { 

    this.createHeader();
    this.navigationService.activeMenu.next(2);

  }

  public setSize(size: TableSize) {
    this.tableSize = size;
  }

  ngOnInit(): void {
    // Get Data from API
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
      /*       
      let action = new TableRowAction();
      action.tooltip = "Delete";
      action.icon = "../../assets/icons/trash-line.svg";
      action.action = (id: number) => {
        console.log(`delete row number ${id}`);
      };
      row.actions.push(action); 
      */

      let info = new TableRowAction();
      info.tooltip = "Log";
      info.icon = getIconWithName('info-standard-line');
      info.action = (id: number) => {
        this.details = JSON.stringify(entry, undefined, 2);
        this.openEntryDetailsModal(this.details);
      };
      row.actions.push(info);

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
  }

  private openEntryDetailsModal(content: string) { 
    ShowJsonComponent.prototype.content = content;
    ModalComponent.prototype.componentName = 'json';
    ModalComponent.prototype.title = "Details";
    ModalComponent.prototype.closeBtnName = "Close";
    this.bsModalRef = this.bsModalService.show(ModalComponent);
  }

  public addEntry() {
    this.showAddEntry = !this.showAddEntry;
    if (this.showAddEntry) {
      this.addEntryLabel = "Close Form";
      this.addEntryIcon = '';
    } else {
      this.addEntryLabel = "Add Entry";
      this.addEntryIcon = getIconWithName('plus-circle-line');
    }
  }

}
