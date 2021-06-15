import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { getIconWithName } from '../data/iconFactory';
import { INavigationItem } from '../ui/models/navigation-bar/INavigationItem';
import { LinkNavigationItem } from '../ui/models/navigation-bar/linkNavigationItem';
import { TextNavigationItem } from '../ui/models/navigation-bar/textNavigationItem';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  //private _activeMenuId: number = -1;
  private _navItems = new Array<INavigationItem>();


  public activeMenu = new Subject<number>();

  constructor() {
    this._navItems = this.createNavigationItems();
  }

  private createNavigationItems(): Array<INavigationItem> {
    let result = new Array<INavigationItem>();

    // 0
    let title = new TextNavigationItem({
      label: "Finance Manager",
      showBold: true
    });
    result.push(title);

    // 1
    let home = new LinkNavigationItem({
      label: 'Home',
      icon: getIconWithName('home-line'),
      link: "/overview"
    });
    result.push(home);

    // 2
    let salary = new LinkNavigationItem({
      label: 'Salary',
      icon: getIconWithName('wallet-line'),
      link: "/salary"
    });
    result.push(salary);

    // 3
    let insurance = new LinkNavigationItem({
      label: 'Insurance',
      icon: getIconWithName('shield-line'),
      link: "/insurance"
    });
    result.push(insurance);

    // 4
    let expenses = new LinkNavigationItem({
      label: 'Expenses',
      icon: getIconWithName('briefcase-line'),
      link: "/expenses"
    });
    result.push(expenses);

    // 5
    let pension = new LinkNavigationItem({
      label: 'Pension',
      icon: getIconWithName('coin-bag'),
      link: "/pension"
    });
    result.push(pension);

    // 6
    let settings = new LinkNavigationItem({
      label: '',
      icon: getIconWithName('cog-line'),
      link: "/settings",
      align: 'right'
    });
    result.push(settings);

    return result;
  }

  public getNavigationItems(): Array<INavigationItem> {
    return this._navItems;
  }
}
