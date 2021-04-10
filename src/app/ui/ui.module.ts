import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { TableComponent } from './table/table.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { ModalComponent } from './modal/modal.component';
import { ShowJsonComponent } from './modal/show-json/show-json.component';
import { BadgeComponent } from './badge/badge.component';

export { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
export { TableComponent } from './table/table.component';
export { PageHeaderComponent } from './page-header/page-header.component';
export { ModalComponent } from './modal/modal.component';
export { ShowJsonComponent } from './modal/show-json/show-json.component';
export { BadgeComponent } from './badge/badge.component';

@NgModule({
    declarations: [
      NavigationBarComponent,
      TableComponent,
      PageHeaderComponent,
      ModalComponent,
      ShowJsonComponent,
      BadgeComponent
    ],
  imports: [
    CommonModule
  ],
  exports: [
    NavigationBarComponent,
    TableComponent,
    PageHeaderComponent,
    ModalComponent,
    ShowJsonComponent,
    BadgeComponent
  ]
})
export class UiModule { }
