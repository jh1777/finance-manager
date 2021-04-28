import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { getIconWithName } from 'src/app/data/iconFactory';
import { ModalService } from 'src/app/modalModule';
import { ApiService } from 'src/app/services/api.service';
import { Ausgabe } from 'src/app/services/models/ausgabe';
import { NavigationService } from 'src/app/services/navigation.service';
import { TableRow, ITableCell, TableSize, TextTableCell, TableRowAction, TableHeader } from 'src/app/ui';
import { SortEntry } from 'src/app/ui/models/table/sortEntry';
import { StyledTextTableCell } from 'src/app/ui/models/table/styledTextTableCell';
import { Describer } from 'src/app/util/objectDescriber';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  public pageTitle = "Expenses";
  private data: Array<Ausgabe> = [];

  public rows: Array<TableRow> = [];
  public header: Array<TableHeader> = [];
  public groupCell: ITableCell;
  public tableSize: TableSize = TableSize.Medium;
  public footerText: string;

  public deletionEntry: Ausgabe;
  public deleteConfirmMessage: string;
  
  public lastResult: string = '';
  private currentSortEntry: SortEntry = null;

  public changeEntry: Ausgabe = new Ausgabe();

  constructor(
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private modalService: ModalService,
    private navigationService: NavigationService,
    public api: ApiService

  ) {
    this.navigationService.activeMenu.next(4);

    this.api.setService("ausgaben");
    this.loadData();

   }

  ngOnInit(): void {
  }

  public rowClicked(row: TableRow) {
    console.log(row);
  }
  
  private mapDataToTableModel() {
    this.createHeader();

    let result = new Array<TableRow>();
    this.data.forEach(entry => {
      let row = new TableRow();
      
      // Actions
      let action = new TableRowAction();
      action.tooltip = "Change";
      action.icon = getIconWithName("pencil-line");
      action.action = (id: number) => {
        
      };
      row.actions.push(action); 

      // Actions
      action = new TableRowAction();
      action.tooltip = "Delete";
      action.icon = getIconWithName("trash-line");
      action.action = (id: number) => {
        this.deletionEntry = entry;
        this.deleteConfirmMessage = `Confirm Entry deletion: Id=${entry.id}: ${entry.Name}, Created=${ this.datePipe.transform(entry.Erstellt) }?`;
        this.openModal('delete-confirmation');
      };
      row.actions.push(action); 

      // Cells
      let cell = new TextTableCell({ id: entry.id, label: entry.id ? `${entry.id}` : "n/a"});
      row.cells.push(cell);

      // Cells
      cell = new StyledTextTableCell({ id: entry.id, label: entry.Name, style: {'font-weight':'500'} });
      row.cells.push(cell);

      // Cells
      cell = new TextTableCell({ id: entry.id, label: entry.Intervall });
      row.cells.push(cell);

      // Cells
      cell = new TextTableCell({ id: entry.id, label: this.currencyPipe.transform(entry.Betrag) });
      cell.action = () => {
        this.changeEntry = entry;
        this.openModal('change-value');
      };
      cell.actionIcon = getIconWithName("slider-line");
      row.cells.push(cell);

      // Cells
      let monthly = entry.Betrag;
      if (entry.Intervall == 'Jahr') {
        monthly = monthly / 12;
      } else if (entry.Intervall == 'Quartal') {
        monthly = monthly / 3;
      }
      cell = new TextTableCell({ id: entry.id, label: this.currencyPipe.transform(monthly) });
      row.cells.push(cell);

      // Cells
      cell = new TextTableCell({ id: entry.id, label: entry.Beschreibung });
      row.cells.push(cell);

      // Cells
      cell = new TextTableCell({ id: entry.id, label: this.datePipe.transform(entry.Erstellt) });
      row.cells.push(cell);

      result.push(row);
    });
    this.rows = result;
  }

  private loadData() {
    this.api.getEntries<Ausgabe>().subscribe({
      next: (result) => {
        if (this.currentSortEntry != null) {
          if (this.currentSortEntry.direction == 'asc') {
            this.data = result.SortAscending(this.currentSortEntry.column.label);
          } else if (this.currentSortEntry.direction == 'desc') {
            this.data = result.SortDescending(this.currentSortEntry.column.label);
          }
        } else {
          this.data = result.SortAscending('Name');
        }
        
        this.mapDataToTableModel();
      },
      error: (err) => {
        console.log("Error loading expenses!", err);
      }
    })
  }

  public sortColumn(sortEntry: SortEntry) {
    console.log(sortEntry);
    this.currentSortEntry = sortEntry;
    this.loadData();
  }

  private createHeader() {
    let header: Array<TableHeader> = [];

    header.push({ label: 'No.' });
    header.push({ label: 'Name', isSortable: true });
    header.push({ label: 'Intervall' });
    header.push({ label: 'Betrag', isSortable: true  });
    header.push({ label: 'Monatsbetrag' });
    header.push({ label: 'Beschreibung' });
    header.push({ label: 'Erstellt', isSortable: true });

    this.header = header;
    this.groupCell = this.header[2];
  }
  
  private showResultWithTimer(message: string) {
    this.lastResult = message;
    const salaryLastResultTimer = timer(10000);
    salaryLastResultTimer.subscribe(v => this.lastResult = '');
  }

  public deleteEntry($event: Ausgabe) {
    if ($event) {
      // Call the API to delete the entry
      this.api.setService("ausgaben");
      this.api.deleteEntryById<Ausgabe>($event.id).subscribe({
        next: (res) => {
          this.showResultWithTimer(`Item ${$event.id}: ${$event.Name}/${$event.Erstellt} Deletion: HTTP Code ${res.status} ${res.statusText}`);
          this.loadData();
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

  public change() {

    console.log(this.changeEntry);
  }
}
