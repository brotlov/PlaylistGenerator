import {Injectable, EventEmitter, ViewChild} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable'
import {Subject} from "rxjs/Subject";
import {playlistParameterList} from '../models/playlistParameterList';

@Injectable()
export class PlaylistParametersService {

  private playlistParameterList = new BehaviorSubject<playlistParameterList>(new playlistParameterList());
  currentParameters = this.playlistParameterList.asObservable();

  constructor() { }

  addToParameterList(object) {
    this.playlistParameterList.value.additions[object.type].push(object);
  }

  addToExclusionsList(object){
    this.playlistParameterList.value.exclusions[object.type].push(object);
  }

  getParameterList(){
    return this.playlistParameterList.getValue();
  }

}