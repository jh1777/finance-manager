import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { INavigationItem } from '../ui/models/INavigationItem';
import { LinkNavigationItem } from '../ui/models/linkNavigationItem';
import { TextNavigationItem } from '../ui/models/textNavigationItem';

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
    let title = new TextNavigationItem("Finance Manager");
    title.showBold = true;
    result.push(title);

    // 1
    let home = new LinkNavigationItem('Home');
    home.icon = "../../assets/icons/home-line.svg";
    home.link = "/overview";
    result.push(home);

    // 2
    let salary = new LinkNavigationItem('Gehalt');
    salary.icon = "../../assets/icons/wallet-line.svg";
    salary.link = "/salary";
    result.push(salary);

    // 3
    let insurance = new LinkNavigationItem('Versicherungen');
    insurance.icon = "../../assets/icons/shield-line.svg";
    insurance.link = "/insurance";
    result.push(insurance);

    // 4
    let settings = new LinkNavigationItem('');
    settings.icon = "../../assets/icons/cog-line.svg";
    settings.link = "/settings";
    settings.align = 'right';
    result.push(settings);

    return result;
  }

  public getNavigationItems(): Array<INavigationItem> {
    return this._navItems;
  }
}
