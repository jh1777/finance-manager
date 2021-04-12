import { Injectable } from '@angular/core';
import { SalaryAddEntryComponent } from '../components/salary-add-entry/salary-add-entry.component';
import { TestComponent } from '../components/test/test.component';
import { ShowJsonComponent } from '../ui/modal/show-json/show-json.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  public mapModalContentToComponent = {
    'test': TestComponent,
    'json': ShowJsonComponent,
    'salary-add': SalaryAddEntryComponent
  };
}
