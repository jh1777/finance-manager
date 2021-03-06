import { CUSTOM_ELEMENTS_SCHEMA, DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from 'ng2-charts';
import { ModalModule } from './modalModule';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { SalaryComponent } from './pages/salary/salary.component';
import { UiModule } from './ui/ui.module';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { SalaryYearTileComponent } from './components/salary-year-tile/salary-year-tile.component';
import { SalaryAddEntryComponent } from './components/salary-add-entry/salary-add-entry.component'; 
import { FormsModule } from '@angular/forms';
import { SalaryChartComponent } from './components/salary-chart/salary-chart.component';
import { InsuranceComponent } from './pages/insurance/insurance.component';
import { InsuranceAddEntryComponent } from './components/insurance-add-entry/insurance-add-entry.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { PensionComponent } from './pages/pension/pension.component';
registerLocaleData(localeDe);
import { from } from 'rxjs';
import { FinanceApiService, FINANCE_API_BACKEND_BASE_URL } from 'src/services/finance-api.service';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    SalaryComponent,
    SalaryYearTileComponent,
    SalaryAddEntryComponent,
    SalaryChartComponent,
    InsuranceComponent,
    InsuranceAddEntryComponent,
    ExpensesComponent,
    PensionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    UiModule,
    ModalModule,
    ChartsModule
  ],
  providers: [
    CurrencyPipe,
    DatePipe,
    FinanceApiService,
    {
      provide: FINANCE_API_BACKEND_BASE_URL,
      useValue: environment.apiUrl,
    },
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
