import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  @Input()
  items: Array<INavigationItem> = [];

  @Input()
  selected: number = null;

  @Output()
  selection = new EventEmitter<INavigationItem>();

  constructor() { }

  ngOnInit(): void {
  }

  public isActiveLink(item: INavigationItem): boolean {
    return item instanceof ActionNavigationItem || item instanceof LinkNavigationItem;
  }

  private isActionItem(item: INavigationItem): boolean {
    return item instanceof ActionNavigationItem;
  }

  public select(id: number) {
    this.selected = id;
    let item = this.items[id];
    if (this.isActionItem(item) && (item as ActionNavigationItem).action != null) {
      (item as ActionNavigationItem).action();
    }
    this.selection.emit(item);
  }
}

export interface INavigationItem {
  label: string;
  icon?: string;
}

export class ActionNavigationItem implements INavigationItem{
  label: string;
  icon?: string;
  action?: () => void; 
  constructor(label: string) {
    this.label = label;
  }
}

export class LinkNavigationItem implements INavigationItem{
  label: string;
  icon?: string;
  link: string;
}

export class TextNavigationItem implements INavigationItem{
  label: string;
  icon?: string;
}