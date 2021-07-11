import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { ChartDataSets } from 'chart.js';
import { GehaltTransformer } from 'src/app/data/gehaltTransformer';
import { getIconWithName } from 'src/app/data/iconFactory';
import { ModalService } from 'src/app/modalModule';
import { ApiService } from 'src/app/services/api.service';
import { Gehalt } from 'src/app/services/models/gehalt';
import { NavigationService } from 'src/app/services/navigation.service';
import { Dictionary } from 'src/app/util/dictionary';
import { getNYears } from 'src/app/util/getNYears';
import { environment } from 'src/environments/environment';
import '../../util/arrayExtensions';
import '../../util/numberExtensions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  //----
  public showAllYears: boolean = false;

  // Config
  private _numberOfYears: number = 6;
  public pageTitle: string = "Overview";

  // Cards
  public data: Dictionary<Array<Gehalt>> = {};
  public years: Array<number> = [];
  public diffs: Dictionary<number> = {};
  //------

  // CHart
  public x: Array<string>;
  public y: Array<ChartDataSets>;
  public chartButtonIcon = getIconWithName('bar-chart-line');
  
  constructor(
    private navigationService: NavigationService,
    private api: ApiService,
    //private modalService: BsModalService
    private modalService: ModalService
  ) {
    this.navigationService.activeMenu.next(1);
    this.loadData();
  }

  ngOnInit(): void {
   
  }

  private loadData() {
    let years = getNYears(this.showAllYears ? 99 : this._numberOfYears);
    // Get Data from API
    this.api.setService("salary");
    this.api.getAllEntries<Gehalt>().subscribe(
      result => {
        let data = result.body;
        if (environment.mockData) {
          data.map(d => d.Netto = d.Netto * 63 * Math.random());
          data.map(d => d.Brutto  = d.Brutto * 24 * Math.random());
        }
        this.years = data.map(d => d.Jahr).Distinct().filter(y => years.includes(y)).sort((n1, n2) => {
          if (n1 > n2) { return -1; }
          if (n1 < n2) { return 1; }
          return 0;
        });
        //let diffedData = GehaltTransformer.calculateYearDiffs(data);
        this.diffs = GehaltTransformer.calculateYearDiffs(data, 'Brutto');
        this.data = GehaltTransformer.groupByJahr(data);
      }
    );
  }

  public toggleShowAllYears() {
    if (this.showAllYears) {
      this.showAllYears = false;
      this.loadData();
    } else {
      this.showAllYears = true;
      this.loadData();
    }
  }

  public openAllYearsChart(property: string) {

    this.x = new Array<string>();
    for(var i = 1; i < 13; i++) {
      this.x.push(i.PadWithZero());
    }
    this.y = new Array<ChartDataSets>();    
    this.years.forEach(y => {
      this.y.push({
        data: this.data[y].map(d => d[property]),
        label: y.toString()
      });
    });
    this.openModal('year-chart');
  }

  public openSalaryChart(data: Array<Gehalt>) {
    this.x = data.map(d => `${ d.Jahr }/${ d.Monat.PadWithZero() }`);
    let yearDataBrutto = data.map(d => d.Brutto);
    let yearDataNetto = data.map(d => d.Netto);
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
    this.openModal('year-chart');
  }
  
  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}