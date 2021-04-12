import { Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;

  @Input()
  title: string;

  @Input()
  componentName: string;

  @Input()
  content: string;

  @Input()
  closeBtnName: string;
 

  private componentRef: ComponentRef<{}>;

  /*
  public componentsMapping =  {
    "test": TestComponent
  };
 */

  constructor(
    public bsModalRef: BsModalRef,
    private modalService: ModalService,
    private componentFactoryResolver: ComponentFactoryResolver) {}
 
  ngOnInit() {
    const component = this.modalService.mapModalContentToComponent[this.componentName];
    if (component) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(component);
      this.componentRef = this.container.createComponent(factory);
    }
  }

}
