import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiResponse } from '../classes/apiResponse.class';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as moment from 'moment';




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private DEV = true;

  public killSession() {
    localStorage.clear();
  }

  constructor(
  ) {
    
    // resume session
    console.log('[Session.Service] constructor(): restoring session');
    var savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        console.log('[Session.Service] constructor(): session restored');
        this.setToken(savedToken);
      } catch (ex) {
      }
    }

  }

  private _username = '';
  private _email = '';
  private _expire = '0';
  private _token = '';

  public get username() : string {
    return this._username;
  }
  public get email() : string {
    return this._email;
  }
  public get expire() : string {
    return this._expire;
  }

  public get token() : string {
    if (this._token) {
      try {
        this.validateToken(this._token);
        return this._token;
      } catch (ex) {
        console.warn('[Session.Service] get token(): Token not valid: ', ex);
        return '';
      }
    }
  }
  
  private setToken(token: string) : void {
    if (token) {
      var tokenBody = this.validateToken(token);
      this._email = tokenBody['email'];
      this._expire = tokenBody['exp'];
      this._username = tokenBody['username'];
      this._token = token;
      localStorage.setItem('token', token);
    } else {
      this._email = '';
      this._username = '';
      this._expire = '0';
      this._token = '';
      localStorage.setItem('token', '');
    }
  }



  private validateToken(token: string) : object {
    // console.log('SessionService: validateToken(' + token + ')');
    try {
      if (!token) {
        throw 'token not set';
      }
      var splitToken = token.split('.');
      if (splitToken.length !== 3) {
        throw 'failed to split token';
      }
      try {
        var tokenBodyJSON = atob(splitToken[1]);
        var tokenBody = JSON.parse(tokenBodyJSON);
      } catch (ex) {
        throw 'failed to parse token body';
      }
      var now = moment().toISOString();
      var exp = tokenBody['exp'];
      if (exp <= now) {
        throw 'token expired';
      }
      return tokenBody;
    } catch (ex) {
      throw '[Session.Service] validateToken(): ' + ex;
    }
  }



  

  public signIn(): void {
    window.location.href = `https://account.gentlespoon.com/signin?redirect=${window.location.origin}/signedInLanding.php`;
  }

  public signOut(): void {
    this.killSession();
    window.location.href = `https://account.gentlespoon.com/signout?redirect=${window.location.origin}`;
  }

}
