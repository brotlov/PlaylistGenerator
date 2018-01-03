import {Injectable, EventEmitter, ViewChild} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable'
import {Subject} from "rxjs/Subject";
import {playlistParameterList} from '../models/playlistParameterList';
import 'rxjs/add/operator/filter';

@Injectable()
export class PlaylistParametersService {

  private playlistParameterList = new BehaviorSubject<playlistParameterList>(new playlistParameterList());
  currentParameters = this.playlistParameterList.asObservable();

  constructor() { }

  addToParameterList(object) {
    var alreadyExistsInExclusions = false;
    if (this.playlistParameterList.value.exclusions[object.type].items.filter(e => e.id == object.id).length > 0){
      alreadyExistsInExclusions = true;
    }
    if (this.playlistParameterList.value.additions[object.type].items.filter(e => e.id == object.id).length == 0 && !alreadyExistsInExclusions) {
      this.playlistParameterList.value.additions[object.type].items.push(object);
      return true;
    }else{
      return false;
    }
  }

  addToExclusionsList(object){
    var alreadyExistsInAdditions = false;
    if (this.playlistParameterList.value.additions[object.type].items.filter(e => e.id == object.id).length > 0){
      alreadyExistsInAdditions = true;
    }
    if (this.playlistParameterList.value.exclusions[object.type].items.filter(e => e.id == object.id).length == 0 && !alreadyExistsInAdditions) {
      this.playlistParameterList.value.exclusions[object.type].items.push(object);
      return true;
    }else{
      return false;
    }
  }

  //TODO: Make this work with exclusions better
  removeFromPlaylist(object){
    let index = this.playlistParameterList.value.additions[object.type].items.map(function(e) { return e.id; }).indexOf(object.id);
    let index2 = this.playlistParameterList.value.exclusions[object.type].items.map(function(e) { return e.id; }).indexOf(object.id);
    if (index != -1){
      this.playlistParameterList.value.additions[object.type].items.splice(index, 1);
    }else if (index2 != -1){
      this.playlistParameterList.value.exclusions[object.type].items.splice(index, 1);
    }
    
  }

  //TODO: Make this work with exclusions better
  savePlaylistItem(object){
    let index = this.playlistParameterList.value.additions[object.type].items.map(function(e) { return e.id; }).indexOf(object.id);
    let index2 = this.playlistParameterList.value.exclusions[object.type].items.map(function(e) { return e.id; }).indexOf(object.id);
    if (index != -1){
      this.playlistParameterList.value.additions[object.type].items[index] = object;
    }else if (index2 != -1){
      this.playlistParameterList.value.exclusions[object.type].items[index] = object;
    }
  }

  //TODO: Make this work with exclusions better
  checkItemAlreadyInPlaylist(object){
    let index = this.playlistParameterList.value.additions[object.type].items.map(function(e) { return e.id; }).indexOf(object.id);
    let index2 = this.playlistParameterList.value.exclusions[object.type].items.map(function(e) { return e.id; }).indexOf(object.id);
    if (index == -1 && index2 == -1){
      return false;
    }else{
      return true;
    }
  }

  //TODO: Make this work with exclusions better
  getIndex(object){
    let index = this.playlistParameterList.value.additions[object.type].items.map(function(e) { return e.id; }).indexOf(object.id);
    let index2 = this.playlistParameterList.value.exclusions[object.type].items.map(function(e) { return e.id; }).indexOf(object.id);
    if (index != -1){
      return index;
    }else if (index2 != -1){
      return index2;
    }
  }

  //TODO: Make this work with exclusions better
  getItem(object, index){
    var additionObject = this.playlistParameterList.value.additions[object.type].items[index];
    if (additionObject != undefined && additionObject.id == object.id){
      return this.playlistParameterList.value.additions[object.type].items[index]
    }else if (this.playlistParameterList.value.exclusions[object.type].items[index]){
      return this.playlistParameterList.value.exclusions[object.type].items[index]
    }
  }

  getParameterList(){
    return this.playlistParameterList.getValue();
  }
}