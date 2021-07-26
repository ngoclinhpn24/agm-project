import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapsAPILoader } from '@agm/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AGM project';

  lat: string | any | number;
  lng: string | any|number;
  zoom: string | any|number;

  public marker: any;
  dataTable: any;
  circle: any;
  type: any;

  public geoCoder: any;

  parsedJson: any;
  postData: any;
  stringifyJson: any;

  public searchResult: any;
  addressSearch: string | any;
  vicinitySearch: string | any;

  url = 'http://localhost:3000/data';

  showInfoWindow = false;

   private map: any;
   private heatmap:any;
  
 
  // show tooltip
  onCircleClicked(event: any) {
    this.showInfoWindow = !this.showInfoWindow;
  }

  onChoseLocation(event: any) {
    console.log(event, 'test');
    this.showInfoWindow = !this.showInfoWindow;
  }

  
  // heatmap
  onMapLoad(mapInstance: google.maps.Map){
      this.map = mapInstance;
      
      //  const coords = [
      //   new google.maps.LatLng(21.027189, 105.834081),
      //   new google.maps.LatLng(21.027130, 105.834089),
      //   new google.maps.LatLng(21.027074, 105.834100),
      //   new google.maps.LatLng(21.027014, 105.834111),
      //   new google.maps.LatLng(21.026969, 105.834132),
      //   new google.maps.LatLng(21.026924, 105.834148),
      //   new google.maps.LatLng(21.026874, 105.834186),
      //   new google.maps.LatLng(21.026834, 105.834234),
      //   new google.maps.LatLng(21.026794, 105.834282)
      // ]
      this.heatmap = new google.maps.visualization.HeatmapLayer({
        map: this.map,
        // data: coords,
        data: this.getPoints()
      });
  }

  getPoints(){
    const coords = [
      {lat: 21.027189, lng: 105.834081},
      {lat: 21.027130, lng: 105.834089},
      {lat: 21.027074, lng: 105.834100},
      {lat: 21.027014, lng: 105.834111},
      {lat: 21.026969, lng: 105.834132},
      {lat: 21.026924, lng: 105.834148},
      {lat: 21.026874, lng: 105.834186},
      {lat: 21.026834, lng: 105.834234},
      {lat: 21.026794, lng: 105.834282},
      {lat: 21.026743, lng: 105.834318},
      {lat: 21.026698, lng: 105.834366},
      {lat: 21.026643, lng: 105.834409},
      {lat: 21.026603, lng: 105.834462},
      {lat: 21.026723, lng: 105.835139},
      
    ];
    return coords.map((point:any) => 
      new google.maps.LatLng(point.lat, point.lng));
  }


  // search
  @ViewChild('search')
  public searchElementRef: ElementRef | any;

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    
  ) {}

  ngOnInit(): void {
    // load dia diem, search tìm kiếm

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation(); // dia diem hien tai
      this.geoCoder = new google.maps.Geocoder();

      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      // var body;
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // lay ket qua dia diem
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          console.log('Place:', place);
          // xac minh ket qua
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // tra ve dia chi co:lat, lng, zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.addressSearch = place.formatted_address;
          // this.vicinitySearch = place.vicinity;
          this.zoom = 15;

          console.log('address: ', this.addressSearch);
        });
        // console.log("lat: ", this.lat) => ok
        var body = {
          address: this.addressSearch,
          lat: this.lat,
          lng: this.lng,
          radius: 200,
        };

        this.searchResult = body;

        //HTTP post request // save location to db
        this.http.post<any>(this.url, body).subscribe((data) => {
          this.postData = data;
        });
      });
    });

    this.http.get(this.url).subscribe((data) => {
      // Object data
      console.log(data);
      this.dataTable = data; // lấy dữ liệu hiện ra màn hình, dữ liệu chưa xử lý switch case

      // marker: đã xử lý tất cả trường thông tin
      let temp: Object[] | any;
      temp = data;
      this.marker = temp.map((location: any) => {
        var concaveType = location.concaveType;
        var concaveCode = location.concaveCode;
        var source = location.source;
        var address = location.address;
        var lat: number = +location.lat;
        var lng: number = +location.lng;
        var radius: number = +location.radius;
        var areaName = location.areaName;
        var provinceName = location.provinceName;
        var districtName = location.districtName;
        var villageName = location.villageName;
        var ruralName = location.ruralName;
        var locationName = location.locationName;
        switch (concaveType) {
          case 0:
            concaveType = '2G';
            break;
          case 1:
            concaveType = '3G';
            break;
          case 2:
            concaveType = '4G';
            break;
        }

        switch (source) {
          case 0:
            source = 'Bản ghi MRR';
            break;
          case 1:
            source = 'Đo kiểm PAKH';
            break;
          case 2:
            source = 'Đo kiểm driving test';
            break;
          case 3:
            source = 'Mô phỏng ATOLL';
            break;
          case 4:
            source = 'Cung cấp từ VTT ';
            break;
        }
        return {
          concaveCode: concaveCode,
          concaveType: concaveType,
          source: source,
          address: address,
          lat: lat,
          lng: lng,
          radius: radius,
          areaName: areaName,
          provinceName: provinceName,
          districtName: districtName,
          villageName: villageName,
          ruralName: ruralName,
          locationName: locationName,
        };
      });

      // convert lat, lng, radius sang number => circle
      let temp1: Object[] | any;
      temp1 = data;
      //this.marker = temp.map((location:any, index: any), thi tren 58. subcribe((data))
      this.circle = temp1.map((location: any) => {
        var lat: number = +location.lat; // dùng parseFloat(location.lat) cũng được
        var lng: number = +location.lng;
        var radius: number = +location.radius;

        return {
          lat: lat,
          lng: lng,
          radius: radius,
        };
      });
      console.log('Lat Lng Radius: number: ', this.circle);
    });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 8;
      });
    }
  }
}
