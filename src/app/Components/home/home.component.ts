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
  chart: Chart=new Chart;
  addPoint() {
    if (this.chart) {
      this.chart.addPoint(Math.floor(Math.random() * 10));
    } else {
      alert('init chart, first!');
    }
  }

  addSerie() {
    this.chart.addSeries({
      name: 'Line ' + Math.floor(Math.random() * 10),
      type: 'line',
      data: [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ],
    },false,false);
  }

  removePoint() {
    this.chart.removePoint(this.chart.ref.series[0].data.length - 1);
  }

  removeSerie() {
    this.chart.removeSeries(this.chart.ref.series.length - 1);
  }

  init() {
    let chart = new Chart({
      chart: {
        type: 'line',
      },
      title: {
        text: 'Linechart',
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: 'Line 1',
          type: 'line',
          data: [1, 2, 3],
        },
      ],
    });
    chart.addPoint(4);
    this.chart = chart;
    chart.addPoint(5);
    setTimeout(() => {
      chart.addPoint(6);
    }, 2000);

    chart.ref$.subscribe(console.log);
  }
  // Highcharts: typeof Highcharts = Highcharts;

  // chartOptions: Highcharts.Options = {
  //   chart: {
  //     renderTo: 'container',
  //     marginLeft: 100,
  //     //  plotAreaWidth: 50,
  //     //   plotAreaHeight: 450,
  //   },

  //   title: {
  //     text: 'Bar series - data sorting',
  //   },

  //   yAxis: {
  //     title: {
  //       text: '',
  //     },
  //   },

  //   xAxis: {
  //     type: 'category',
  //     min: 0,
  //     labels: {
  //       // animate: false
  //     },
  //   },

  //   legend: {
  //     enabled: false,
  //   },

  //   series: [
  //     {
  //       type: 'line',
  //       zoneAxis: 'x',
  //       zones: [
  //         {
  //           value: 2,
  //           color: 'red',
  //         },
  //       ],
  //       dataLabels: {
  //         enabled: true,
  //         format: '{y:,.2f}',
  //       },
  //       data: [
  //         ['hello', 1],
  //         ['heddllo', 5],
  //         ['heldsalo', 2],
  //         ['heldsadsalo', 4],
  //       ],
  //     },
  //   ],
  // };
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
    console.log(this.allData);
    this.ListOfCountries = [
      ...new Set(this.allData.map((item: DataModel) => item.country)),
    ];
    console.log(this.ListOfCountries);
    this.ListOfCamp = [
      ...new Set(this.allData.map((item: DataModel) => item.camp)),
    ];
    console.log(this.ListOfCamp);
    this.ListOfSchool = [
      ...new Set(this.allData.map((item: DataModel) => item.school)),
    ];
    console.log(this.ListOfSchool);
    this.loading = false;
  }
  changeFilter() {
    this.getFilteredData(this.filter.value);
    this.initChart();
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
    console.log(this.filteredData);
  }
  public initChart() {
    // Highcharts.chart('container', this.chartOptions);
    // let chart = new Highcharts.Chart({
    //   chart: {
    //     type: 'line',
    //   },
    //   title: {
    //     text: 'Linechart',
    //   },
    //   credits: {
    //     enabled: false,
    //   },
    //   series: [
    //     {
    //       name: 'Line 1',
    //       data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    //     },
    //   ],
    // });

    // this.chart = chart;
  }
}
