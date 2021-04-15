import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalaryChartComponent } from './components/salary-chart/salary-chart.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { SalaryComponent } from './pages/salary/salary.component';

const routes: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent },
  { path: 'salary', component: SalaryComponent },
  { path: 'chart', component: SalaryChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
