import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Versicherung } from 'src/app/services/models/versicherung';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {

  public pageTitle: string = "Insurance";

  public data: Array<Versicherung>;
 
  constructor(
    private navigationService: NavigationService,
    private api: ApiService
  ) { 
    this.navigationService.activeMenu.next(3);
  }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.api.getAllEntries<Versicherung>().subscribe({
      next: (result) => {
        this.data = result.body
      },
      error: (e) => {
        console.error("Error getting Versicherungen!", e);
      }
    })
  }
}