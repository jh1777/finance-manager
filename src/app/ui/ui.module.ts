import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { TableComponent } from './table/table.component';

export { NavigationBarComponent } from './navigation-bar/navigation-bar.component';

@NgModule({
    declarations: [
      NavigationBarComponent,
      TableComponent
    ],
  imports: [
    CommonModule
  ],
  exports: [
    NavigationBarComponent
  ]
})
export class UiModule { }
