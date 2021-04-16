import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { getIconWithName } from 'src/app/data/iconFactory';
import { ApiService } from 'src/app/services/api.service';
import { Gehalt } from 'src/app/services/models/gehalt';
import { NavigationService } from 'src/app/services/navigation.service';
import { ITableCell } from 'src/app/ui/models/ITableCell';
import { TableRow } from 'src/app/ui/models/tableRow';
import { TableRowAction } from 'src/app/ui/models/tableRowAction';
import { TableSize } from 'src/app/ui/models/tableSize';
import { TextTableCell } from 'src/app/ui/models/textTableCell';
import { FillZero } from 'src/app/util/fillZero';
import { timer } from 'rxjs';
import { ModalService } from 'src/app/modalModule';


@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {
  public pageTitle = "Payments";

  public tableSizeEnum = TableSize;
  public hideToast: boolean = true;

  public rows: Array<TableRow> = [];
  public header: Array<ITableCell> = [];

  public tableSize: TableSize = TableSize.Medium;

  public showAddEntry: boolean = false;
  public addEntryLabel: string = "Add Salary";
  public addEntryIcon: string = getIconWithName('plus-circle-line');
  public createSalaryLastResult: string = '';

  // Json Dialog
  public jsonDetails: string;

  // Delete Confirm
  public deleteConfirmMessage: string;
  public deletionEntry: Gehalt;

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

    this.createHeader();
    this.navigationService.activeMenu.next(2);

  }

  public setSize(size: TableSize) {
    this.tableSize = size;
  }

  ngOnInit(): void {
    this.updateEntries();
  }

  private updateEntries() {
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
           
      let action = new TableRowAction();
      action.tooltip = "Delete";
      action.icon = "../../assets/icons/trash-line.svg";
      action.action = (id: number) => {
        this.deletionEntry = entry;
        this.deleteConfirmMessage = `Confirm deleting entry ${entry.id}: ${entry.Jahr}/${entry.Monat > 9 ? entry.Monat : "0"+entry.Monat}?`;
        this.openModal('delete-confirmation');
      };
      row.actions.push(action); 
      
      let info = new TableRowAction();
      info.tooltip = "Log";
      info.icon = getIconWithName('info-standard-line');
      info.action = (id: number) => {
        this.jsonDetails = JSON.stringify(entry, undefined, 2);
        this.openModal('json');
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

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}