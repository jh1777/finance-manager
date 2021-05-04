import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
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
import '../../util/dateExtensions';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  public pageTitle = "Expenses";
  private data: Array<Ausgabe> = [];
  public categories: Array<string> = ['Telefon', 'Streaming', 'Versicherung', 'Wohnung', 'Freizeit', 'KFZ', 'Kinder', 'Sparen', 'Bahn'];

  public rows: Array<TableRow> = [];
  public header: Array<TableHeader> = [];
  public groupCell: ITableCell;
  public tableSize: TableSize = TableSize.Medium;
  public footerText: string;

  public deletionEntry: Ausgabe;
  public deleteConfirmMessage: string;
  
  public lastResult: string = '';
  public currentSortEntry: SortEntry = new SortEntry({
    column: new TableHeader({
      isSortable: true,
      label: 'Name'
    }),
    direction: 'asc'
  });

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
  
  /**
   * Creates Table model from Input Data Model
   */
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
        this.changeEntry = entry;
        this.changeEntry.Start = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.openModal('change-entry');
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
      row.cells.push(new TextTableCell({ id: entry.id, label: entry.id ? `${entry.id}` : "n/a"}));
      row.cells.push(new StyledTextTableCell({ id: entry.id, label: entry.Name, style: {'font-weight':'500'} }));
      row.cells.push(new TextTableCell({ id: entry.id, label: entry.Kategorie }));
      row.cells.push(new TextTableCell({ id: entry.id, label: entry.Intervall }));

      // Cells
      let cell = new TextTableCell({ id: entry.id, label: this.currencyPipe.transform(entry.Betrag) });
      cell.action = () => {
        this.changeEntry = entry;
        this.changeEntry.Start = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.openModal('change-value');
      };
      cell.actionIcon = getIconWithName("slider-line");
      row.cells.push(cell);

      // Monthly Column calculated
      let monthly = entry.Betrag;
      if (entry.Intervall == 'Jahr') {
        monthly = monthly / 12;
      } else if (entry.Intervall == 'Quartal') {
        monthly = monthly / 3;
      }
      row.cells.push(new TextTableCell({ id: entry.id, label: this.currencyPipe.transform(monthly) }));

      row.cells.push(new TextTableCell({ id: entry.id, label: entry.Beschreibung }));
      row.cells.push(new TextTableCell({ id: entry.id, label: this.datePipe.transform(entry.Erstellt) }));

      result.push(row);
    });

    this.rows = result;
  }

  public sortColumn(sortEntry: SortEntry) {
    this.currentSortEntry = sortEntry;
    this.loadData();
  }

  private createHeader() {
    let header: Array<TableHeader> = [];

    header.push({ label: 'No.' });
    header.push({ label: 'Name', isSortable: true });
    header.push({ label: 'Kategorie', isGroupable: true });
    header.push({ label: 'Intervall', isGroupable: true, isSortable: true });
    header.push({ label: 'Betrag', isSortable: true  });
    header.push({ label: 'Monatsbetrag' });
    header.push({ label: 'Beschreibung' });
    header.push({ label: 'Erstellt', isSortable: true });

    this.header = header;
    this.groupCell = this.header[2];
  }
  
  private showResultWithTimer(message: string) {
    this.lastResult = message;
    const resultTimer = timer(10000);
    resultTimer.subscribe(v => this.lastResult = '');
  }

  /**
   * Deletes one entry from the Database
   * @param $event Ausgabe
   */
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

  /**
   * Create new entry from given one with updated timestamps
   * @param entry Ausgabe
   * @returns Ausgabe
   */
  private mapToNewEntry(entry: Ausgabe): Ausgabe {
    let result = new Ausgabe({
      Bearbeitet: new Date().toPreferredStringFormat(),
      Erstellt: new Date().toPreferredStringFormat(),
      Beschreibung: entry.Beschreibung,
      Betrag: entry.Betrag,
      Start: entry.Start,
      Intervall: entry.Intervall,
      Kategorie: entry.Kategorie,
      Name: entry.Name,
      Tag: entry.Tag
    });
    return result;
  }

  /**
   * Value change of an item was triggered by click on a button
   */
  public change() {
    // Create newly mapped item
    let newItem = this.mapToNewEntry(this.changeEntry);
    if (!newItem.Start || newItem.Start == '') 
      newItem.Start = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    
    // Create change partial item
    let changedData: Partial<Ausgabe> = {
      Ende: newItem.Start
    }

    this.changeItem(this.changeEntry.id, changedData);
    this.createItem(newItem);
    this.closeModal('change-value');
  }

  /**
   * Change new Item in Database
   * @param id number Item id to change
   * @param item Partial<Ausgabe>
   */
  private changeItem(id: number, item: Partial<Ausgabe>, reload: boolean = false) {
    this.api.setService("ausgaben");
    this.api.changeEntry<Partial<Ausgabe>>(id, item).subscribe(
        res => {
          var response = <HttpResponse<Partial<Ausgabe>>>res;
          this.showResultWithTimer(`PUT Ausgabe item: ${item.Name}/${item.Betrag}: HTTP Code ${response.status}`);
          if (reload) {
            this.loadData();
          }
        },
        (err: HttpErrorResponse) => {
          this.showResultWithTimer(`Error changing the expense entry!: ${err}`);
          console.error(`Error changing the expense entry!: ${err}`);
        }
      );
  }

  /**
   * Create new Item in Database
   * @param item Ausgabe
   */
  private createItem(item: Ausgabe, fromForm: boolean = false) {
    this.api.setService("ausgaben");
    this.api.createEntry<Ausgabe>(item).subscribe(
        res => {
          var response = <HttpResponse<Ausgabe>>res;
          this.showResultWithTimer(`POST Ausgabe item: ${item.Name}/${item.Betrag}: HTTP Code ${response.status}`);

          if (res.ok) {
            if (fromForm) {
              // TODO::

              //this.resetNewAusgabeItem();
              //this.toggleNewEntryForm();
            }
            this.loadData();
          }
        },
        (err: HttpErrorResponse) => {
          this.showResultWithTimer(`Error creating the expense entry!: ${err}`);
        }
      );
  }

  public changeExistingEntry() {
    this.changeItem(this.changeEntry.id, this.changeEntry,true);
    this.closeModal('change-entry');

  }
}