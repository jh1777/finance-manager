import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ITableCell } from '../models/table/ITableCell';
import { TableRow } from '../models/table/tableRow';
import { TableRowAction } from '../models/table/tableRowAction';
import { TableSize } from '../models/table/tableSize';
import { GroupRow } from '../models/table/groupRow';
import '../../util/arrayExtensions';
import { TableHeader } from '../models/table/tableHeader';
import { SortEntry } from '../models/table/sortEntry';
import { NumberTableCell } from '../models/table/numberTableCell';
import { Dictionary } from 'src/app/util/dictionary';
import { TableSpan } from '../models/table/tableSpan';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit, OnChanges {
  public tableSizeEnum = TableSize;

  @Input()
  rows: Array<TableRow> = [];
  
  @Input()
  header: Array<TableHeader> = [];

  @Input()
  groupColumn: TableHeader = null;

  @Input()
  collapseGroupsByDefault: boolean = false;

  @Input()
  footer: string;

  @Input()
  size: TableSize = TableSize.Small;

  @Output()
  rowAction = new EventEmitter<TableRow>();

  @Output()
  sortAction = new EventEmitter<SortEntry>();

  private excludeGroupsInTable: Array<string> = [];
  private firstLoad: boolean = true;
  public spans: Array<TableSpan> = [];

  @Input()
  public sortEntry: SortEntry = null;

  // TODO: Add "collapse all groups" button in group row 
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.createGroups();
  }

  public isGroupRow(row: TableRow) {
    return row instanceof GroupRow;
  }

  public getNoOfColumns(): number {
    return this.header.length + (this.hasActions() ? 1 : 0);
  }

  private createGroups() {
    if (this.groupColumn) {

      let colIndex = this.header.indexOf(this.groupColumn);
      if (colIndex != -1) {

        // Get all non-Group Rows
        let filterableRows = this.rows.filter(r => !(r instanceof GroupRow));
        // Get the groups: Distinct column content
        let labels = filterableRows.map(r => r.cells[colIndex].label).Distinct();

        // Handle Auto-Group
        if (this.firstLoad && this.collapseGroupsByDefault) { 
          this.excludeGroupsInTable = [];
          labels.forEach(l => this.excludeGroupsInTable.push(l));
          this.firstLoad = false;
        }

        // Create each Group and add its data
        let result = new Array<TableRow>();
        labels.forEach(group => {
          let isCollapsed = this.excludeGroupsInTable.includes(group);
          // Get Data Rows for current group
          let groupData = filterableRows.filter(r => r.cells[colIndex].label == group);
          // Create GroupRow
          let groupRow = new GroupRow({ groupLabel: group, itemCount: groupData.length, isCollapsed: isCollapsed });

          //---sum
          for (var i = 0; i < this.header.length ; i++) {
            if (this.header[i].summarizeWhenGrouped && i != colIndex) {
              let numberCells = groupData.map(g => g.cells[i]).filter(c => c instanceof NumberTableCell);
              var sum = 0;
              numberCells.forEach(c => c.numericValue ?  sum += c.numericValue : c );
              groupRow.summarizedData.push(sum);
            } else {
              groupRow.summarizedData.push(null);
            }
          }
          //-------
          result.push(groupRow);
          // Set Hidden Property for data rows
          for (var i = 0; i < groupData.length ; i++) {
            groupData[i].hidden = isCollapsed;
            result.push(groupData[i]);
          }
        })
        this.rows = result;
      }
    }
    this.spans = this.calculateSpans(this.header);
  }

  public getTotalForColumn(index: number): number {
    var result = 0;
    this.rows.filter(row => row instanceof GroupRow).forEach((row: GroupRow) => {
      if (row.summarizedData) {
        result += row.summarizedData[index];
      }
    });
    return result;
  }

  public sort(column: TableHeader) {
    let defaultItem = new SortEntry({
      direction: 'asc',
      column: column    
    });

    if (this.sortEntry != null) {
      if (this.sortEntry.column.label === column.label) {
        // Sort same column
        if (this.sortEntry.direction === 'desc') {
          // Sort deactivation
          this.sortEntry = null;
        } else {
          // Switch direction
          this.sortEntry.direction = 'desc';
        }
      } else {
        this.sortEntry = defaultItem;
      }
    } else {
      this.sortEntry = defaultItem;
    }
    this.sortAction.emit(this.sortEntry);
  }

  public rowEvent(row: TableRow) {
    this.rowAction.emit(row);
  }

  public groupRowClick(row: GroupRow) {
    if (!this.excludeGroupsInTable.includes(row.groupLabel)) {
      this.excludeGroupsInTable.push(row.groupLabel);
    } else {
      this.excludeGroupsInTable.splice(this.excludeGroupsInTable.indexOf(row.groupLabel), 1);
    }
    row.isCollapsed = !row.isCollapsed;
    this.createGroups();
  }
  
  public hasActions(): boolean {
    return this.rows.some(r => r.actions.length > 0);
  }

  public callback(id: number, $event: TableRowAction) {
    $event.action(id);
  }

  public cellAction(cell: ITableCell) {
    cell.action();
  }

  private calculateSpans(input: Array<TableHeader>): Array<TableSpan> {
    var start = 0;
    let spans: Array<TableSpan> = [];
    for (let i = 1; i < input.length; i++) {
        const item = input[i];
        if (item.summarizeWhenGrouped) {
            if (i - start > 1) {
              spans.push({
                columnId: start == 0 ? 0 : i,
                columnsToSpan: i - start
              })
                //spans.push(i - start); // prev. colspan
            }
            spans.push({
              columnId: i,
              columnsToSpan: 1
            }); // current colspan
            start = i;
        }
    }

    if (input.length - start > 0) 
      //spans.push(input.length - start - 1);
      spans.push({
        columnId: null,
        columnsToSpan: input.length - start - 1
      })
    return spans;
  }
}