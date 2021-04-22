import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ITableCell } from '../models/table/ITableCell';
import { TableRow } from '../models/table/tableRow';
import { TableRowAction } from '../models/table/tableRowAction';
import { TableSize } from '../models/table/tableSize';
import { Dictionary } from "../../util/dictionary";
import { GroupRow } from '../models/table/groupRow';
import { Distinct } from 'src/app/util/uniqueFromArray';
import { getIconWithName } from 'src/app/data/iconFactory';


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
  header: Array<ITableCell> = [];

  @Input()
  groupColumn: ITableCell = null;

  @Input()
  collapseGroupsByDefault: boolean = false;

  @Input()
  footer: string;

  @Input()
  size: TableSize = TableSize.Small;

  @Output()
  rowAction = new EventEmitter<TableRow>();

  private grouped = false;
  private excludeGroupsInTable: Array<string> = [];
  private firstLoad: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (!this.grouped) {
      this.createGroups();
    }
  }

  public isGroupRow(row: TableRow) {
    return row instanceof GroupRow;
  }

  public getNoOfColumns(): number {
    return this.header.length;
  }

  private createGroups() {
    if (this.groupColumn) {
      let colIndex = this.header.indexOf(this.groupColumn);
      if (colIndex != -1) {

        let filterableRows = this.rows.filter(r => !(r instanceof GroupRow));
        let labels = Distinct<string>(filterableRows.map(r => r.cells[colIndex].label));
        if (this.firstLoad && this.collapseGroupsByDefault) {
          this.excludeGroupsInTable = [];
          labels.forEach(l => this.excludeGroupsInTable.push(l));
          this.firstLoad = false;
        }

        let result = new Array<TableRow>();
        labels.forEach(group => {
          let isCollapsed = this.excludeGroupsInTable.includes(group);
          let groupIcon =  isCollapsed ? "../assets/icons/angle-line-90.svg" : "../assets/icons/angle-line-180.svg";
          let groupData = filterableRows.filter(r => r.cells[colIndex].label == group);
          let groupRow = new GroupRow({ groupLabel: group, icon: groupIcon, itemCount: groupData.length, isCollapsed: isCollapsed });
          result.push(groupRow);

          for (var i = 0; i < groupData.length ; i++) {
            groupData[i].hidden = isCollapsed;
            result.push(groupData[i]);
          }
        })
        this.rows = result;
        this.grouped = true;
      }
    }
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
    this.grouped = false;
    this.createGroups();
  }
  
  public hasActions(): boolean {
    return this.rows.some(r => r.actions.length > 0);
  }

  public callback(id: number, $event: TableRowAction) {
    $event.action(id);
  }

  public cellAction(cell: ITableCell) {
    console.log("Action in Cell triggered:", cell);
    cell.action();
  }
}

