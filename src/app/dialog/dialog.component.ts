import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {dialogObject} from '../models/dialogObject'
import {dialogObjectIndividual} from '../models/dialogObjectIndividual'
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  name: string;
  type: string;
  image: string;
  id: string;
  // name = "Fall Out Boy";
  // type = "artist";
  // image = "https://i.scdn.co/image/d621cb41aac5fbc406f124bae66c184d58205d5f";
  // id = "4UXqAaa6dQYAk18Lv7PEgX";
  objects = [];
  access_token: string;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: Http,) { }

  ngOnInit() {
    var object = this.data.object;
    this.name = object.name;
    this.type = object.type;
    console.log(this.type);
    this.image = object.image;
    this.id = object.id;
    this.access_token = this.data.token;
    if (this.type == "artist"){
      var url = "https://api.spotify.com/v1/artists/" + this.id + "/albums?offset=0&limit=20&album_type=album";
      this.HttpGet(url).subscribe(
        (data) => {
          data.json().items.forEach(result => {
            var item = new dialogObject();
            item.name = result.name;
            item.image = result.images[1].url;
            item.type = "artist";
            item.selected = true;
            item.open = false;
            item.items = [];
            var url2 = "https://api.spotify.com/v1/albums/" + result.id;
            this.HttpGet(url2).subscribe(
            (data) => {
              var response = data.json();
              var newDate = new Date(response.release_date).getFullYear();
              item.year = newDate.toString();
              response.tracks.items.forEach(track => {
                var subItem = new dialogObjectIndividual();
                subItem.name = track.name;
                subItem.type = track.type;
                subItem.selected = item.selected;
                subItem.id = track.id;
                subItem.number = track.track_number;
                item.items.push(subItem);
              })
            },
            (error) => {

            });
            this.objects.push(item);
          })
          console.log(this.objects);
        },
        (error) => {

        }
      );
    }
    else if (this.type == "album"){
      var url = "https://api.spotify.com/v1/albums/" + this.id + "?offset=0&limit=20&album_type=album";
      this.HttpGet(url).subscribe(
        (data) => {
          var item = new dialogObject();
          item.items = [];
          item.selected = true;
          var response = data.json();
          var newDate = new Date(response.release_date).getFullYear();
          response.tracks.items.forEach(track => {
            var subItem = new dialogObjectIndividual();
            subItem.name = track.name;
            subItem.type = this.type;
            subItem.selected = item.selected;
            subItem.id = track.id;
            subItem.number = track.track_number;
            console.log(subItem);
            item.items.push(subItem);
          })
          this.objects.push(item);
          console.log(this.objects);
        },
        (error) => {

        }
      );
    }
}

  public HttpGet(url){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.access_token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options) 
  }

  public ErrorHander(url, data, error){
    var errorCode = error.json().error.status;
    switch(errorCode){
      case 401:
        // data = {
        //   refresh_token: this.refresh_token
        // } 
        // this.router.navigateByUrl("/refresh_token?access_token=" + this.access_token + "refresh_token=" + this.refresh_token)
    }
  }

}
