import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Gehalt } from 'src/app/services/models/gehalt';

@Component({
  selector: 'app-salary-year-tile',
  templateUrl: './salary-year-tile.component.html',
  styleUrls: ['./salary-year-tile.component.scss']
})
export class SalaryYearTileComponent implements OnInit {

  @Input()
  year: number = 0;

  @Input()
  data: Array<Gehalt> = [];

  @Input()
  percent: number;

  @Output()
  details = new EventEmitter<Array<Gehalt>>();

  constructor() { }

  ngOnInit(): void {
  }

  public summarize(attibute: string): number {
    let result =  this.data.reduce((p, c) => p + c[attibute], 0);
    return result;
  }

  public showDetails() {
    this.details.emit(this.data);
  }
}