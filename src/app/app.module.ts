import { CUSTOM_ELEMENTS_SCHEMA, DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from './modalModule';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { SalaryComponent } from './pages/salary/salary.component';
import { UiModule } from './ui/ui.module';
import { HttpClientModule } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { SalaryYearTileComponent } from './components/salary-year-tile/salary-year-tile.component';
import { SalaryAddEntryComponent } from './components/salary-add-entry/salary-add-entry.component'; 
import { FormsModule } from '@angular/forms';
import { SalaryChartComponent } from './components/salary-chart/salary-chart.component';
import { InsuranceComponent } from './pages/insurance/insurance.component';
registerLocaleData(localeDe);


@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    SalaryComponent,
    SalaryYearTileComponent,
    SalaryAddEntryComponent,
    SalaryChartComponent,
    InsuranceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    UiModule,
    ModalModule,
    ChartsModule
  ],
  providers: [
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
