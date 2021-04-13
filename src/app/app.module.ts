import { CUSTOM_ELEMENTS_SCHEMA, DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { SalaryComponent } from './pages/salary/salary.component';
import { UiModule } from './ui/ui.module';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TestComponent } from './components/test/test.component';
import { SalaryYearTileComponent } from './components/salary-year-tile/salary-year-tile.component';
import { SalaryAddEntryComponent } from './components/salary-add-entry/salary-add-entry.component'; 
import { FormsModule } from '@angular/forms';
registerLocaleData(localeDe);


@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    SalaryComponent,
    TestComponent,
    SalaryYearTileComponent,
    SalaryAddEntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    UiModule,
    ModalModule.forRoot()
  ],
  providers: [
    BsModalRef,
    CurrencyPipe,
    {
      provide: LOCALE_ID,
      useValue: 'de' // 'de-DE' for Germany, 'fr-FR' for France ...
    },
    {
      provide: DEFAULT_CURRENCY_CODE, 
      useValue: 'EUR'
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { 
}
