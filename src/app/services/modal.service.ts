import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SalaryAddEntryComponent } from '../components/salary-add-entry/salary-add-entry.component';
import { SalaryChartComponent } from '../components/salary-chart/salary-chart.component';
import { TestComponent } from '../components/test/test.component';
import { ShowJsonComponent } from '../ui/modal/show-json/show-json.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public modalEvent = new Subject<string>();
  
  constructor() { }

  public mapModalContentToComponent = {
    'test': TestComponent,
    'json': ShowJsonComponent,
    'salary-add': SalaryAddEntryComponent,
    'salary-chart': SalaryChartComponent
  };
}
