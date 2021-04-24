import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Versicherung } from 'src/app/services/models/versicherung';

@Component({
  selector: 'app-insurance-add-entry',
  templateUrl: './insurance-add-entry.component.html',
  styleUrls: ['./insurance-add-entry.component.scss']
})
export class InsuranceAddEntryComponent implements OnInit {

  @Input()
  model: Versicherung;

  @Output()
  newEntry = new EventEmitter<Versicherung>();

  constructor() { }

  ngOnInit(): void {
  }

  submit() {
    this.newEntry.emit(this.model);
  }
}
