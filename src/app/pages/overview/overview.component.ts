import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SalaryChartComponent } from 'src/app/components/salary-chart/salary-chart.component';
import { GehaltTransformer } from 'src/app/data/gehaltTransformer';
import { ApiService } from 'src/app/services/api.service';
import { Gehalt } from 'src/app/services/models/gehalt';
import { NavigationService } from 'src/app/services/navigation.service';
import { ModalComponent } from 'src/app/ui/ui.module';
import { Dictionary } from 'src/app/util/dictionary';
import { getNYears } from 'src/app/util/getNYears';
import { getUnique } from 'src/app/util/uniqueFromArray';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public bsModalRef: BsModalRef;
  public showAllYears: boolean = false;

  // Config
  private _numberOfYears: number = 6;
  public pageTitle: string = "Home";

  // Cards
  public data: Dictionary<Array<Gehalt>> = {};
  public years: Array<number> = [];
  public diffs: Dictionary<number> = {};
  //------

  constructor(
    private navigationService: NavigationService,
    private api: ApiService,
    private modalService: BsModalService
    ) { 
    this.navigationService.activeMenu.next(1);
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    let years = getNYears(this.showAllYears ? 99 : this._numberOfYears);
    // Get Data from API
    this.api.getAllEntries<Gehalt>().subscribe(
      result => {
        let data = result.body;
        this.years = getUnique(data.map(d => d.Jahr)).filter(y => years.includes(y)).sort((n1, n2) => {
          if (n1 > n2) { return -1; }
          if (n1 < n2) { return 1;  }
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

  public openModal() { 
    ModalComponent.prototype.componentName = "test";
    ModalComponent.prototype.title = "Details";
    this.bsModalRef = this.modalService.show(ModalComponent);
  }

  public openSalaryChart(data: Array<Gehalt>) {
    SalaryChartComponent.prototype.x = data.map(d => `${d.Jahr}/${d.Monat > 9 ? d.Monat : "0"+ d.Monat}`);
    SalaryChartComponent.prototype.y = data.map(d => d.Brutto);
    SalaryChartComponent.prototype.yLabel = 'Brutto';
    ModalComponent.prototype.componentName = "salary-chart";
    ModalComponent.prototype.closeBtnName = "Close";
    ModalComponent.prototype.title = "Chart";
    this.bsModalRef = this.modalService.show(ModalComponent);
  }
}