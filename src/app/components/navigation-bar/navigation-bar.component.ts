import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';


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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  public isActiveLink(item: INavigationItem): boolean {
    return item instanceof ActionNavigationItem || item instanceof LinkNavigationItem;
  }

  private isActionItem(item: INavigationItem): boolean {
    return item instanceof ActionNavigationItem;
  }

  private isLinkItem(item: INavigationItem): boolean {
    return item instanceof LinkNavigationItem;
  }

  public select(id: number) {
    
    // TODO: place this in calling component!!
    let item = this.items[id];
    if (this.isActionItem(item) && (item as ActionNavigationItem).action != null) {
      (item as ActionNavigationItem).action();
    }

    if (this.isLinkItem(item) && (item as LinkNavigationItem).link != null) {
      this.router.navigate([(item as LinkNavigationItem).link]).then((succ: boolean) => {
        if (succ) {
          this.selected = id;
        }
      });
    }

    this.selection.emit(item);
  }
}

export interface INavigationItem {
  label: string;
  icon?: string;
  align: 'left' | 'right';
}

export class ActionNavigationItem implements INavigationItem{
  label: string;
  icon?: string;
  align: 'left' | 'right' = 'left';
  action?: () => void; 
  constructor(label: string) {
    this.label = label;
  }
}

export class LinkNavigationItem implements INavigationItem{
  label: string;
  icon?: string;
  link: string;
  align: 'left' | 'right' = 'left';
  constructor(label: string) {
    this.label = label;
  }
}

export class TextNavigationItem implements INavigationItem{
  label: string;
  icon?: string;
  align: 'left' | 'right' = 'left';
  constructor(label: string) {
    this.label = label;
  }
}