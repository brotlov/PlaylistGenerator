import { Injectable } from '@angular/core';
import {playlistTrack} from '../models/playlistTrackModel';
import {playlistTrackList} from '../models/playlistTrackModel';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable'
import {Subject} from "rxjs/Subject";
import {HttpServiceService} from "../services/http-service.service";
import {PlaylistParametersService} from '../services/playlist-parameters.service';
import {dialogObject} from '../models/dialogObject'
import {dialogObjectIndividual} from '../models/dialogObjectIndividual'

@Injectable()
export class PlaylistTracksService {

  private trackList = new BehaviorSubject<playlistTrackList>(new playlistTrackList());  
  currentTracks = this.trackList.asObservable();
  constructor(
    private httpService: HttpServiceService,
    public playlistParameters: PlaylistParametersService,
  ) { }

  addToAdditions(object){
    if (object.type == 'artist'){
      this.addToAddtionsFinalStep(object);
      object.genres.forEach(genre => {
        genre = genre.replace(/\s/g, '-');
        let url = "https://api.spotify.com/v1/search?q=genre:" + genre + "&offset=0&limit=50&type=track";
        this.httpService.HttpGet(url).subscribe(
          (data) => {
            let relatedTrackArray = [];
            data.json().tracks.items.forEach(track => {
              if (this.checkIfExistsOrExcluded(track)){
                let trackToAdd = new playlistTrack();
                trackToAdd.album = track.album.name;
                trackToAdd.artist = "";
                if (track.artists != undefined){
                  trackToAdd.artist = track.artists[0].name
                }else{
                  trackToAdd.artist = track.artist;
                }
                trackToAdd.id = track.id;
                trackToAdd.name = track.name;
                trackToAdd.source = object.name + " | related artist";
                trackToAdd.type = track.type;
                relatedTrackArray.push(trackToAdd);
              }
            })
            this.combineArray(relatedTrackArray, object.relatedTracks, object);
          },
          (error) => {
            this.httpService.ErrorHander(url, "", error);
          },
          () =>{
            this.playlistParameters.savePlaylistItem(object);
          }
        ) 
        if (object.items == undefined){
          object.items = [];
          let url = "https://api.spotify.com/v1/artists/" + object.id + "/albums?offset=0&limit=40&album_type=album";
        object.items = [];
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

              },
              () => {
                object.items.push(item);
              });
            })
          },
          (error) => {

          },
          () => {

          }
        );
        }
      })
    }else if (object.type == 'genre'){
      this.getGenreSongs(object);
    }
  }
  
  getGenreSongs(object, start ?){
    let genre = object.name.replace(/\s/g, '-');
    let url = "https://api.spotify.com/v1/search?q=genre:" + genre + "&offset=0&limit=50&type=track";
    if (start != undefined){
      let url = "https://api.spotify.com/v1/search?q=genre:" + genre + "&offset=" + start  + "&limit=50&type=track";
    }
      this.httpService.HttpGet(url).subscribe(
        (data) => {
          let trackArray = [];
          data.json().tracks.items.forEach(track => {
            if (this.checkIfExistsOrExcluded(track)){
              let trackToAdd = new playlistTrack();
              trackToAdd.album = track.album.name;
              trackToAdd.artist = "";
              if (track.artists != undefined){
                trackToAdd.artist = track.artists[0].name
              }else{
                trackToAdd.artist = track.artist;
              }
              trackToAdd.id = track.id;
              trackToAdd.name = track.name;
              trackToAdd.source = object.name + " | related artist";
              trackToAdd.type = track.type;
              trackArray.push(trackToAdd);
            }
          })
          if (object.type != 'genre'){
            this.combineArray(trackArray, object.relatedTracks, object);
          }
        },
        (error) => {
          this.httpService.ErrorHander(url, "", error);
        },
        () =>{
          this.playlistParameters.savePlaylistItem(object);
        }
      )
  }

  addToExclusions(object){
    let successMessage = "Added to Playlist Exclusions";
    let errorMessage = "Sorry, that item is already excluded from your playlist";
    if (this.playlistParameters.addToExclusionsList(object)){
      this.httpService.NotificationHandler(true,successMessage, object);
    }else{
      this.httpService.NotificationHandler(false,errorMessage, object);
    }
  }

  addToAddtionsFinalStep(object){
    let successMessage = "Added to Playlist";
    let errorMessage = "Sorry, that item is already in your playlist";
    if (this.playlistParameters.addToParameterList(object)){
      this.httpService.NotificationHandler(true,successMessage, object);
    }else{
      this.httpService.NotificationHandler(false,errorMessage, object);
    }
  }

  generateSelectedParameters(obj){
    return Object.keys(obj).map((key)=>{ return {key:key, value:obj[key]}});
  }

  checkIfExistsOrExcluded(track){
    let id = track.id;
    if (this.playlistParameters.checkItemAlreadyInPlaylist(track)){
      return false;
    }else{
      return true;
    }
    
  }

  combineArray(a,b, object?) {
    var len = a.length;
    for (var i=0; i < len; i=i+5000) {
      // if (object != undefined){
      //   var tempArray = [];
      //   for (var n = 0; n < b.length; n++){
      //     if (b[n].artists[0].id != object.id){
      //       tempArray.push(b[n]);
      //     }
      //   }
      // }
      b.unshift.apply( b, a.slice( i, i+5000 ) );
    }
  } 

}
