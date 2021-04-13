import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Gehalt } from 'src/app/services/models/gehalt';

@Component({
  selector: 'app-salary-add-entry',
  templateUrl: './salary-add-entry.component.html',
  styleUrls: ['./salary-add-entry.component.scss']
})
export class SalaryAddEntryComponent implements OnInit {

  @Input()
  model: Gehalt;

  @Output()
  newEntry = new EventEmitter<Gehalt>();

  constructor() { }

  ngOnInit(): void {
  }

  submit() {
    this.newEntry.emit(this.model);
  }
}