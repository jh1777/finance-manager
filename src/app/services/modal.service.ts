import { Injectable } from '@angular/core';
import { TestComponent } from '../components/test/test.component';
import { ShowJsonComponent } from '../ui/modal/show-json/show-json.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  public mapModalContentToComponent = {
    'test': TestComponent,
    'json': ShowJsonComponent
  };
}
