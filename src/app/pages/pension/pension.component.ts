import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { getIconWithName } from 'src/app/data/iconFactory';
import { ModalService } from 'src/app/modalModule';
import { ApiService } from 'src/app/services/api.service';
import { Absicherung } from 'src/app/services/models/absicherung';
import { NavigationService } from 'src/app/services/navigation.service';
import { NumberTableCell, StyledTextTableCell, TableHeader, TableRow, TableRowAction, TableSize, TextTableCell } from 'src/app/ui';
import { SortEntry } from 'src/app/ui/models/table/sortEntry';

@Component({
  selector: 'app-pension',
  templateUrl: './pension.component.html',
  styleUrls: ['./pension.component.scss']
})
export class PensionComponent implements OnInit {
  public pageTitle = "Pension";
  public lastResult: string = '';

  private data: Array<Absicherung> = [];

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
  public changeEntry = new Absicherung();
  public deletionEntry: Absicherung;
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

  public types: Array<string> = ['Rente', 'Berufsunfähigkeit', 'Todesfallsumme', 'Invalidität'];

  constructor(
    private api: ApiService,
    private modalService: ModalService,
    private navigationService: NavigationService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) {

    this.navigationService.activeMenu.next(5);
    this.api.setService("pensions");
    this.loadData();

  }
  ngOnInit(): void {

  }

  private showResultWithTimer(message: string) {
    this.lastResult = message;
    const resultTimer = timer(10000);
    resultTimer.subscribe(v => this.lastResult = '');
  }

  private loadData() {
    this.api.getEntries<Absicherung>().subscribe({
      next: (result) => {

        this.data = result.SortAscending('Name');
        // Person filter
        this.data = this.data.filter(d => d.Person == this.currentPerson);
        //  Mapping
        this.mapDataToTableModel();
      },
      error: (err) => {
        console.log("Error loading pensions!", err);
      }
    })
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
        this.deleteConfirmMessage = `Confirm Entry deletion: Id=${entry._id}: ${entry.Name}?`;
        this.openModal('delete-confirmation');
      };
      row.actions.push(action);

      // Cells
      row.cells.push(new TextTableCell({ id: entry._id, label: entry._id ? `${entry._id}` : "n/a" }));
      row.cells.push(new StyledTextTableCell({ id: entry._id, label: entry.Name, style: { 'font-weight': '500' } }));
      row.cells.push(new TextTableCell({ id: entry._id, label: entry.Versicherung }));
      row.cells.push(new TextTableCell({ id: entry._id, label: entry.Versicherungsnummer }));

      // Cells
      let cell = new NumberTableCell({ id: entry._id, label: this.currencyPipe.transform(entry.Monatsbetrag), numericValue: entry.Monatsbetrag });
      cell.action = () => {
        this.changeEntry = entry;
        this.openModal('change-value');
      };
      cell.actionIcon = getIconWithName("slider-line");
      row.cells.push(cell);

      let cell2 = new NumberTableCell({ id: entry._id, label: this.currencyPipe.transform(entry.Einmalzahlung), numericValue: entry.Einmalzahlung });
      cell2.action = () => {
        this.changeEntry = entry;
        this.openModal('change-value');
      };
      cell2.actionIcon = getIconWithName("slider-line");
      row.cells.push(cell2);

      let cell3 = new NumberTableCell({ id: entry._id, label: this.currencyPipe.transform(entry.Todesfallsumme), numericValue: entry.Todesfallsumme });
      cell3.action = () => {
        this.changeEntry = entry;
        this.openModal('change-value');
      };
      cell3.actionIcon = getIconWithName("slider-line");
      row.cells.push(cell3);

      let cell4 = new NumberTableCell({ id: entry._id, label: this.currencyPipe.transform(entry.Berufsunfaehigkeit), numericValue: entry.Berufsunfaehigkeit });
      cell4.action = () => {
        this.changeEntry = entry;
        this.openModal('change-value');
      };
      cell4.actionIcon = getIconWithName("slider-line");
      row.cells.push(cell4);

      row.cells.push(new TextTableCell({ id: entry._id, label: this.datePipe.transform(entry.Faelligkeit) }));
      row.cells.push(new TextTableCell({ id: entry._id, label: entry.Kommentar }));
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
   * @param $event Absicherung
   */
  public deleteEntry($event: Absicherung) {
    if ($event) {
      // Call the API to delete the entry
      this.api.setService("pensions");
      this.api.deleteEntryById<Absicherung>($event._id).subscribe({
        next: (res) => {
          this.showResultWithTimer(`Item ${$event._id}: ${$event.Name}/${$event.Erstellt} Deletion: HTTP Code ${res.status} ${res.statusText}`);
          this.loadData();
        },
        error: (err) => {
          this.showResultWithTimer(`Item ${$event._id} Deletion Failed: ${err}`);
        }
      });
    }
    this.closeModal('delete-confirmation');
  }

  // Change
  /**
   * Value change of an item was triggered by click on a button
   */
   public change() {
    // Create change partial item
    let changedData: Partial<Absicherung> = {
      Monatsbetrag: this.changeEntry.Monatsbetrag,
      Einmalzahlung: this.changeEntry.Einmalzahlung
    }

    this.changeItem(this.changeEntry._id, changedData, true);
    this.closeModal('change-value');
  }

  /**
   * Change new Item in Database
   * @param id number Item id to change
   * @param item Partial<Ausgabe>
   */
  private changeItem(id: string, item: Partial<Absicherung>, reload: boolean = false) {
    item.Bearbeitet = new Date().toPreferredStringFormat();
    this.api.setService("pensions");
    this.api.changeEntry<Partial<Absicherung>>(id, item).subscribe(
        res => {
          var response = <HttpResponse<Partial<Absicherung>>>res;
          this.showResultWithTimer(`PUT Absicherung item: ${this.changeEntry.Name}/${this.changeEntry._id}: HTTP Code ${response.status}`);
          if (reload) {
            this.loadData();
          }
        },
        (err: HttpErrorResponse) => {
          this.showResultWithTimer(`Error changing the pension entry!: ${err}`);
          console.error(`Error changing the pension entry!: ${err}`);
        }
      );
  }
  // -----

  // Create
  public newEntry() {
    this.changeEntry = new Absicherung();
    this.openModal('change-entry');
  }

  /**
   * Create new Item in Database
   * @param item Ausgabe
   */
   private createItem(item: Absicherung) {
    item.Erstellt = new Date().toPreferredStringFormat();
    item.Bearbeitet = new Date().toPreferredStringFormat();
    item.Person = this.currentPerson;

    this.api.setService("pensions");
    this.api.createEntry<Absicherung>(item).subscribe(
        res => {
          var response = <HttpResponse<Absicherung>>res;
          this.showResultWithTimer(`POST Absicherung item: ${item.Name}: HTTP Code ${response.status}`);

          if (res.ok) {
            this.loadData();
          }
        },
        (err: HttpErrorResponse) => {
          this.showResultWithTimer(`Error creating the pension entry!: ${err}`);
        }
      );
  }


  public changeOrCreateEntry() {
    if (this.changeEntry._id) {
      this.changeItem(this.changeEntry._id, this.changeEntry,true);
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