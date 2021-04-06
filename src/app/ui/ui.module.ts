import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { TableComponent } from './table/table.component';
import { PageHeaderComponent } from './page-header/page-header.component';

export { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
export { TableComponent } from './table/table.component';
export { PageHeaderComponent } from './page-header/page-header.component';

@NgModule({
    declarations: [
      NavigationBarComponent,
      TableComponent,
      PageHeaderComponent
    ],
  imports: [
    CommonModule
  ],
  exports: [
    NavigationBarComponent,
    TableComponent,
    PageHeaderComponent
  ]
})
export class UiModule { }
