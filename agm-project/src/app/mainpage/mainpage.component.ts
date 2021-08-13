import { Component, OnInit, NgZone, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapsAPILoader, AgmMap } from '@agm/core';

declare var google: any;

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  lat: string | any | number;
  lng: string | any|number;
  zoom: string | any|number;
  radius: string | any;

  public marker: any;
  dataTable: Object[]|any;
  circle: any;
  type: any;
  postData: any;

  public geoCoder: any;
  public map: any;
  markerLatLng: any;
  markerInsideRadius: any | any[] = []; // mang chua các điểm thỏa mãn nằm trong bán kinh ? km

  public searchResult: any;
  
  addressSearch: string | any;

  url = 'http://localhost:3000/data';

  showInfoWindow = false;

  // search
  @ViewChild('search') public searchElementRef: ElementRef | any;
  @ViewChild('AgmMap') public AgmMapElementRef: ElementRef | any;
  
  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader) { 

  }

  onMapLoad(mapInstance: google.maps.Map){
    this.map = mapInstance;
    // const bounds = new google.maps.LatLngBounds();
    //   for (const mm of this.marker) {
    //     bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
    //   }
    // this.map.fitBounds(bounds);

  }

  ngOnInit(): void {
    // load dia diem, search tìm kiếm
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation(); // dia diem hien tai

      this.geoCoder = new google.maps.Geocoder();

      // Gợi ý tìm kiếm
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // lay ket qua dia diem
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // xac minh ket qua
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // tra ve dia chi co: lat, lng, zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.addressSearch = place.formatted_address;
        
          this.zoom = 15;

          console.log('address: ', this.addressSearch);

          // tọa độ lat, lng
          let _coordi = place.geometry?.location;
          // console.log('Place:', place);

          // Xác định bán kính 
          var bounds = this.map.getBounds()
          var center = this.map.getCenter();
          var ne_lat = bounds.getNorthEast().lat();
          var center_lat = center.lat();
          console.log("Ne_lat: ", ne_lat);
          console.log("center: ", center_lat);

          var ne = bounds.getNorthEast();
          const _radius = google.maps.geometry.spherical.computeDistanceBetween(_coordi, ne) / 1000;
          console.log("Radius: ", _radius);
          this.radius = _radius;
        })
        
        

        var body = {
          address: this.addressSearch,
          lat: this.lat,
          lng: this.lng,
          radius: this.radius,
        };

        this.searchResult = body;

        // HTTP post request // save location to db
        this.http.post<any>(this.url, body).subscribe((data) => {
          //this.postData = data;
        });

        console.log("Body: ", body)

        var searchLoc = new google.maps.LatLng(body.lat, body.lng)
        console.log("searchLoc: ", searchLoc);

        // Tính khoảng cách
        
        let temp3 = this.markerLatLng;
    
        // Dùng Filter để lọc, xóa những địa điểm không phù hợp luôn 
        this.markerInsideRadius = temp3.filter((loc: any) => {
          var markerLoc = new google.maps.LatLng(loc.lat, loc.lng);
          const distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(markerLoc, searchLoc)/1000;
          //console.log(" ----> Km: ", distanceInKm);

          if(distanceInKm < 10.0){
            return loc;
          }
        });
        console.log('Result Inside Radius: ', this.markerInsideRadius);

      });

    });


    // lấy data file json 
    // this.http.get(this.url, {params: params} ).subscribe((data) => 
    this.http.get(this.url).toPromise().then((data) => {
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
        
        this.circle = temp1.map((location: any) => {
          var lat: number = +location.lat; 
          var lng: number = +location.lng;
          var radius: number = +location.radius;
  
          return {
            lat: lat,
            lng: lng,
            radius: radius,
          };
        });
        
        
        // Lay lat, lng => tính khoảng cách
        let temp2: Object[] | any;
        temp2 = data;
    
        this.markerLatLng= temp2.map((location: any) => {
          var lat: number = +location.lat; 
          var lng: number = +location.lng;
          return {
            lat: lat,
            lng: lng,
          };
        });
        
              
    });

  }

  setCurrentLocation(){
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 10;
    });
  }}

  onCircleClicked(event:any){
    this.showInfoWindow = !this.showInfoWindow;
  }

  mapIdle(){
  }

}
