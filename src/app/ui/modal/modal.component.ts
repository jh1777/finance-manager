import { Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TestComponent } from 'src/app/components/test/test.component';
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

  public closeBtnName: string = "Close";
 
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
