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
import { ITableCell, TableHeader, TableRow, TableRowAction, TableSize, TextTableCell } from 'src/app/ui';
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
  public header: Array<TableHeader> = [];
  public groupCellIndex: number;
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
    this.api.setService("insurances");
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
      action.action = (id: string) => {
        this.deletionEntry = entry;
        this.deleteConfirmMessage = `Confirm Entry deletion: Id=${entry._id}: ${entry.Name}/${entry.Datum}?`;
        this.openModal('delete-confirmation');
      };
      row.actions.push(action); 
      
      
      let prev = this.getPreviousEntry(entry);
      let diff = prev == null ? 0 : entry.Rueckkaufswert - prev.Rueckkaufswert;
      // Cells
      let cell = new TextTableCell({ id: entry._id, label: entry._id ? `${entry._id}` : "n/a"});
      row.cells.push(cell);
      
      cell = new StyledTextTableCell({ id: entry._id, label:`${entry.Name}`, style:{ 'font-weight': '500' } });
      row.cells.push(cell);

      cell = new TextTableCell({ id: entry._id, label:`${ this.currencyPipe.transform(entry.Rueckkaufswert) }`});
      row.cells.push(cell);

      cell = new StyledTextTableCell({ id: entry._id, label:`${ diff != 0 ? this.currencyPipe.transform(diff) : '' }`, style: diff > 0 ? { 'color': 'green' } : { 'color': 'red'} });
      row.cells.push(cell);

      cell = new StyledTextTableCell({ id: entry._id, label:`${ this.datePipe.transform(entry.Datum, 'dd.MM.yyyy') }`, style:{ 'color': '#909090' } });
      row.cells.push(cell);

      cell = new StyledTextTableCell({ id: entry._id, label:`${ this.datePipe.transform(entry._created, 'dd.MM.yyyy') }`, style:{ 'color': '#909090' } });
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
    let header: Array<TableHeader> = [];

    header.push({ label: 'No.' });
    header.push({ label: 'Name' });
    header.push({ label: 'Rückkaufswert' });
    header.push({ label: 'Delta' });
    header.push({ label: 'Datum' });
    header.push({ label: 'Erstellt' });
    this.header = header;
    this.groupCellIndex = 1;
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

    console.log("Create Item: Versicherung: ", item);
    this.api.setService("insurances");
    this.api.createEntry<Versicherung>([item]).subscribe(
        res => {
          var response = <HttpResponse<Array<Versicherung>>>res;
          this.showResultWithTimer(`POST Versicherung item: ${item.Name}/${item.Datum}: HTTP Code ${response.status}`);

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
      this.api.setService("insurances");
      this.api.deleteEntryById<Versicherung>($event._id).subscribe({
        next: (res) => {
          this.showResultWithTimer(`Item ${$event._id}: ${$event.Name}/${$event.Datum} Deletion: HTTP Code ${res.status} ${res.statusText}`);
          this.getData();
        },
        error: (err) => {
          this.showResultWithTimer(`Item ${$event._id} Deletion Failed: ${err}`);
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