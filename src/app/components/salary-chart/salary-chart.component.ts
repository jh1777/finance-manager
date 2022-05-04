import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-salary-chart',
  templateUrl: './salary-chart.component.html',
  styleUrls: ['./salary-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaryChartComponent {

  @Input()
  x: Array<string>;

  @Input()
  y: Array<ChartDataSets>;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  public chartColors: Array<any> = [
    { // first color
      backgroundColor: 'rgba(120,120,120,1)',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    },
    { // second color
      backgroundColor: 'rgba(150,150,150,1)',
      borderColor: 'rgba(225,10,24,0.2)',
      pointBackgroundColor: 'rgba(225,10,24,0.2)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(225,10,24,0.2)'
    }
  ];

  ngOnChanges() {
    if (this.x && this.y) {
      this.barChartLabels = this.x;
      this.barChartData = this.y;
    }
  }

}
