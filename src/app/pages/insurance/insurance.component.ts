import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { getIconWithName } from 'src/app/data/iconFactory';
import { ModalService } from 'src/app/modalModule';
/* import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime'; */

import { ApiService } from 'src/app/services/api.service';
import { Versicherung } from 'src/app/services/models/versicherung';
import { NavigationService } from 'src/app/services/navigation.service';
import { ITableCell, TableRow, TableRowAction, TableSize, TextTableCell } from 'src/app/ui';
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
  public deletionEntry: Versicherung;
  public deleteConfirmMessage: string;

  public showAddEntry: boolean = false;
  public addEntryLabel: string = "Add Insurance";
  public addEntryIcon: string = getIconWithName('plus-circle-line');
  public newInsuranceEntry = new Versicherung({
    Erstellt: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
  });
  public createEntryLastResult: string = '';
 
  constructor(
    private navigationService: NavigationService,
    private modalService: ModalService,
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

      // Actions
      let action = new TableRowAction();
      action.tooltip = "Delete";
      action.icon = getIconWithName("trash-line");
      action.action = (id: number) => {
        this.deletionEntry = entry;
        this.deleteConfirmMessage = `Confirm Entry deletion: Id=${entry.id}: ${entry.Name}/${entry.Datum}?`;
        this.openModal('delete-confirmation');
      };
      row.actions.push(action); 
      
      
      let prev = this.getPreviousEntry(entry);
      let diff = prev == null ? 0 : entry.Rueckkaufswert - prev.Rueckkaufswert;
      // Cells
      let cell = new TextTableCell({ id: entry.id, label: entry.id ? `${entry.id}` : "n/a"});
      row.cells.push(cell);
      
      cell = new StyledTextTableCell({ id: entry.id, label:`${entry.Name}`, style:{ 'font-weight': '500' } });
      row.cells.push(cell);

      cell = new TextTableCell({ id: entry.id, label:`${ this.currencyPipe.transform(entry.Rueckkaufswert) }`});
      row.cells.push(cell);

      cell = new StyledTextTableCell({ id: entry.id, label:`${ diff != 0 ? this.currencyPipe.transform(diff) : '' }`, style: diff > 0 ? { 'color': 'green' } : { 'color': 'red'} });
      row.cells.push(cell);

      cell = new StyledTextTableCell({ id: entry.id, label:`${ this.datePipe.transform(entry.Datum, 'dd.MM.yyyy') }`, style:{ 'color': '#909090' } });
      row.cells.push(cell);

      cell = new StyledTextTableCell({ id: entry.id, label:`${ this.datePipe.transform(entry.Erstellt, 'dd.MM.yyyy') }`, style:{ 'color': '#909090' } });
      row.cells.push(cell);

      result.push(row);
    })

    this.rows = result;
  }

  private getPreviousEntry(entry: Versicherung): Versicherung {
    let filteredData = this.data.filter(d => d.Name == entry.Name);
    let index = filteredData.indexOf(entry);
    if (index == filteredData.length - 1) {
      return null;
    } 
    return filteredData[index + 1];
  }

  private createFooter() {
    this.footerText = `${this.data.map(d => d.Name).Distinct().length} Categories`;
  }

  private createHeader() {
    let header: Array<ITableCell> = [];

    header.push({
      label: 'No.',
      type: 'header'
    });
    header.push({
      label: 'Name',
      type: 'header'
    });
    header.push({
      label: 'Rückkaufswert',
      type: 'header'
    });
    header.push({
      label: 'Delta',
      type: 'header'
    });
    header.push({
      label: 'Datum',
      type: 'header'
    });
    header.push({
      label: 'Erstellt',
      type: 'header'
    });
    this.header = header;
    this.groupCell = this.header[1];
  }

  public toggleNewEntryForm() {
    this.showAddEntry = !this.showAddEntry;
    if (this.showAddEntry) {
      this.addEntryLabel = "Close Form";
      this.addEntryIcon = getIconWithName('times-circle-line');
    } else {
      this.addEntryLabel = "Add Insurance";
      this.addEntryIcon = getIconWithName('plus-circle-line');
    }
  }

  public createInsurance(item: Versicherung) {

    console.log(item);
    this.api.setService("versicherungen");
    this.api.createEntry<Versicherung>(item).subscribe(
        res => {
          var response = <HttpResponse<Versicherung>>res;
          this.showResultWithTimer(`POST Versicherung Eintrag ${item.Name}/${item.Datum}: HTTP Code ${response.status}`);

          if (res.ok) {
            this.resetNewInsuranceItem();
            this.toggleNewEntryForm();
            this.getData();
          }
        },
        (err: HttpErrorResponse) => {
          this.showResultWithTimer(`Error creating the insurance entry!: ${err}`);
        }
      );
  }

  private resetNewInsuranceItem() {
    this.newInsuranceEntry.Name = null;
    this.newInsuranceEntry.Rueckkaufswert = null;
    this.newInsuranceEntry.Datum = null;
  }

  private showResultWithTimer(message: string) {
    this.createEntryLastResult = message;
    const salaryLastResultTimer = timer(10000);
    salaryLastResultTimer.subscribe(v => this.createEntryLastResult = '');
  }

  public deleteEntry($event: Versicherung) {
    if ($event) {
      // Call the API to delete the entry
      this.api.setService("versicherungen");
      this.api.deleteEntryById<Versicherung>($event.id).subscribe({
        next: (res) => {
          this.showResultWithTimer(`Item ${$event.id}: ${$event.Name}/${$event.Datum} Deletion: HTTP Code ${res.status} ${res.statusText}`);
          this.getData();
        },
        error: (err) => {
          this.showResultWithTimer(`Item ${$event.id} Deletion Failed: ${err}`);
        }
      });
    }
    this.closeModal('delete-confirmation');
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}