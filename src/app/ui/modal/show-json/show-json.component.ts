import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-json',
  templateUrl: './show-json.component.html',
  styleUrls: ['./show-json.component.scss']
})
export class ShowJsonComponent implements OnInit {

  @Input()
  content: string;

  
  constructor() { }

  ngOnInit(): void {
  }

}
