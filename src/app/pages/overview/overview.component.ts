import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NavigationService } from 'src/app/services/navigation.service';
import { ModalComponent } from 'src/app/ui/ui.module';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public pageTitle: string = "Home";
  //isPopupVisible: boolean = false;
  
  bsModalRef: BsModalRef;

  constructor(
    private navigationService: NavigationService,
    private modalService: BsModalService
    ) { 
    this.navigationService.activeMenu.next(1);
  }

  ngOnInit(): void {
  }

  openModal(name: string) { 

    ModalComponent.prototype.componentName = name;
    ModalComponent.prototype.title = "Details";
    this.bsModalRef = this.modalService.show(ModalComponent);
  }

/*   public openModalWithComponent() {
    const initialState = {
      content: 'Content',
      title: 'Details'
    };
    this.bsModalRef = this.modalService.show(ModalComponent, { initialState } );
    this.bsModalRef.content.closeBtnName = 'Close';
  } */
}