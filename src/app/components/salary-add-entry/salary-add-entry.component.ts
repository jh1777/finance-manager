import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-salary-add-entry',
  templateUrl: './salary-add-entry.component.html',
  styleUrls: ['./salary-add-entry.component.scss']
})
export class SalaryAddEntryComponent implements OnInit {

  @Output()
  event = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  action() {
    this.event.emit();
  }

}
