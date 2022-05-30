import { Component, OnInit } from '@angular/core';
import { DataService } from './../../Services/data.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  constructor(private data:DataService) { }
  item: any={month:'',camp:'',country:'',school:'',lessons:0};
  ngOnInit(): void {
    this.getItem();
  }
  // get item from home component
  getItem() {
    this.item = this.data.getItem();
}
}
