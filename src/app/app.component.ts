import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from './services/navigation.service';
import { INavigationItem } from './ui/models/navigation-bar/INavigationItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public selectedTab: number;
  public items = new Array<INavigationItem>();

  constructor(
    private router: Router, 
    private navigationService: NavigationService
    ) {
    this.items = navigationService.getNavigationItems();
    this.navigationService.activeMenu.subscribe(id => {
      this.selectedTab = id;
    })
  }

  public selectItem(item: INavigationItem) {
    if (item.isLinkItem && item.toLinkItem().link != null) {
      this.router.navigate([item.toLinkItem().link]);
    }
  }
}