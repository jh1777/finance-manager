import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuButtonComponent implements OnInit {

  @Input()
  label: string;

  @Input()
  icon: string;

  @Input()
  iconSize: number;

  @Output()
  clickEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  public action() {
    this.clickEvent.emit(this.label);
  }

}
