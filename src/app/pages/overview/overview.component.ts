import { Component } from '@angular/core';
import { GehaltTransformer } from 'src/app/data/gehaltTransformer';
import { getIconWithName } from 'src/app/data/iconFactory';
import { ModalService } from 'src/app/modalModule';
import { ApiService } from 'src/app/services/api.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { Dictionary } from 'src/app/util/dictionary';
import { environment } from 'src/environments/environment';
import { FinanceApiService, Salary } from 'src/services/finance-api.service';
import '../../util/arrayExtensions';
import '../../util/numberExtensions';
import { ChartDataFactory } from './prepareCharts';
import { AgChartOptions } from 'ag-charts-community';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent  {
  public chartButtonIcon = getIconWithName('bar-chart-line');
  public agChartData: AgChartOptions;
  public chartShowsOneYearOnly: boolean = false;

  public chartX = "jahr";
  public chartY: Array<any> = ["brutto", "netto", "akp", "kantine"];
  public chartYNames: Array<any> = ["Brutto", "Netto", "AKP", "Kantine"];
  //----
  //UNUSED public showAllYears: boolean = false;

  // Config
  public numberOfYears: number = 6;
  public pageTitle: string = "Overview";

  // Cards
  public data: Dictionary<Array<Salary>> = {};
  public years: Array<number> = [];
  public diffs: Dictionary<number> = {};
  //------
  private rawData: Salary[];
  
  constructor(
    private navigationService: NavigationService,
    private financeApi: FinanceApiService,
    private api: ApiService,
    //private modalService: BsModalService
    private modalService: ModalService
  ) {
    this.navigationService.activeMenu.next(1);
    this.loadDataV2();
  }

  public showYears(years: number) {
    this.numberOfYears = years; 
    this.loadDataV2();
  }

  private loadDataV2() {
    //let years = getNYears(this.showAllYears ? 99 : this._numberOfYears);
    this.financeApi.getSalaryLastNYears(this.numberOfYears).subscribe(
      result => {
        this.rawData = result;
        if (environment.mockData) {
          this.rawData.map(d => d.netto = d.netto * 63 * Math.random());
          this.rawData.map(d => d.brutto  = d.brutto * 24 * Math.random());
        }
        this.years = this.rawData.map(d => d.jahr).Distinct().sort((n1, n2) => {
          if (n1 > n2) { return -1; }
          if (n1 < n2) { return 1; }
          return 0;
        });
        //let diffedData = GehaltTransformer.calculateYearDiffs(data);
        this.diffs = GehaltTransformer.calculateYearDiffs(this.rawData, 'brutto');
        this.data = GehaltTransformer.groupByJahr(this.rawData);
        //this.years.pop();
      }
    );
  }

  /*
  public toggleShowAllYears() {
    if (this.showAllYears) {
      this.showAllYears = false;
      this.loadDataV2();
    } else {
      this.showAllYears = true;
      this.loadDataV2();
    }
  }
  */
  
  public openAllYearsChart() {
    this.agChartData = ChartDataFactory.yearsSummarized(this.rawData); 
    this.chartShowsOneYearOnly = false;
    this.openModal('year-chart');
  }

  public showMonthsAndYears(type: string) {
    this.agChartData = ChartDataFactory.monthsByYears(this.rawData, type, 4);
    this.chartShowsOneYearOnly = false;
    this.openModal('year-chart');
  }

  public openSalaryChart(year: number) {
    /*
    this.x = data.map(d => `${ d.jahr }/${ d.monat.PadWithZero() }`);
    let yearDataBrutto = data.map(d => d.brutto);
    let yearDataNetto = data.map(d => d.netto);
    this.y = new Array<ChartDataSets>();
    this.y.push({
      data: yearDataBrutto,
      label: 'Brutto'
    },{
      data: yearDataNetto,
      label: 'Netto'
    }
    );
    //this.yLabel = 'Brutto';
    */
    this.chartShowsOneYearOnly = true;
    this.agChartData = ChartDataFactory.oneYear(this.rawData, year);
    this.openModal('year-chart');
  }
  
 
  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}