import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { INavigationItem } from './ui/models/INavigationItem';
import { LinkNavigationItem } from './ui/models/linkNavigationItem';
import { TextNavigationItem } from './ui/models/textNavigationItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public selectedTab: number = 1;
  public items = new Array<INavigationItem>();

  constructor(private router: Router) {
    this.items = this.createNavigationItems();
  }

  private createNavigationItems(): Array<INavigationItem> {
    let result = new Array<INavigationItem>();

    // 0
    let title = new TextNavigationItem("Finance Manager");
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
    let settings = new LinkNavigationItem('');
    settings.icon = "../../assets/icons/cog-line.svg";
    settings.link = "/settings";
    settings.align = 'right';
    result.push(settings);

    return result;
  }

  public selectItem(item: INavigationItem) {
    if (item.isLinkItem && item.toLinkItem().link != null) {
      this.router.navigate([item.toLinkItem().link]).then((success: boolean) => {
        if (success) {
          this.selectedTab = this.items.indexOf(item);
        }
      });
    }

    console.log(item);
  }
}
