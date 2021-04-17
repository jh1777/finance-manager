import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Button } from '../models/inline-button-group/button';

@Component({
  selector: 'app-inline-button-group',
  templateUrl: './inline-button-group.component.html',
  styleUrls: ['./inline-button-group.component.scss']
})
export class InlineButtonGroupComponent implements OnInit {

  @Input()
  buttons: Array<Button>;

  @Input()
  multiSelect: boolean = false;

  @Output()
  selectedButtons = new EventEmitter<Array<Button>>();

  constructor() { }

  ngOnInit(): void {
  }

  public buttonClicked(button: Button) {
    button.isSelected = !button.isSelected;
    this.selectedButtons.emit(this.buttons.filter(b => b.isSelected));
  }

}
