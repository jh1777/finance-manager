import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class BadgeComponent implements OnInit {

  @Input()
  label: string;

  @Input()
  customClass: 'green' | 'red' | '' = '';

  @Input()
  filled: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
