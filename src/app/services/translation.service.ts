import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from './api.service';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private DEV = false;

  public readonly languages = {
    'en-TT': 'English (WTF?!)',
    'en-US': 'English (United States)',
    'en-GB': 'English (United Kingdom)' ,
    'zh-CHS': '中文 (简体)',
    'zh-CHT': '中文 (繁體)',
  };


  constructor(
    public translateService: TranslateService,
    private apiService: ApiService,
    private sessionService: SessionService,
  ) {

    this.translateService.addLangs(['en-TT', 'en-US', 'en-GB', 'zh-CHS', 'zh-CHT']);
    this.translateService.setDefaultLang('en-TT');
    this.getUserLanguage();
  }

  public getUserLanguage() {
    if (this.sessionService.token) {
      this.getUserLanguageFromServer();
    } else {
      this.getUserLanguageFromBrowser();
    }
  }




  private getUserLanguageFromServer(): void {
    // first try to get from cloud
    this.apiService.get('https://api.gentlespoon.com/20190605.account/language', this.sessionService.token)
    .subscribe(response => {
      if (response.success) {
        this.translateService.use(this._language);
        this.useLanguage(response.data[0]);
      } else {
        console.warn('[Translation.Service] getUserLanguageFromServer(): ' + response.data);
        this.getUserLanguageFromBrowser();
      }
    }, error => {
      this.getUserLanguageFromBrowser();
    });
  }


  // fallback for get language
  private getUserLanguageFromBrowser(): void {
    // if user has visited before and has a cached language, use it
    var localLanguage = localStorage.getItem('language');
    if (localLanguage) {
      this.useLanguage(localLanguage);
    } else {
      // otherwise, use browser default language
      var lang = this.translateService.getBrowserCultureLang();
      switch (lang) {
        case 'en-US':
        case 'en-GB':
          lang = 'en-TT';
          break;
        case 'zh-TW':
        case 'zh-HK':
        case 'zh-MO':
          lang = 'zh-CHT';
          break;
        case 'zh-CN':
        case 'zh-SG':
          lang = 'zh-CHS';
          break;
      }
      this.useLanguage(lang);
    }
  }





  public saveUserLanguage() : void {
    if (this.sessionService.token) {
      this.saveUserLanguageToServer();
    }
    // always save to browser
    this.saveUserLanguageToBrowser();
  }



  private saveUserLanguageToServer(): void {
    this.apiService.put('https://api.gentlespoon.com/20190605.account/language', this.sessionService.token, {language: this._language})
    .subscribe(response => {
      if (response.success) {
      } else {
        console.error('[Translation.Service] saveUserLanguageToServer(): ', response.data);
        throw(response.data);
      }
    },
    error => {
      console.error('[Translation.Service] saveUserLanguageToServer(): ', error);
    })
  }

  // fallback for save language
  private saveUserLanguageToBrowser(): void  {
    localStorage.setItem('language', this._language);
  }


  private _language: string = 'en-TT';

  public get language(): string {
    return this._language;
  }

  public useLanguage(lang: string): void {
    console.log('[Translation.Service] useLanguage(' + lang + ')');
    this._language = lang;
    this.saveUserLanguage();
    this.translateService.use(this._language);
  }


  public instant(lang: string): string {
    return this.translateService.instant(lang);
  }

}
