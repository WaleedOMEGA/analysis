import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from './../../Services/data.service';
import { DataModel } from './../../Models/data.model';
import * as Highcharts from 'highcharts';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  ListOfCountries: any[] = [];
  allData = [];
  ListOfCamp: any[] = [];
  ListOfSchool: any[] = [];
  filter: FormGroup = new FormGroup({});
  loading: boolean = true;
  filteredData = [];
  chart: Chart = new Chart();
  chartData: { name: string, lessons: number []}[] = [];


  addSerie(name: string, data: (string | number)[][]) {
    // console.log(name,data)
    this.chart.addSeries(
      {
        name,
        type: 'line',
        data,
      // color: 'red'
      },
      true,
      true
    );
  }



  removeSerie() {
    this.chart.removeSeries(this.chart.ref.series.length - 1);
  }

  init() {
    new Chart({
      chart: {
        type: 'line',
      },
      yAxis: {
        tickWidth: 1,
        tickColor: '#8e9aa0',
        startOnTick: true,
        endOnTick: true,
        lineWidth: 1,
        //gridLineWidth: 0,
        lineColor: '#f3f3f1',
        title: {
          text: 'No of Lessons',
        },

        labels: {
          overflow: 'justify',
          style: {
            color: '#1D252D',
            fontSize: '10px',
            fontWeight: 'light',
            fontFamily: 'STC_Forward',
          },
        },
      },
      xAxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        title: {
          text: 'Months',
        },
        tickColor: '#8e9aa0',
        startOnTick: true,
        endOnTick: true,
        lineWidth: 1,
        //gridLineWidth: 0,
        lineColor: '#f3f3f1',
        labels: {
          step: 1,

          // rotation: 45,
          padding: 1,
          style: {
            color: '#8e9aa0',
            fontSize: '10px',
            fontWeight: '500',
            fontFamily: 'STC_Forward',
          },
        },
      },
      title: {
        text: 'Analysis Chart',
      },
      credits: {
        enabled: false,
      },
      series: [],
    });
    // chart.ref$.subscribe(console.log);
  }

  constructor(private data: DataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getAllData();
    this.filter = this.fb.group({
      country: [''],
      camp: [''],
      school: [''],
    });
  }
  getAllData() {
    this.data.getData().subscribe({
      next: this.handelResponse.bind(this),
    });
  }
  handelResponse(response: any) {
    this.allData = response;
    // console.log(this.allData);
    this.ListOfCountries = [
      ...new Set(this.allData.map((item: DataModel) => item.country)),
    ];
    // console.log(this.ListOfCountries);
    this.ListOfCamp = [
      ...new Set(this.allData.map((item: DataModel) => item.camp)),
    ];
    // console.log(this.ListOfCamp);
    this.ListOfSchool = [
      ...new Set(this.allData.map((item: DataModel) => item.school)),
    ];
    // console.log(this.ListOfSchool);
    this.loading = false;
  }
  changeFilter() {
    this.getFilteredData(this.filter.value);
  }

  getFilteredData(value: any) {
    this.filteredData = this.allData;
    if (value.country) {
      this.filteredData = this.filteredData.filter(
        (item: DataModel) => item.country === value.country
      );
    }
    if (value.camp) {
      this.filteredData = this.filteredData.filter(
        (item: DataModel) => item.camp === value.camp
      );
    }
    if (value.school) {
      this.filteredData = this.filteredData.filter(
        (item: DataModel) => item.school === value.school
      );
    }
    // console.log(this.filteredData);
    this.init();
    this.getChartData(this.filteredData);
  }
  public getChartData(filteredData: DataModel[]) {
    for (let i = 0; i < this.ListOfSchool.length; i++) {
      let school = filteredData.filter(
        (item) => item.school == this.ListOfSchool[i]
      );
      if (school.length) {
        let data = [];
        for (let j = 0; j < school.length; j++) {
          data.push([school[j].month, school[j].lessons]);
        }
        console.log(data);
        // this.chartData.push({name:this.ListOfSchool[i],lessons:data.reduce((a,b)=>a+b[1],0)});
        this.addSerie(this.ListOfSchool[i], data);

      }
    }

  }
}
