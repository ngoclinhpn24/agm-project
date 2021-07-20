import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapsAPILoader} from '@agm/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit {
  title = 'AGM project';

  // Hải Dương
  // lat = 20.937342;
  // lng = 106.314552;
  // lat = 21.027763;
  // lng = 105.834160;
  // zoom = 10;
  lat: string|any;
  lng: string|any;
  zoom: string|any;


  

  public marker:any;
  marker1: any;
  circle:any;
  type:any;

  public geoCoder:any;
  address1:string|any;

  parsedJson: any;
  postData: any;
  stringifyJson: any;

  url = 'http://localhost:3000/data';

  onChoseLocation(event: any){
    console.log(event);
    // this.lat = event.coords.lat;
    // this.lng = event.coords.lng;
  }


  @ViewChild('search')
  public searchElementRef: ElementRef | any;

  constructor(private http: HttpClient, private ngZone: NgZone, private mapsAPILoader: MapsAPILoader){
    //   this.http.post(this.url,this.postData).toPromise().then((data) => {
    //     console.log(data); 
    // });

  }

  ngOnInit(): void {
      
    // load dia diem, search tìm kiếm
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation(); // dia diem hien tai cua minh
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // lay ket qua dia diem
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // xac minh ket qua
          if(place.geometry === undefined || place.geometry === null){
            return;
          }

          // tra ve dia chi co:lat, lng, zoom
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 10;
        });
      });
    });


     
      // HTTP post request
      // this.http.post<any>(this.url,{address: 'Trung Quốc', lat: '35.861660', lng: '104.195396', radius: '120'}).subscribe((data) => {
      //    console.log(data); 
      //   this.postData = data;
      // });


      // HTTP get Request

       // this.http.get('/assets/api/place.json').subscribe((data) => {
      //   this.marker = data; // hiển thị ra màn hình
      // });

      this.http.get(this.url).subscribe((data) => {

        // Object data
        console.log(data);
        this.marker1 = data; // lấy dữ liệu hiện ra màn hình, dữ liệu chưa xử lý switch case

        let temp: Object[]|any
        temp = data
        this.marker = temp.map((location:any) => {
          var concaveType = location.concaveType;
          var concaveCode = location.concaveCode;
          var source = location.source;
          var address = location.address;
          var lat:number = +location.lat;
          var lng:number = +location.lng;
          var radius:number = +location.radius;
          var areaName = location.areaName;
          var provinceName = location.provinceName;
          var districtName = location.districtName;
          var villageName = location.villageName;
          var ruralName = location.ruralName;
          var locationName = location.locationName;
          switch(concaveType){
              case 0:
                concaveType = "2G";
                break;
              case 1:
                concaveType = "3G";
                break;
              case 2:
                concaveType = "4G";
                break;
          }   
          
        switch(source){
            case 0:
              source = "Bản ghi MRR";
              break;
            case 1:
              source = "Đo kiểm PAKH";
              break;
            case 2:
              source = "Đo kiểm driving test";
              break;
            case 3:
              source = "Mô phỏng ATOLL";
              break;
            case 4:
              source = "Cung cấp từ VTT ";
              break;
        } 
        return{
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
            locationName: locationName
        }
      });

      console.log("Concave Type ", this.marker)


        // convert lat, lng, radius sang number
        let temp1: Object[]|any
        temp1 = data
        //this.marker = temp.map((location:any, index: any), thi tren 58. subcribe((data))
        this.circle = temp1.map((location:any) => {
             
            //var address = location.address;
            var lat: number = +location.lat; // dùng parseFloat(location.lat) cũng được
            var lng: number = +location.lng;
            var radius: number = +location.radius;
            

            // console.log({
            //   lat: lat,
            //   lng: lng,
            //   radius: radius
            // })
            return{
              lat: lat,
              lng: lng,
              radius: radius
            }
        });
        console.log("Lat Lng Radius: number: ", this.circle)

        // Convert to JSON

        this.stringifyJson = JSON.stringify(data);  
        //console.log("With Stringify: " , this.stringifyJson);  

        // Parse from JSON

        var parsedJson = JSON.parse(this.stringifyJson);  
        console.log("Parse JSON: " , parsedJson);  

       
        var locat = parsedJson[0];
        console.log("Location1: ", locat);
        console.log("Address: ", locat.address);
        // this.parsedJson = JSON.parse(this.stringifyJson);  
        //  console.log("Parsed JSON :" , this.parsedJson);  

    });

  }

   private setCurrentLocation(){
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 10;
        //this.getAddress(this.lat, this.lng);
      });
    }
  }

  
  // getAddress(lat:any, lng:any){
  //   this.geoCoder.geocode({ 'location': { lat: lat, lng: lng } }, (results:any, status:any) => {
  //     console.log(results);
  //     console.log(status);
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.zoom = 9;
  //         this.address1 = results[0].formatted_address;
  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }
  //   });
  // }
  
}
