import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {dialogObject} from '../models/dialogObject'
import {dialogObjectIndividual} from '../models/dialogObjectIndividual'
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {MatSnackBar} from '@angular/material';
import {playlistParameter} from '../models/playlistParameter';
import {PlaylistParametersService} from '../services/playlist-parameters.service';
import {HttpServiceService} from '../services/http-service.service';
import {PlaylistTracksService} from '../services/playlist-tracks.service';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  loading = true;
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
    private httpService: HttpServiceService,
    private playlistTrackService: PlaylistTracksService
    ) { }

  ngOnInit() {
    var object = this.data.object;
    this.dataObject.name = object.name;
    this.dataObject.type = object.type;
    this.dataObject.image = object.image;
    this.dataObject.id = object.id;
    this.dataObject.strength = 5;
    this.dataObject.relatedArtistStrength = 5;
    this.dataObject.items = [];
    this.dataObject.genres = object.genres;
    this.dataObject.relatedTracks = object.relatedTracks;
    this.access_token = this.data.token;

    if (this.checkIfExists(this.dataObject)){
      let index = this.playlistParameters.getIndex(this.dataObject);
      this.dataObject = this.playlistParameters.getItem(this.dataObject, index);
      if (this.dataObject.items == undefined){
        this.dataObject.items = [];
        //TODO: Not repeat this code
        if (this.dataObject.type == "artist"){
          var url = "https://api.spotify.com/v1/artists/" + this.dataObject.id + "/albums?offset=0&limit=40&album_type=album";
          this.httpService.HttpGet(url).subscribe(
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
                this.httpService.HttpGet(url2).subscribe(
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
                this.dataObject.items.push(item);
                this.loading = false;
              })
              console.log(this.objects);
              this.loading = false;
            },
            (error) => {

            }
          );
        }
        else if (this.dataObject.type == "album"){
          var url = "https://api.spotify.com/v1/albums/" + this.dataObject.id + "?offset=0&limit=20&album_type=album";
          this.httpService.HttpGet(url).subscribe(
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
              this.dataObject.items.push(item);
              this.loading = false;
              console.log(this.objects);
            },
            (error) => {

            }
          );
        }
      }
    }else{
      if (this.dataObject.type == "artist"){
        var url = "https://api.spotify.com/v1/artists/" + this.dataObject.id + "/albums?offset=0&limit=40&album_type=album";
        this.httpService.HttpGet(url).subscribe(
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
              this.httpService.HttpGet(url2).subscribe(
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
              this.dataObject.items.push(item);
              this.loading = false;
            })
            console.log(this.objects);
          },
          (error) => {

          }
        );
      }
      else if (this.dataObject.type == "album"){
        var url = "https://api.spotify.com/v1/albums/" + this.dataObject.id + "?offset=0&limit=20&album_type=album";
        this.httpService.HttpGet(url).subscribe(
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
            this.dataObject.items.push(item);
            this.loading = false;
            console.log(this.objects);
          },
          (error) => {

          }
        );
      }
    }
}

  addToAdditions(object){
    this.playlistTrackService.addToAdditions(object);
  }

  addToExclusions(object){
    this.playlistTrackService.addToExclusions(object);
  }

  generateSelectedParameters(obj){
    return Object.keys(obj).map((key)=>{ return {key:key, value:obj[key]}});
  }

  combineArray(a,b) {
    var len = a.length;
    for (var i=0; i < len; i=i+5000) {
        b.unshift.apply( b, a.slice( i, i+5000 ) );
    }
  } 

  updateItem(object){
    this.playlistParameters.savePlaylistItem(object);
    let successMessage = "Playlist Option Saved";
    this.httpService.NotificationHandler(true,successMessage, object);
  }

  checkIfExists(object){
    return this.playlistParameters.checkItemAlreadyInPlaylist(object);
  }

  deleteItem(object){
    let successMessage = "Removed from Playlist";
    this.playlistParameters.removeFromPlaylist(object);
    this.httpService.NotificationHandler(true,successMessage, object);
  }

  
  updateChildItems(item){
    var selected = item.selected;
    item.items.forEach(result => {
      result.selected = selected;
    })
  }

}
