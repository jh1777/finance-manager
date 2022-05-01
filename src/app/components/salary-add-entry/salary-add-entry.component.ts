import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Salary } from 'src/services/finance-api.service';

@Component({
  selector: 'app-salary-add-entry',
  templateUrl: './salary-add-entry.component.html',
  styleUrls: ['./salary-add-entry.component.scss']
})
export class SalaryAddEntryComponent implements OnInit {

  @Input()
  model: Salary;

  @Output()
  newEntry = new EventEmitter<Salary>();

  constructor() { }

  ngOnInit(): void {
  }

  submit() {
    this.newEntry.emit(this.model);
  }
}