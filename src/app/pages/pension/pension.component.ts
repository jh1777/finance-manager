import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { getIconWithName } from 'src/app/data/iconFactory';
import { ModalService } from 'src/app/modalModule';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { NumberTableCell, StyledTextTableCell, TableHeader, TableRow, TableRowAction, TableSize, TextTableCell } from 'src/app/ui';
import { SortEntry } from 'src/app/ui/models/table/sortEntry';
import { FinanceApiService, Pension } from 'src/services/finance-api.service';

@Component({
  selector: 'app-pension',
  templateUrl: './pension.component.html',
  styleUrls: ['./pension.component.scss']
})
export class PensionComponent implements OnDestroy {
  public pageTitle = "Pension";
  public lastResult: string = '';

  private data: Array<Pension> = [];

  /// Heder Navigation
  public addEntryIcon: string = getIconWithName('plus-circle-line');

  // User Management
  public persons: Array<string> = ['Julia', 'Jörg'];
  public currentPerson: string = 'Jörg';
  public personIcon: string = getIconWithName('user-line');
  public personButtonLabel = (p: string) => `Switch to ${p}`;
  //
  ///

  // Table Actions
  public changeEntry = new Pension();
  public deletionEntry: Pension;
  public deleteConfirmMessage: string;
  //

  // Table
  public rows: Array<TableRow> = [];
  public header: Array<TableHeader> = [];
  public groupCell: number;
  public tableSize: TableSize = TableSize.Medium;
  public footerText: string;
  public currentSortEntry: SortEntry = new SortEntry({
    column: new TableHeader({
      isSortable: true,
      label: 'Name'
    }),
    direction: 'asc'
  });
  //

  private subscription = new Subscription();

  public types: Array<string> = ['Rente', 'Berufsunfähigkeit', 'Todesfallsumme', 'Invalidität'];

