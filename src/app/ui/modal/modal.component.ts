import { Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TestComponent } from 'src/app/components/test/test.component';

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

  public closeBtnName: string = "Close";
 
  private componentRef: ComponentRef<{}>;

  private componentsMapping = {
    "test": TestComponent
  };

  constructor(
    public bsModalRef: BsModalRef,
    private componentFactoryResolver: ComponentFactoryResolver) {}
 
  ngOnInit() {
    const component = this.componentsMapping[this.componentName];
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.componentRef = this.container.createComponent(factory);
  }

}
