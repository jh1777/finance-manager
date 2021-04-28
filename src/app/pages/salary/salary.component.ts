import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { getIconWithName } from 'src/app/data/iconFactory';
import { ApiService } from 'src/app/services/api.service';
import { Gehalt } from 'src/app/services/models/gehalt';
import { NavigationService } from 'src/app/services/navigation.service';
import { timer } from 'rxjs';
import { ModalService } from 'src/app/modalModule';
import { Button, ITableCell, TableRow, TableRowAction, TableHeader, TableSize, TextTableCell } from 'src/app/ui';
import '../../util/arrayExtensions';
import '../../util/numberExtensions';
import { environment } from 'src/environments/environment';
import { StyledTextTableCell } from 'src/app/ui/models/table/styledTextTableCell';



@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {
  public pageTitle = "Payments";

  private data: Array<Gehalt>;

  public tableSizeEnum = TableSize;
  public hideToast: boolean = true;

  public rows: Array<TableRow> = [];
  public header: Array<TableHeader> = [];
  public groupCell: ITableCell;
  public tableSize: TableSize = TableSize.Medium;
  public footerText: string;

  public showAddEntry: boolean = false;
  public addEntryLabel: string = "Add Salary";
  public addEntryIcon: string = getIconWithName('plus-circle-line');
  public createSalaryLastResult: string = '';

  // Month filter
  public monthFilterBy: number = null;

  // Json Dialog
  public jsonDetails: string;

  // Delete Confirm
  public deleteConfirmMessage: string;
  public deletionEntry: Gehalt;

  // Butttons
  public yearButtons: Array<Button> = [];
  public yearFilterMulti: boolean = true;

  public newSalaryEntry = new Gehalt({
    Arbeitgeber: 'Daimler Truck AG',
    Wochenstunden: 35,
    Jahr: new Date().getFullYear(),
    Monat: new Date().getMonth()
  });

  constructor(
    private api: ApiService,
    private navigationService: NavigationService,
    private modalService: ModalService,
    private currencyPipe: CurrencyPipe
    ) { 

    this.navigationService.activeMenu.next(2);
    this.updateEntries();

  }

  public setSize(size: TableSize) {
    this.tableSize = size;
  }

  ngOnInit(): void {
    
  }

  private updateEntries() {
    // Get Data from API
    this.api.setService("gehalt");
    this.api.getAllEntries<Gehalt>().subscribe(
      result => {
        this.data = result.body;
        if (environment.mockData) {
          this.data.map(d => d.Netto = d.Netto * 63 * Math.random());
          this.data.map(d => d.Brutto  = d.Brutto * 24 * Math.random());
        }

        if (this.monthFilterBy) {
          this.data = this.data.filter(d => d.Monat == this.monthFilterBy);
        }
        this.data = this.data.SortDescending('id');

        // Map to generic table model
        this.rows = this.mapToTableModel(this.data);
      }
    );
  }

  public rowClicked(row: TableRow) {
/*  Maybe future use ... conflicts with icon on-click 
    let id = row.cells.map(r => r.id)[0];
    this.api.getEntry<Gehalt>(id).subscribe(
      result => {
        this.showEntryAsJson(result.filter(r => r.id == id).First());
      }
    ); */
  }

  private showEntryAsJson(entry: Gehalt) {
    this.jsonDetails = JSON.stringify(entry, undefined, 2);
    this.openModal('json');
  }

  private mapToTableModel(data: Array<Gehalt>): Array<TableRow> {
    this.createHeader();
    this.createFooter();

    let result = new Array<TableRow>();
    data.forEach(entry => {
      let row = new TableRow();
           
      // Actions
      let action = new TableRowAction();
      action.tooltip = "Delete";
      action.icon = getIconWithName("trash-line");
      action.action = (id: number) => {
        this.deletionEntry = entry;
        this.deleteConfirmMessage = `Confirm Entry deletion: Id=${entry.id}: ${entry.Jahr}/${entry.Monat.PadWithZero()}?`;
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
      
      cell = new StyledTextTableCell({ id: entry.id, label:`${entry.Jahr}`, style:{ 'font-weight': '500' }});
      row.cells.push(cell);

      cell = new StyledTextTableCell({ 
        id: entry.id, 
        label: entry.Monat.PadWithZero(), 
        style:{ 'font-weight': '500' },
        actionIcon: this.monthFilterBy ? getIconWithName('filter-solid'): getIconWithName('filter-line'), 
        action: () => {
          if (!this.monthFilterBy) {
            this.monthFilterBy = entry.Monat;
            this.groupCell = null;
            this.updateEntries();
          } else {
            this.monthFilterBy = null;
            this.groupCell = this.header[1];
            this.updateEntries();
          }
        } 
      });
      row.cells.push(cell);
      
      cell = new TextTableCell({ id: entry.id, label:`${this.currencyPipe.transform(entry.Brutto)}`});
      row.cells.push(cell);
      
      cell = new TextTableCell({ id: entry.id, label:`${this.currencyPipe.transform(entry.Netto)}`});
      row.cells.push(cell);
            
      cell = new TextTableCell({ id: entry.id, label:`${this.currencyPipe.transform(entry.AKP)}`});
      row.cells.push(cell);
            
      cell = new TextTableCell({ id: entry.id, label:`${this.currencyPipe.transform(entry.Kantine)}`});
      row.cells.push(cell);
            
      cell = new TextTableCell({ id: entry.id, label:`${entry.Wochenstunden}`});
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
    header.push({ label: 'Brutto' });
    header.push({ label: 'Netto' });
    header.push({ label: 'AKP' });
    header.push({ label: 'Kantine' });
    header.push({ label: 'Stunden/Woche' });
    this.header = header;
    
    if (!this.monthFilterBy) {
      this.groupCell = header[1];
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
    salaryLastResultTimer.subscribe(v => this.createSalaryLastResult = '');
  }

  public createSalary(item: Gehalt) {
    console.log(item);
    this.api.createEntry<Gehalt>(item).subscribe(
        res => {
          var response = <HttpResponse<Gehalt>>res;
          this.showSalaryResultWithTimer(`POST Gehalt Eintrag ${item.Jahr}/${item.Monat}: HTTP Code ${response.status}`);

          if (res.ok) {
            this.resetNewSalaryItem();
            this.toggleNewEntryForm();
            this.updateEntries();
          }
        },
        (err: HttpErrorResponse) => {
          this.showSalaryResultWithTimer(`Error creating the salary entry!: ${err}`);
        }
      );
  }

  private resetNewSalaryItem() {
    this.newSalaryEntry.Brutto = null;
    this.newSalaryEntry.Netto = null;
    this.newSalaryEntry.Kantine = null;
    this.newSalaryEntry.AKP = null;
  }

  public deleteSalaryEntry($event: Gehalt) {
    if ($event) {
      // Call the API to delete the entry
      this.api.setService("gehalt");
      this.api.deleteEntry<Gehalt>($event.Jahr, $event.Monat).subscribe({
        next: (res) => {
          this.showSalaryResultWithTimer(`Item ${$event.id}: ${$event.Jahr}/${$event.Monat} Deletion: HTTP Code ${res.status} ${res.statusText}`);
          this.updateEntries();
        },
        error: (err) => {
          this.showSalaryResultWithTimer(`Item ${$event.id} Deletion Failed: ${err}`);
        }
      });
    }
    this.closeModal('delete-confirmation');
  }

  private createFooter() {
    this.footerText = `${this.data.map(d => d.Jahr).Distinct().length} Years (${ this.data.map(d => d.Monat).length} Months)`;
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}