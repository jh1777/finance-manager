import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { getIconWithName } from 'src/app/data/iconFactory';
import { ModalService } from 'src/app/modalModule';
/* import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime'; */

import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { ITableCell, TableHeader, TableRow, TableRowAction, TableSize, TextTableCell } from 'src/app/ui';
import { StyledTextTableCell } from 'src/app/ui/models/table/styledTextTableCell';
import { environment } from 'src/environments/environment';
import { FinanceApiService, Insurance } from 'src/services/finance-api.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit, OnDestroy {

  public pageTitle: string = "Insurance";

  public rows: Array<TableRow> = [];
  public header: Array<TableHeader> = [];
  public groupCellIndex: number;
  public tableSize: TableSize = TableSize.Medium;
  public footerText: string;

  public data: Array<Insurance>;
  public deletionEntry: Insurance;
  public deleteConfirmMessage: string;

  public showAddEntry: boolean = false;
  public addEntryLabel: string = "Add Insurance";
  public addEntryIcon: string = getIconWithName('plus-circle-line');
  public newInsuranceEntry = new Insurance();
  public createEntryLastResult: string = '';
 
  private subscription = new Subscription();

  constructor(
    private navigationService: NavigationService,
    private modalService: ModalService,
    private financeApi: FinanceApiService,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) { 
    this.navigationService.activeMenu.next(3);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getData();
  }

  public rowClicked(row: TableRow) {
    console.log(row);
  }


  private getData() {
    this.subscription.add(this.financeApi.getInsurance(null).subscribe({
      next: (result) => {
        this.data = result.SortDescending('datum');
        if (environment.mockData) {
          this.data.map(d => d.rueckkaufswert = d.rueckkaufswert * 45 * Math.random());
        }
        this.mapDataToTableModel();
      },
      error: (e) => {
        console.error("Error getting Versicherungen!", e);
      }
    }));
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
        this.deleteConfirmMessage = `Confirm Entry deletion: Id=${entry.id}: ${entry.name}/${entry.datum}?`;
        this.openModal('delete-confirmation');
      };
      row.actions.push(action); 
      
      
      let prev = this.getPreviousEntry(entry);
      let diff = prev == null ? 0 : entry.rueckkaufswert - prev.rueckkaufswert;
      // Cells
      let cell = new TextTableCell({ id: entry.id, label: entry.id ? `${entry.id}` : "n/a"});
      row.cells.push(cell);
      
      cell = new StyledTextTableCell({ id: entry.id, label:`${entry.name}`, style:{ 'font-weight': '500' } });
      row.cells.push(cell);

      cell = new TextTableCell({ id: entry.id, label:`${ this.currencyPipe.transform(entry.rueckkaufswert) }`});
      row.cells.push(cell);

      cell = new StyledTextTableCell({ id: entry.id, label:`${ diff != 0 ? this.currencyPipe.transform(diff) : '' }`, style: diff > 0 ? { 'color': 'green' } : { 'color': 'red'} });
      row.cells.push(cell);

      cell = new StyledTextTableCell({ id: entry.id, label:`${ this.datePipe.transform(entry.datum, 'dd.MM.yyyy') }`, style:{ 'color': '#909090' } });
      row.cells.push(cell);

      cell = new StyledTextTableCell({ id: entry.id, label:`${ this.datePipe.transform(entry.created, 'dd.MM.yyyy') }`, style:{ 'color': '#909090' } });
      row.cells.push(cell);

      result.push(row);
    })

    this.rows = result;
  }

  private getPreviousEntry(entry: Insurance): Insurance {
    let filteredData = this.data.filter(d => d.name == entry.name);
    let index = filteredData.indexOf(entry);
    if (index == filteredData.length - 1) {
      return null;
    } 
    return filteredData[index + 1];
  }

  private createFooter() {
    this.footerText = `${this.data.map(d => d.name).Distinct().length} Categories`;
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

  public createInsurance(item: Insurance) {
    if (item.datum) {
      item.datum = new Date(item.datum);
    }
    this.subscription.add(this.financeApi.createInsurance(item).subscribe(
      res => {
        this.showResultWithTimer(`POST Insurance item: ${item.name}/${item.datum}: Result=${JSON.stringify(res)}`);
        this.resetNewInsuranceItem();
        this.toggleNewEntryForm();
        this.getData();
      },
      (err: HttpErrorResponse) => {
        this.showResultWithTimer(`Error creating the insurance entry!: ${err}`);
      }
    ));
  }

  private resetNewInsuranceItem() {
    this.newInsuranceEntry.name = null;
    this.newInsuranceEntry.rueckkaufswert = null;
    this.newInsuranceEntry.datum = null;
  }

  private showResultWithTimer(message: string) {
    this.createEntryLastResult = message;
    const salaryLastResultTimer = timer(10000);
    this.subscription.add(salaryLastResultTimer.subscribe(v => this.createEntryLastResult = ''));
  }

  public deleteEntry($event: Insurance) {
    if ($event) {
      // Call the API to delete the entry
      this.subscription.add(this.financeApi.deleteInsurance($event.id).subscribe({
        next: (res) => {
          this.showResultWithTimer(`Item ${$event.id}: ${$event.name}/${$event.datum} Deletion: Acknowledged=${res.isAcknowledged} DeletedCount=${res.deletedCount}`);
          this.getData();
        },
        error: (err) => {
          this.showResultWithTimer(`Item ${$event.id} Deletion Failed: ${err}`);
        }
      }));
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