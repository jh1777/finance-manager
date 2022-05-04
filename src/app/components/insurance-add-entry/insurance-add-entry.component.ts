import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Insurance } from 'src/services/finance-api.service';

@Component({
  selector: 'app-insurance-add-entry',
  templateUrl: './insurance-add-entry.component.html',
  styleUrls: ['./insurance-add-entry.component.scss']
})
export class InsuranceAddEntryComponent implements OnInit {

  @Input()
  model: Insurance;

  @Output()
  newEntry = new EventEmitter<Insurance>();

  constructor() { }

  ngOnInit(): void {
  }

  submit() {
    this.newEntry.emit(this.model);
  }
}
