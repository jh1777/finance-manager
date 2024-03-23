import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-salary-chart',
  templateUrl: './salary-chart.component.html',
  styleUrls: ['./salary-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaryChartComponent  {

  private _chartData: AgChartOptions;

  @Input()
  public set chartData(data: AgChartOptions) {
    if (data) {
      this._chartData = data;
      console.log(data);
    } else {
      this._chartData = {
        axes: [],
        series: [],
        data: []
      }
    }
  }

  public get chartData(): AgChartOptions {
    return this._chartData;
  }

}
