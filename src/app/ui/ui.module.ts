import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { TableComponent } from './table/table.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { ShowJsonComponent } from './show-json/show-json.component';
import { BadgeComponent } from './badge/badge.component';
import { MenuButtonComponent } from './menu-button/menu-button.component';
import { InlineButtonGroupComponent } from './inline-button-group/inline-button-group.component';
import { AppSwitcherComponent } from './app-switcher/app-switcher.component';

export { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
export { TableComponent } from './table/table.component';
export { PageHeaderComponent } from './page-header/page-header.component';
export { ShowJsonComponent } from './show-json/show-json.component';
export { BadgeComponent } from './badge/badge.component';
export { MenuButtonComponent } from './menu-button/menu-button.component';
export { InlineButtonGroupComponent } from './inline-button-group/inline-button-group.component';
export { AppSwitcherComponent } from './app-switcher/app-switcher.component';

@NgModule({
    declarations: [
      NavigationBarComponent,
      TableComponent,
      PageHeaderComponent,
      ShowJsonComponent,
      BadgeComponent,
      MenuButtonComponent,
      InlineButtonGroupComponent,
      AppSwitcherComponent
    ],
  imports: [
    CommonModule
  ],
  exports: [
    NavigationBarComponent,
    TableComponent,
    PageHeaderComponent,
    ShowJsonComponent,
    BadgeComponent,
    MenuButtonComponent,
    InlineButtonGroupComponent,
    AppSwitcherComponent
  ]
})
export class UiModule { }
