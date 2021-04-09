import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GehaltTransformator } from 'src/app/data/gehaltTransformator';
import { ApiService } from 'src/app/services/api.service';
import { Gehalt } from 'src/app/services/models/gehalt';
import { NavigationService } from 'src/app/services/navigation.service';
import { ModalComponent } from 'src/app/ui/ui.module';
import { Dictionary } from 'src/app/util/dictionary';
import { getUnique } from 'src/app/util/uniqueFromArray';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public pageTitle: string = "Home";
  //isPopupVisible: boolean = false;
  
  bsModalRef: BsModalRef;


  // Cards
  public data: Dictionary<Array<Gehalt>> = {};
  public years: Array<number> = [];
  //------

  constructor(
    private navigationService: NavigationService,
    private api: ApiService,
    private modalService: BsModalService
    ) { 
    this.navigationService.activeMenu.next(1);
  }

  ngOnInit(): void {
    // Get Data from API
    this.api.getAllEntries<Gehalt>().subscribe(
      result => {
        let data = result.body;
        this.years = getUnique(data.map(d => d.Jahr)).sort((n1, n2) => {
          if (n1 > n2) { return -1; }
          if (n1 < n2) { return 1;  }
          return 0;
        });
        this.data = GehaltTransformator.groupByJahr(data);
      }
    );
  }

  openModal() { 

    ModalComponent.prototype.componentName = "test";
    ModalComponent.prototype.title = "Details";
    this.bsModalRef = this.modalService.show(ModalComponent);
  }
}