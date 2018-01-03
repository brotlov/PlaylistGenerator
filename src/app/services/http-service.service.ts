import { Injectable } from '@angular/core';
import {Headers, RequestOptions} from '@angular/http';
import {Http, Response} from '@angular/http';
import {AccessTokenService} from "../services/access-token.service";
import {Router, ActivatedRoute, Params} from '@angular/router';
import {MatSnackBar} from '@angular/material';


@Injectable()
export class HttpServiceService {

  constructor(
    private http: Http,
    private router: Router,
    public snackBar: MatSnackBar, 
    private accessTokenService: AccessTokenService,
  ) {   }

  

  HttpGet(url){
    console.log(this.accessTokenService.getAccessToken());
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.accessTokenService.getAccessToken()}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options) 
  }

  HttpPost(url, data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.accessTokenService.getAccessToken()}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, data, options);
  }

  ErrorHander(url, data, error){
    var errorCode = error.json().error.status;
    switch(errorCode){
      case 401:
        data = {
          refresh_token: this.accessTokenService.getRefreshToken()
        } 
        this.router.navigateByUrl("/refresh_token?access_token=" + this.accessTokenService.getAccessToken() + "refresh_token=" + this.accessTokenService.getRefreshToken())
    }
  }

  NotificationHandler(success, message, object ?){
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: 'notification'
    });
  }

}
