import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { getIconWithName } from 'src/app/data/iconFactory';
import { ModalService } from 'src/app/modalModule';
import { NavigationService } from 'src/app/services/navigation.service';
import { TableRow, TableSize, TextTableCell, TableRowAction, TableHeader } from 'src/app/ui';
import { NumberTableCell } from 'src/app/ui/models/table/numberTableCell';
import { SortEntry } from 'src/app/ui/models/table/sortEntry';
import { StyledTextTableCell } from 'src/app/ui/models/table/styledTextTableCell';
import { Expense, FinanceApiService } from 'src/services/finance-api.service';
import '../../util/dateExtensions';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnDestroy {
  public pageTitle = "Expenses";
  private data: Array<Expense> = [];
  public categories: Array<string> = ['Telefon', 'Streaming', 'Versicherung', 'Wohnung', 'Freizeit', 'KFZ', 'Kinder', 'Sparen', 'Bahn'];

  public persons: Array<string> = ['Julia', 'Jörg'];
  public currentPerson: string = 'Jörg';
  public personIcon: string = getIconWithName('user-line');
  public personButtonLabel = (p: string) => `Switch to ${p}`;

  public rows: Array<TableRow> = [];
  public header: Array<TableHeader> = [];
  public groupCell: number;
  public tableSize: TableSize = TableSize.Medium;
  public footerText: string;

  public addEntryIcon: string = getIconWithName('plus-circle-line');

  public deletionEntry: Expense;
  public deleteConfirmMessage: string;
  
  public lastResult: string = '';
  public currentSortEntry: SortEntry = new SortEntry({
    column: new TableHeader({
      isSortable: true,
      label: 'Name'
    }),
    direction: 'asc'
  });

  public changeEntry: Expense = new Expense();
  private subscription = new Subscription();

  constructor(
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private modalService: ModalService,
    private financeApi: FinanceApiService,
    private navigationService: NavigationService,

  ) {
    this.navigationService.activeMenu.next(4);
    this.loadData();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadData() {
    this.subscription.add(this.financeApi.getExpenses(null).subscribe({
      next: (result) => {
        if (this.currentSortEntry != null) {
          if (this.currentSortEntry.direction == 'asc') {
            this.data = result.SortAscending(this.currentSortEntry.column.label);
          } else if (this.currentSortEntry.direction == 'desc') {
            this.data = result.SortDescending(this.currentSortEntry.column.label);
          }
        } else {
          this.data = result.SortAscending('name');
        }
        // Person filter
        this.data = this.data.filter(d => d.person == this.currentPerson);
        //  Mapping
        this.mapDataToTableModel();
      },
      error: (err) => {
        console.log("Error loading expenses!", err);
      }
    }));
  }

  public newExpenseEntry() {
    this.changeEntry = new Expense();
    this.changeEntry.start = new Date();
    this.changeEntry.person = this.currentPerson;
    this.openModal('change-entry');
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
      action.action = (id: string) => {
        this.changeEntry = entry;
        this.changeEntry.start = new Date();
        this.openModal('change-entry');
      };
      row.actions.push(action); 

      // Actions
      action = new TableRowAction();
      action.tooltip = "Delete";
      action.icon = getIconWithName("trash-line");
      action.action = (id: string) => {
        this.deletionEntry = entry;
        this.deleteConfirmMessage = `Confirm Entry deletion: Id=${entry.id}: ${entry.name}, Created=${ this.datePipe.transform(entry.created) }?`;
        this.openModal('delete-confirmation');
      };
      row.actions.push(action); 

      // Cells
      row.cells.push(new TextTableCell({ id: entry.id, label: entry.id ? `${entry.id}` : "n/a"}));
      row.cells.push(new StyledTextTableCell({ id: entry.id, label: entry.name, style: {'font-weight':'500'} }));
      row.cells.push(new TextTableCell({ id: entry.id, label: entry.kategorie }));
      row.cells.push(new TextTableCell({ id: entry.id, label: entry.intervall }));

      // Cells
      let cell = new NumberTableCell({ id: entry.id, label: this.currencyPipe.transform(entry.betrag), numericValue: entry.betrag });
      cell.action = () => {
        this.changeEntry = entry;
        this.changeEntry.start = new Date();
        this.openModal('change-value');
      };
      cell.actionIcon = getIconWithName("slider-line");
      row.cells.push(cell);

      // Monthly Column calculated
      let monthly = entry.betrag;
      if (entry.intervall == 'Jahr') {
        monthly = monthly / 12;
      } else if (entry.intervall == 'Quartal') {
        monthly = monthly / 3;
      }
      row.cells.push(new NumberTableCell({ id: entry.id, label: this.currencyPipe.transform(monthly), numericValue: monthly }));

      row.cells.push(new TextTableCell({ id: entry.id, label: entry.beschreibung }));
      row.cells.push(new TextTableCell({ id: entry.id, label: this.datePipe.transform(entry.start) }));

      result.push(row);
    });

    this.rows = result;
    this.footerText = `${this.rows.length} Entries`;
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
    header.push({ label: 'Betrag', isSortable: true, summarizeWhenGrouped: false });
    header.push({ label: 'Monatsbetrag', summarizeWhenGrouped: true });
    header.push({ label: 'Beschreibung' });
    header.push({ label: 'Start', isSortable: true });

    this.header = header;
    this.groupCell = 2;
  }
  
  private showResultWithTimer(message: string) {
    this.lastResult = message;
    const resultTimer = timer(10000);
    this.subscription.add(resultTimer.subscribe(v => this.lastResult = ''));
  }

  /**
   * Deletes one entry from the Database
   * @param $event Expense
   */
  public deleteEntry($event: Expense) {
    if ($event) {
      // Call the API to delete the entry
      this.subscription.add(this.financeApi.deleteExpense($event.id).subscribe({
        next: (res) => {
          this.showResultWithTimer(`Item ${$event.id}: ${$event.name}/${$event.created} Acknowledged=${res.isAcknowledged} DeletedCount=${res.deletedCount}`);
          this.loadData();
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

  /**
   * Create new entry from given one with updated timestamps
   * @param entry Expense
   * @returns Expense
   */
  private mapToNewEntry(entry: Expense): Expense {
    let result = new Expense({
      beschreibung: entry.beschreibung,
      betrag: entry.betrag,
      start: entry.start,
      intervall: entry.intervall,
      kategorie: entry.kategorie,
      name: entry.name,
      tag: entry.tag
    });
    return result;
  }

  /**
   * Value change of an item was triggered by click on a button
   */
  public change() {
    // Create newly mapped item
    let newItem = this.mapToNewEntry(this.changeEntry);
    if (!newItem.start || newItem.start == null) 
      newItem.start = new Date(); //this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    
    // Create change partial item
    let changedData: Partial<Expense> = {
      ende: newItem.start
    }

    this.changeItem(this.changeEntry.id, changedData);
    this.createItem(newItem);
    this.closeModal('change-value');
  }

  /**
   * Change new Item in Database
   * @param id number Item id to change
   * @param item Partial<Expense>
   */
  private changeItem(id: string, item: Partial<Expense>, reload: boolean = false) {

    this.subscription.add(this.financeApi.updateExpense(id, item as Expense).subscribe(
      res => {
        this.showResultWithTimer(`PUT Expense item: ${item.name}/${item.betrag}: Acknowledged=${res.isAcknowledged} ModifiedCount=${res.modifiedCount}`);
        if (reload) {
          this.loadData();
        }
      },
      (err: HttpErrorResponse) => {
        this.showResultWithTimer(`Error changing the expense entry!: ${err}`);
        console.error(`Error changing the expense entry!: ${err}`);
      }
    ));
  }

  /**
   * Create new Item in Database
   * @param item Expense
   */
  private createItem(item: Expense) {
    item.person = this.currentPerson;
    if (item.start) {
      item.start = new Date(item.start);
    }
    if (item.ende) {
      item.ende = new Date(item.ende);
    }

    this.subscription.add(this.financeApi.createExpense(item).subscribe(
      res => {
        this.showResultWithTimer(`POST Expense item: ${item.name}/${item.betrag}: Result=${JSON.stringify(res)}`);
        this.loadData();
      },
      (err: HttpErrorResponse) => {
        this.showResultWithTimer(`Error creating the expense entry!: ${err}`);
      }
    ));
  }

  public changeOrCreateEntry() {
    if (this.changeEntry.id) {
      this.changeItem(this.changeEntry.id, this.changeEntry,true);
    } else {
      // New Entry
      this.createItem(this.changeEntry);
    }
    this.closeModal('change-entry');
  }

  public changeUser(person: string) {
    this.currentPerson = person;
    this.loadData();
  }
}