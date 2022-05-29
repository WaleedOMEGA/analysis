import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataModel } from './../Models/data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
item: DataModel={month:'',camp:'',country:'',school:'',lessons:0};
  filter: any;
  constructor(private http: HttpClient) { 
    
  }

  getData(): Observable<DataModel[]> {
    return this.http.get<DataModel[]>('../../assets/data.json');
  }
  setItem(item:any) {
    this.item = item;
    
  }
  getItem() {
    return this.item;
  }
  setFilter(filter: any) { 
    this.filter = filter;
  }
  getFilter() {
    return this.filter;
  }
}
