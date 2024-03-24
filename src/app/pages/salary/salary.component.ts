import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { getIconWithName } from 'src/app/data/iconFactory';
import { NavigationService } from 'src/app/services/navigation.service';
import { Subscription, timer } from 'rxjs';
import { ModalService } from 'src/app/modalModule';
import { Button, TableRow, TableRowAction, TableHeader, TableSize, TextTableCell, NumberTableCell } from 'src/app/ui';
import '../../util/arrayExtensions';
import '../../util/numberExtensions';
import { environment } from 'src/environments/environment';
import { StyledTextTableCell } from 'src/app/ui/models/table/styledTextTableCell';
import { FinanceApiService, Salary } from 'src/services/finance-api.service';
import { SalaryChartDataFactory } from './prepareSalaryCharts';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnDestroy {
  public pageTitle = "Payments";
  public addEntryLabel: string = "Add Salary";
  public chartButtonIcon = getIconWithName('bar-chart-line');
  public addEntryIcon: string = getIconWithName('plus-circle-line');
  public agChartData: AgChartOptions;

  private data: Array<Salary>;
  public tableSizeEnum = TableSize;
  public rows: Array<TableRow> = [];
  public header: Array<TableHeader> = [];
  public groupCellIndex: number;
  public tableSize: TableSize = TableSize.Medium;
  public footerText: string;

  public showAddEntry: boolean = false;

  public createSalaryLastResult: string = '';

  // Month filter
  public monthFilterBy: number = null;

  // Json Dialog
  public jsonDetails: string;

  // Delete Confirm
  public deleteConfirmMessage: string;
  public deletionEntry: Salary;

  private subscription = new Subscription();

  public newSalaryEntry = new Salary({
    arbeitgeber: 'Daimler Truck AG',
    wochenstunden: 40,
    jahr: new Date().getFullYear(),
    monat: new Date().getMonth()
  });

  constructor(
    private navigationService: NavigationService,
    private modalService: ModalService,
    private financeApi: FinanceApiService,
    private currencyPipe: CurrencyPipe
    ) { 

    this.navigationService.activeMenu.next(2);
    this.updateEntriesV2();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setSize(size: TableSize) {
    this.tableSize = size;
  }

  public openChart() {
    this.agChartData = SalaryChartDataFactory.oneMonthAllYears(this.data, this.monthFilterBy);
    this.openModal('years-chart');
  }

  private updateEntriesV2() {

    this.subscription.add(this.financeApi.getSalary(null, null).subscribe(
      result => {
        this.data = result.SortDescending('jahr');
        
        if (environment.mockData) {
          this.data.map(d => d.netto = d.netto * 63 * Math.random());
          this.data.map(d => d.brutto  = d.brutto * 24 * Math.random());
        }

        if (this.monthFilterBy) {
          this.data = this.data.filter(d => d.monat == this.monthFilterBy);
        }

        // Map to generic table model
        this.rows = this.mapToTableModel(this.data);
      }
    ));
  }


  public rowClicked(row: TableRow) {
/*  Maybe future use ... conflicts with icon on-click 
    let id = row.cells.map(r => r.id)[0];
    this.financeApi.getSalaryById(id).subscribe(
      result => {
        this.showEntryAsJson(result);
      }
    ); 
    */
  }

  private showEntryAsJson(entry: Salary) {
    this.jsonDetails = JSON.stringify(entry, undefined, 2);
    this.openModal('json');
  }

  private mapToTableModel(data: Array<Salary>): Array<TableRow> {
    this.createHeader();
    this.createFooter();

    let result = new Array<TableRow>();
    data.forEach(entry => {
      let row = new TableRow();
           
      // Actions
      let action = new TableRowAction();
      action.tooltip = "Delete";
      action.icon = getIconWithName("trash-line");
      action.action = (id: string) => {
        this.deletionEntry = entry;
        this.deleteConfirmMessage = `Confirm Entry deletion: Id=${entry.id}: ${entry.jahr}/${entry.monat.PadWithZero()}?`;
        this.openModal('delete-confirmation');
      };
      row.actions.push(action); 
      
      let info = new TableRowAction();
      info.tooltip = "Log";
      info.icon = getIconWithName('info-standard-line');
      info.action = () => {
        this.showEntryAsJson(entry);
      };
      row.actions.push(info);

      // Cells
      let cell = new TextTableCell({ id: entry.id, label: entry.id ? `${entry.id}` : "n/a"});
      row.cells.push(cell);
      
      cell = new StyledTextTableCell({ id: entry.id, label:`${entry.jahr}`, style:{ 'font-weight': '500' }});
      row.cells.push(cell);

      cell = new StyledTextTableCell({ 
        id: entry.id, 
        label: entry.monat.PadWithZero(), 
        style:{ 'font-weight': '500' },
        actionIcon: this.monthFilterBy ? getIconWithName('filter-solid'): getIconWithName('filter-line'), 
        action: () => {
          if (!this.monthFilterBy) {
            this.monthFilterBy = entry.monat;
            this.groupCellIndex = null;
            this.updateEntriesV2();
          } else {
            this.monthFilterBy = null;
            this.groupCellIndex = 1;
            this.updateEntriesV2();
          }
        } 
      });
      row.cells.push(cell);
      
      cell = new NumberTableCell({ id: entry.id, label:`${this.currencyPipe.transform(entry.brutto)}`, numericValue: entry.brutto });
      row.cells.push(cell);
      
      cell = new NumberTableCell({ id: entry.id, label:`${this.currencyPipe.transform(entry.netto)}`, numericValue: entry.netto });
      row.cells.push(cell);
            
      cell = new NumberTableCell({ id: entry.id, label:`${this.currencyPipe.transform(entry.akp)}`, numericValue: entry.akp });
      row.cells.push(cell);
            
      cell = new NumberTableCell({ id: entry.id, label:`${this.currencyPipe.transform(entry.kantine)}`, numericValue: entry.kantine });
      row.cells.push(cell);
            
      cell = new TextTableCell({ id: entry.id, label:`${entry.wochenstunden}`});
      row.cells.push(cell);

      result.push(row);
    })

    return result;
  }

  private createHeader() {
    let header: Array<TableHeader> = [];

    header.push({ label: 'No.' });
    header.push({ label: 'Jahr' });
    header.push({ label: 'Monat' });
    header.push({ label: 'Brutto', summarizeWhenGrouped: true });
    header.push({ label: 'Netto', summarizeWhenGrouped: true });
    header.push({ label: 'AKP', summarizeWhenGrouped: true });
    header.push({ label: 'Kantine', summarizeWhenGrouped: true });
    header.push({ label: 'Stunden/Woche' });
    this.header = header;
    
    if (!this.monthFilterBy) {
      this.groupCellIndex = 1;
    }
  }

  public toggleNewEntryForm() {
    this.showAddEntry = !this.showAddEntry;
    if (this.showAddEntry) {
      this.addEntryLabel = "Close Form";
      this.addEntryIcon = getIconWithName('times-circle-line');
    } else {
      this.addEntryLabel = "Add Salary";
      this.addEntryIcon = getIconWithName('plus-circle-line');
    }
  }

  private showSalaryResultWithTimer(message: string) {
    this.createSalaryLastResult = message;
    const salaryLastResultTimer = timer(10000);
    this.subscription.add(salaryLastResultTimer.subscribe(v => this.createSalaryLastResult = ''));
  }

  public createSalary(item: Salary) {
    this.subscription.add(this.financeApi.createSalary(item).subscribe(
      res => {
        this.showSalaryResultWithTimer(`POST Salary Eintrag ${item.jahr}/${item.monat}: Result=${JSON.stringify(res)}`);
        this.resetNewSalaryItem();
        this.toggleNewEntryForm();
        this.updateEntriesV2();
        
      },
      (err: HttpErrorResponse) => {
        this.showSalaryResultWithTimer(`Error creating the salary entry!: ${err}`);
      }
    ));
  }

  private resetNewSalaryItem() {
    this.newSalaryEntry.brutto = null;
    this.newSalaryEntry.netto = null;
    this.newSalaryEntry.kantine = null;
    this.newSalaryEntry.akp = null;
  }

  public deleteSalaryEntry($event: Salary) {
    if ($event) {
      this.subscription.add(this.financeApi.deleteSalary($event.id).subscribe({
        next: (res) => {
          this.showSalaryResultWithTimer(`Item ${$event.id}: ${$event.jahr}/${$event.monat}: Acknowledged=${res.isAcknowledged} DeletedCount=${res.deletedCount}`);
          this.updateEntriesV2();
        },
        error: (err) => {
          this.showSalaryResultWithTimer(`Item ${$event.id} Deletion Failed: ${err}`);
        }
      }));
    }
    this.closeModal('delete-confirmation');
  }

  private createFooter() {
    this.footerText = `${this.data.map(d => d.jahr).Distinct().length} years / ${ this.data.map(d => d.monat).length} months`;
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}