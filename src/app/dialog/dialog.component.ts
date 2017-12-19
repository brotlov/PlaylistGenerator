import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {dialogObject} from '../models/dialogObject'
import {dialogObjectIndividual} from '../models/dialogObjectIndividual'
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {MatSnackBar} from '@angular/material';
import {playlistParameter} from '../models/playlistParameter';
import {PlaylistParametersService} from '../services/playlist-parameters.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  dataObject = new playlistParameter();
  // name = "Fall Out Boy";
  // type = "artist";
  // image = "https://i.scdn.co/image/d621cb41aac5fbc406f124bae66c184d58205d5f";
  // id = "4UXqAaa6dQYAk18Lv7PEgX";
  objects = [];
  access_token: string;

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: Http,
    public snackBar: MatSnackBar,
    private playlistParameters: PlaylistParametersService,
    ) { }

  ngOnInit() {
    var object = this.data.object;
    this.dataObject.name = object.name;
    this.dataObject.type = object.type;
    this.dataObject.image = object.image;
    this.dataObject.id = object.id;
    this.dataObject.strength = 5;
    this.dataObject.relatedArtistStrength = 5;
    this.access_token = this.data.token;

    if (this.dataObject.type == "artist"){
      var url = "https://api.spotify.com/v1/artists/" + this.dataObject.id + "/albums?offset=0&limit=20&album_type=album";
      this.HttpGet(url).subscribe(
        (data) => {
          data.json().items.forEach(result => {
            var item = new dialogObject();
            item.name = result.name;
            item.image = result.images[1].url;
            item.type = result.type;
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
    else if (this.dataObject.type == "album"){
      var url = "https://api.spotify.com/v1/albums/" + this.dataObject.id + "?offset=0&limit=20&album_type=album";
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
            subItem.type = track.type;
            subItem.selected = item.selected;
            subItem.id = track.id;
            subItem.number = track.track_number;
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

  //TODO: Move this to a service
  public HttpGet(url){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.access_token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options) 
  }

  //TODO: Move this to a service
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

  addToAdditions(object){
    let successMessage = "Added to Playlist";
    this.NotificationHandler(true,successMessage, object);
    this.playlistParameters.addToParameterList(object);
    console.log(this.playlistParameters);
  }

  addToExclusions(object){
    let successMessage = "Added to Playlist Exclusions";
    this.NotificationHandler(true,successMessage, object);
    this.playlistParameters.addToExclusionsList(object);
    console.log(this.playlistParameters);
  }

  //TODO: Move this to a service
  public NotificationHandler(success, message, object){
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
    });
  }

  updateChildItems(item){
    var selected = item.selected;
    item.items.forEach(result => {
      result.selected = selected;
    })
  }

}
