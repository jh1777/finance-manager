import { Component } from '@angular/core';
import { ActionNavigationItem, INavigationItem, TextNavigationItem } from './components/navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'finance-manager';

  items = new Array<INavigationItem>();

  constructor() {
    let item = new ActionNavigationItem('Home');
    item.icon = "../../assets/icons/home-line.svg";

    let textItem = new TextNavigationItem();
    textItem.label = "Finance Manager";
    //textItem.icon = "../../assets/icons/wallet-line.svg";

    let item2 = new ActionNavigationItem('Gehaltsliste');
    item2.icon = "../../assets/icons/table-line.svg";

    item.action = () => {
      console.log("Tesoutput");
    }

    this.items.push(textItem);
    this.items.push(item);
    this.items.push(item2);
  }

  public selectedItem($event: INavigationItem) {
    console.log($event);
  }
}
