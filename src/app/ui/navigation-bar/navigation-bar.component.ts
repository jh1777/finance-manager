import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { INavigationItem } from '../models/navigation-bar/INavigationItem';

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

  @Input()
  size: 'normal' | 'medium' | 'large' = 'normal';

  @Input()
  darkmode: boolean = false;

  @Output()
  onClick = new EventEmitter<INavigationItem>();

  constructor() { }

  public select(id: number) {
    let item = this.items[id];

    if (item.isActionItem && item.toActionItem().onClick != null) {
      item.toActionItem().onClick();
    }

    this.onClick.emit(item);
  }
}