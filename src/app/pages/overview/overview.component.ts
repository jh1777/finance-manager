import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public pageTitle: string = "Home";
  
  constructor(private navigationService: NavigationService) { 
    this.navigationService.activeMenu.next(1);

  }

  ngOnInit(): void {
  }

}
