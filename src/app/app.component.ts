import { Component } from '@angular/core';
import { ActionNavigationItem, INavigationItem, LinkNavigationItem, TextNavigationItem } from './components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'finance-manager';

  items = new Array<INavigationItem>();

  constructor() {
    let item = new LinkNavigationItem('Home');
    item.icon = "../../assets/icons/home-line.svg";
    item.link = "/overview";

    let textItem = new TextNavigationItem("Finance Manager");
    //textItem.icon = "../../assets/icons/wallet-line.svg";

    let item2 = new LinkNavigationItem('Gehaltsliste');
    item2.icon = "../../assets/icons/table-line.svg";
    item2.link = "/salary";


    let settings = new LinkNavigationItem('');
    settings.icon = "../../assets/icons/cog-line.svg";
    settings.link = "/settings";
    settings.align = 'right';

    this.items.push(textItem);
    this.items.push(item);
    this.items.push(item2);
    this.items.push(settings);
  }

  public selectedItem($event: INavigationItem) {
    console.log($event);
  }
}
