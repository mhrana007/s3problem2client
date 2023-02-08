import { Component, OnInit } from '@angular/core';
import { Service } from 'src/services/service';
import { Dropdown } from '../core/models/dropdown';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
} from 'ng-apexcharts';
import { ReadingModel } from '../core/models/reading.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public series!: ApexAxisChartSeries;
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public title!: ApexTitleSubtitle;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;

  dataSource: Array<ReadingModel> | null = [];
  buildingdropdown: Array<Dropdown> | null = [];
  objectdropdown: Array<Dropdown> | null = [];
  datafielddropdown: Array<Dropdown> | null = [];
  DateRange: any = '';
  StartDateRange: any = '';
  EndDateRange: any = '';
  BuildingId = 0;
  ObjectId = 0;
  DataField = 0;
  constructor(private api: Service) {}
  ngOnInit(): void {
    this.GetBuilding(); // Get Building Data For Building Dropdown
    this.GetDataField(); // Get DataField Data For DataField Dropdown
    this.GetObject(); // Get Object Data For Object Dropdown
  }
  GetBuilding() {
    this.api.GetData('building/getall').subscribe(
      (response: any) => {
        if (response) {
          this.buildingdropdown = response;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  GetObject() {
    this.api.GetData('object/getall').subscribe(
      (response: any) => {
        if (response) {
          this.objectdropdown = response;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  GetDataField() {
    this.api.GetData('datafield/getall').subscribe(
      (response: any) => {
        if (response) {
          this.datafielddropdown = response;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  search() {
    this.dataSource = null;
    let obj = {
      BuildingId: this.BuildingId,
      ObjectId: this.ObjectId,
      DataFieldId: this.DataField,
      StartDateRange:
        this.StartDateRange === ''
          ? ''
          : this.api.GetDateTime(this.StartDateRange),
      EndDateRange:
        this.EndDateRange === '' ? '' : this.api.GetDateTime(this.EndDateRange),
    };
    this.api.GetDataByPost(obj, 'reading/getall').subscribe(
      (response: any) => {
        if (response) {
          this.dataSource = response;
          this.initChartData();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  public initChartData(): void {
    let dates = [];
    var result = this.dataSource === null ? [] : this.dataSource;
    for (let i = 0; i < result.length; i++) {
      const timeformat = new Date(result[i].Timestamp).getTime();
      dates.push([timeformat, result[i].Value]);
    }
    this.series = [
      {
        //name: "XYZ MOTORS",
        data: dates,
      },
    ];
    this.chart = {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    };
    this.dataLabels = {
      enabled: false,
    };
    this.markers = {
      size: 0,
    };
    this.title = {
      text: 'Timeseries Data',
      align: 'left',
    };
    this.fill = {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    };
    this.yaxis = {
      labels: {
        formatter: function (val) {
          return val.toString();
        },
      },
      title: {
        text: 'Value',
      },
    };
    this.xaxis = {
      type: 'datetime',
      // labels: {
      //   datetimeFormatter: {
      //     year: 'yyyy',
      //     month: "MMM 'yy",
      //     day: 'dd MMM',
      //     hour: 'HH:mm',
      //   },
      // },
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toString(); //(val / 1000000).toFixed(2);
        },
      },
    };
  }
}
