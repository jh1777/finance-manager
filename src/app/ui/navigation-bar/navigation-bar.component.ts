import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { INavigationItem } from '../models/INavigationItem';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationBarComponent {

  @Input()
  items: Array<INavigationItem> = [];

  @Input()
  selected: number = null;

  @Output()
  selectionEvent = new EventEmitter<INavigationItem>();

  constructor(private router: Router) { }

  public select(id: number) {
    let item = this.items[id];

    if (item.isActionItem && item.toActionItem().action != null) {
      item.toActionItem().action();
    }

    this.selectionEvent.emit(item);
  }
}