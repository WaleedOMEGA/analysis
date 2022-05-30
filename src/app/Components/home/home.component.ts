import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './../../Services/data.service';
import { DataModel } from './../../Models/data.model';
import { Chart } from 'angular-highcharts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // dropdown data
  ListOfCountries: any[] = [];
  ListOfCamp: any[] = [];
  ListOfSchool: any[] = [];

  // all data from api
  allData = [];
  // form containes dropdown lists
  filter: FormGroup = new FormGroup({});
  // loader
  loading: boolean = true;
  // filter data depend on user select
  filteredData = [];
  // create new chart
  chart: Chart = new Chart();
  // data from the current chart
  chartData: { name: string; lessons: number }[] = [];
  totalLessons: number = 0;
  // list of months
  months: string[] = [
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
  ];

  constructor(
    public router: Router,
    private data: DataService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // get all data
    this.getAllData();
    // initialize form
    this.filter = this.fb.group({
      country: [''],
      camp: [''],
      school: [''],
    });
// configure the chart
    this.init();
// set value when come back to home component
    if (this.data.getFilter()) {
      this.filter.setValue(this.data.getFilter().value);

      this.changeFilter();
    }
  }

  // add new school data to chart
  addSerie(name: string, data: (string | number)[][]) {
    this.chart.addSeries(
      {
        name,
        type: 'line',
        data,
      },
      true,
      false
    );
  }
// configure the chart
  init() {
    let self = this;
    // chart options
    this.chart = new Chart({
      chart: {
        type: 'line',
        colorCount: 16,
        marginTop: 100,
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
        text: undefined,
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                self.setItem(
                  this.options.name,
                  this.series.name,
                  this.options.y
                );
              },
            },
          },
        },
      },
      series: [],
    });
  }
  // get all data from api
  getAllData() {
    this.data.getData().subscribe({
      next: this.handelResponse.bind(this),
    });
  }
  // get the content for dropdown lists
  handelResponse(response: any) {
    this.allData = response;

    this.ListOfCountries = [
      ...new Set(this.allData.map((item: DataModel) => item.country)),
    ];

    this.ListOfCamp = [
      ...new Set(this.allData.map((item: DataModel) => item.camp)),
    ];

    this.ListOfSchool = [
      ...new Set(this.allData.map((item: DataModel) => item.school)),
    ];
    if (this.data.getFilter()) {
      this.getFilteredData(this.filter.value);
    }

    this.loading = false;
  }
  // change filter based on user selction
  changeFilter() {
    this.getFilteredData(this.filter.value);
    this.data.setFilter(this.filter);
  }
// get customized data based on user selection
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
    this.init();
    this.getChartData(this.filteredData);
  }
  // group chart data by school
  public getChartData(filteredData: DataModel[]) {
    this.chartData = [];
    for (let i = 0; i < this.ListOfSchool.length; i++) {
      let school = filteredData.filter(
        (item) => item.school == this.ListOfSchool[i]
      );
      if (school.length) {
        let data = [];
        for (let j = 0; j < this.months.length; j++) {
          let month = school.filter((item) => item.month == this.months[j]);
          if (month.length) {
            data.push([month[0].month, month[0].lessons]);
          } else {
            data.push([this.months[j], 0]);
          }
        }

        this.chartData.push({
          name: this.ListOfSchool[i],
          lessons: data.reduce((a, b) => Number(a) + Number(b[1]), 0),
        });
        this.totalLessons = this.chartData.reduce(
          (a, b) => Number(a) + Number(b.lessons),
          0
        );

        this.addSerie(this.ListOfSchool[i], data);
      } else {
        this.totalLessons = this.chartData.reduce(
          (a, b) => Number(a) + Number(b.lessons),
          0
        );
      }
    }
  }
  // set visible data for chart
  toggle(index: number) {
    this.chart.ref.series[index].setVisible(
      !this.chart.ref.series[index].visible,
      true
    );
  }
  // set item details and navigate to item details page
  setItem(month: any, school: any, lessons: any) {
    let item = {
      month,
      camp: this.filter.value.camp ? this.filter.value.camp : null,
      country: this.filter.value.country ? this.filter.value.country : null,
      school,
      lessons,
    };
    this.data.setItem(item);
    this.router.navigate(['item']);
  }
}
