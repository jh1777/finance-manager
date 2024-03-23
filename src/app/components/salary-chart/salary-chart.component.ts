import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-salary-chart',
  templateUrl: './salary-chart.component.html',
  styleUrls: ['./salary-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SalaryChartComponent implements OnChanges {

  // Chart Options
  public chartOptions: AgChartOptions;

  @Input()
  chartData: any;

  @Input()
  xAxesKey: string;

  @Input()
  yAxesKeys: Array<any>;

  @Input()
  yAxesNames: Array<string>;

  @Input()
  title: string = "";
  
  /*

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
  */

  ngOnChanges() {
    var series: Array<any> = [];

    for (let index = 0; index < this.yAxesKeys.length; index++) {
      const element = this.yAxesKeys[index];
      series.push({ type: 'bar', xKey: this.xAxesKey, yKey: element, yName: this.yAxesNames[index] })
    }
    /*
    this.yAxesKeys?.forEach(item => {
      series.push({ type: 'bar', xKey: this.xAxesKey, yKey: item, yName: this.yAxesNames[] })
    });
    */
    this.chartOptions = {
      data: this.chartData,
      title: { text: this.title ?? 'Salary' },
      series: series,
      // [
        //{ type: 'bar', xKey: this.xAxesKey, yKey: this.yAxesKey, yName: this.yAxesName }
      //],
      axes: [
        { type: 'category', position: 'bottom' },
        {
          type: 'number',
          position: 'left',
        },
      ]
    }
  }

  constructor() {

    /*
    this.chartOptions = {
      title: { text: 'Ice Cream Sales' },
      subtitle: { text: 'Data from 2022' },
      // Data: Data to be displayed in the chart
      data: [
        { month: 'Jan', avgTemp: 2.3, iceCreamSales: 162000 },
        { month: 'Mar', avgTemp: 6.3, iceCreamSales: 302000 },
        { month: 'May', avgTemp: 16.2, iceCreamSales: 800000 },
        { month: 'Jul', avgTemp: 22.8, iceCreamSales: 1254000 },
        { month: 'Sep', avgTemp: 14.5, iceCreamSales: 950000 },
        { month: 'Nov', avgTemp: 8.9, iceCreamSales: 200000 },
      ],
      // Series: Defines which chart type and data to use
      series: [
        { type: 'bar', xKey: 'month', yKey: 'iceCreamSales' },
        { type: 'line', xKey: 'month', yKey: 'avgTemp' }
      ],
      axes: [
        { type: 'category', position: 'bottom' },
        { type: 'number', position: 'left', keys: ['iceCreamSales'] },
        { type: 'number', position: 'right', keys: ['avgTemp'] },
    ],
    };
    */
  }
  

}
