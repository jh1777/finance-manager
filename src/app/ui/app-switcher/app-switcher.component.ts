import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Route } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-app-switcher',
  templateUrl: './app-switcher.component.html',
  styleUrls: ['./app-switcher.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      state('void', style({ transform: 'translateY(-100%)' })),
      state('*', style({ transform: 'translateY(0%)' })),
      transition(':enter', animate(`200ms ease-out`)),
      transition(':leave', animate(`200ms ease-in`))
    ])
  ]
})
export class AppSwitcherComponent implements OnInit {

  @Input()
  show: boolean = false;

  @Input()
  routes: Array<Route> = [];

  @Output()
  routeActivated = new EventEmitter<Route>();

  constructor() { 
    this.routes.push({
      path: "/test1",
      data: { label: 'Hallo', style: 'grey' }
    });
    this.routes.push({
      path: "/test1",
      data: { label: 'Hallo' }
    });
    this.routes.push({
      path: "/test2",
      data: { label: 'Hallo 2' }
    });


  }

  ngOnInit(): void {
  }

  public itemClicked(item: Route) {
    this.routeActivated.emit(item);
  }
}
