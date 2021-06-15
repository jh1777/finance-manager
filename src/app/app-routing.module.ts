import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { InsuranceComponent } from './pages/insurance/insurance.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { PensionComponent } from './pages/pension/pension.component';
import { SalaryComponent } from './pages/salary/salary.component';

const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent },
  { path: 'salary', component: SalaryComponent },
  { path: 'insurance', component: InsuranceComponent },
  { path: 'expenses', component: ExpensesComponent },
  { path: 'pension', component: PensionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
