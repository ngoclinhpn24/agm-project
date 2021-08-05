import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';


@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  lat: string | any | number;
  lng: string | any|number;
  zoom: string | any|number;

  public marker: any;
  dataTable: Object[]|any;
  circle: any;
  type: any;
  pathsPolygon:Object[]|any|number;

  public geoCoder: any;

  parsedJson: any;
  postData: any;
  stringifyJson: any;

  public searchResult: any;
  addressSearch: string | any;
  vicinitySearch: string | any;

  url = 'http://localhost:3000/data';

  showInfoWindow = false;

  public map: any;
  public heatmap:any;

  resultPolygon: Object[]|any;
  
  
  constructor() { 
   
  }

  ngOnInit(): void {
  }

}
