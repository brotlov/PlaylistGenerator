import { Injectable } from '@angular/core';

@Injectable()
export class AccessTokenService {

  constructor() { }

  public access_token: string;
  public refresh_token : string;

  setTokens(access, refresh){
    this.access_token = access;
    this.refresh_token = refresh;
  }

  getAccessToken(){
    return this.access_token;
  }

  getRefreshToken(){
    return this.refresh_token;
  }

}
