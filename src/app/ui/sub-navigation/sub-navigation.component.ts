import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-sub-navigation',
  templateUrl: './sub-navigation.component.html',
  styleUrls: ['./sub-navigation.component.scss']
})
export class SubNavigationComponent implements OnInit {

  @Input()
  routes: Array<Route> = [];
  
  @Output()
  submenuActivated = new EventEmitter<Route>();

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  public isCurrentRoute(item: Route): boolean {
    return this.activatedRoute.routeConfig == item;
  }

  public itemClicked(item: Route) {
    this.submenuActivated.emit(item);
    console.log(item);
  }
}