  constructor(
    private api: ApiService,
    private modalService: ModalService,
    private navigationService: NavigationService,
    private datePipe: DatePipe,
    private financeApi: FinanceApiService,
    private currencyPipe: CurrencyPipe
  ) {

    this.navigationService.activeMenu.next(5);
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private showResultWithTimer(message: string) {
    this.lastResult = message;
    const resultTimer = timer(10000);
    this.subscription.add(resultTimer.subscribe(v => this.lastResult = ''));
  }

  private loadData() {
    this.subscription.add(this.financeApi.getPensions().subscribe({
        next: (result) => {

          this.data = result.SortAscending('name');
          // Person filter
          this.data = this.data.filter(d => d.person == this.currentPerson);
          //  Mapping
          this.mapDataToTableModel();
        },
        error: (err) => {
          console.log("Error loading pensions!", err);
        }
      })
    );
  }

  private createHeader() {
    let header: Array<TableHeader> = [];

    header.push({ label: 'No.' });
    header.push({ label: 'Name', isSortable: true });
    header.push({ label: 'Versicherung' });
    header.push({ label: 'Versicherungsnummer' });
    header.push({ label: 'Monatsbetrag', summarizeWhenGrouped: true });
    header.push({ label: 'Einmalzahlung', summarizeWhenGrouped: true });
    header.push({ label: 'Todesfallsumme', summarizeWhenGrouped: true });
    header.push({ label: 'Berufsunfähigkeit', summarizeWhenGrouped: true });
    header.push({ label: 'Fälligkeit' });
    header.push({ label: 'Kommentar' });

    this.header = header;
    this.groupCell = 8;
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
        this.openModal('change-entry');
      };
      row.actions.push(action);

      // Actions
      action = new TableRowAction();
      action.tooltip = "Delete";
      action.icon = getIconWithName("trash-line");
      action.action = (id: string) => {
        this.deletionEntry = entry;
        this.deleteConfirmMessage = `Confirm Entry deletion: Id=${entry.id}: ${entry.name}?`;
        this.openModal('delete-confirmation');
      };
      row.actions.push(action);

      // Cells
      row.cells.push(new TextTableCell({ id: entry.id, label: entry.id ? `${entry.id}` : "n/a" }));
      row.cells.push(new StyledTextTableCell({ id: entry.id, label: entry.name, style: { 'font-weight': '500' } }));
      row.cells.push(new TextTableCell({ id: entry.id, label: entry.versicherung }));
      row.cells.push(new TextTableCell({ id: entry.id, label: entry.versicherungsnummer }));

      // Cells
      let cell = new NumberTableCell({ id: entry.id, label: this.currencyPipe.transform(entry.monatsbetrag), numericValue: entry.monatsbetrag });
      cell.action = () => {
        this.changeEntry = entry;
        this.openModal('change-value');
      };
      cell.actionIcon = getIconWithName("slider-line");
      row.cells.push(cell);

      let cell2 = new NumberTableCell({ id: entry.id, label: this.currencyPipe.transform(entry.einmalzahlung), numericValue: entry.einmalzahlung });
      cell2.action = () => {
        this.changeEntry = entry;
        this.openModal('change-value');
      };
      cell2.actionIcon = getIconWithName("slider-line");
      row.cells.push(cell2);

      let cell3 = new NumberTableCell({ id: entry.id, label: this.currencyPipe.transform(entry.todesfallsumme), numericValue: entry.todesfallsumme });
      cell3.action = () => {
        this.changeEntry = entry;
        this.openModal('change-value');
      };
      cell3.actionIcon = getIconWithName("slider-line");
      row.cells.push(cell3);

      let cell4 = new NumberTableCell({ id: entry.id, label: this.currencyPipe.transform(entry.berufsunfaehigkeit), numericValue: entry.berufsunfaehigkeit });
      cell4.action = () => {
        this.changeEntry = entry;
        this.openModal('change-value');
      };
      cell4.actionIcon = getIconWithName("slider-line");
      row.cells.push(cell4);

      row.cells.push(new TextTableCell({ id: entry.id, label: this.datePipe.transform(entry.faelligkeit) }));
      row.cells.push(new TextTableCell({ id: entry.id, label: entry.kommentar }));
      result.push(row);
    });

    this.rows = result;
    this.footerText = `${this.rows.length} Entries`;
  }

  public sortColumn(sortEntry: SortEntry) {
    this.currentSortEntry = sortEntry;
    this.loadData();
  }


  // Modal
  public openModal(id: string) {
    this.modalService.open(id);
  }

  public closeModal(id: string) {
    this.modalService.close(id);
  }
  // -----

  // Delete
  /**
   * Deletes one entry from the Database
   * @param $event Pension
   */
  public deleteEntry($event: Pension) {
    if ($event) {
      // Call the API to delete the entry
      this.subscription.add(this.financeApi.deletePension($event.id).subscribe({
        next: (res) => {
          this.showResultWithTimer(`Item ${$event.id}: ${$event.name} Deletion: Acknowledged=${res.isAcknowledged} DeletedCount=${res.deletedCount}`);
          this.loadData();
        },
        error: (err) => {
          this.showResultWithTimer(`Item ${$event.id} Deletion Failed: ${err}`);
        }
      }));
    }
    this.closeModal('delete-confirmation');
  }

  // Change
  /**
   * Value change of an item was triggered by click on a button
   */
   public change() {
    // Create change partial item
    let changedData: Partial<Pension> = {
      monatsbetrag: this.changeEntry.monatsbetrag,
      einmalzahlung: this.changeEntry.einmalzahlung
    }

    this.changeItem(this.changeEntry.id, changedData, true);
    this.closeModal('change-value');
  }

  /**
   * Change new Item in Database
   * @param id number Item id to change
   * @param item Partial<Ausgabe>
   */
  private changeItem(id: string, item: Partial<Pension>, reload: boolean = false) {
    this.subscription.add(this.financeApi.updatePension(id, item as Pension).subscribe(
      res => {
        this.showResultWithTimer(`PUT Pension item: ${this.changeEntry.name}/${this.changeEntry.id}: Acknowledged=${res.isAcknowledged} ModifiedCount=${res.modifiedCount}`);
        if (reload) {
          this.loadData();
        }
      },
      (err: HttpErrorResponse) => {
        this.showResultWithTimer(`Error changing the pension entry!: ${err}`);
        console.error(`Error changing the pension entry!: ${err}`);
      }
    ));
  }
  // -----

  // Create
  public newEntry() {
    this.changeEntry = new Pension();
    this.openModal('change-entry');
  }

  /**
   * Create new Item in Database
   * @param item Ausgabe
   */
   private createItem(item: Pension) {
     if (item.faelligkeit) {
       item.faelligkeit = new Date(item.faelligkeit);
     }

    item.person = this.currentPerson;
    this.subscription.add(this.financeApi.createPension(item).subscribe(
      res => {
        this.showResultWithTimer(`POST Pension item: ${item.name}: Result=${JSON.stringify(res)}`);
        this.loadData();
      },
      (err: HttpErrorResponse) => {
        this.showResultWithTimer(`Error creating the pension entry!: ${err}`);
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
  // -----

  // User
  public changeUser(person: string) {
    this.currentPerson = person;
    this.loadData();
  }
  // -----
}