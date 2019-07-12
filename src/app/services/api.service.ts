import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiResponse } from 'src/app/classes/apiResponse.class';



class RequestOptions {
    url: string;
    httpOptions: {
        headers: HttpHeaders
    };
    body: string;
}


@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private DEV = false;

    private baseUrl = 'https://api.gentlespoon.com/20190712.github-release-stats/';

    constructor(
        private http: HttpClient,
    ) { }




    private prepareRequest(url: string, token?: string, data?: object) : RequestOptions {

        var headerDict = {
            // 'Content-Type': 'application/json',
            'from-application': window.location.href,
        };

        // if a token is provided, append it to header
        if (token) {
            headerDict['Authorization'] = 'bearer ' + token;
        }
        var httpHeaders = new HttpHeaders(headerDict);

        var body = '';
        if (data) {
            body = JSON.stringify(data);
        }

        if (!url.startsWith('//') && !url.startsWith('http://') && ! url.startsWith('https://')) {
            url = this.baseUrl + url;
        }

        var req : RequestOptions = {
            url: url,
            httpOptions: {
                headers: httpHeaders
            },
            body: body,
        };

        // console.dir(req);
        return req;
    }


    delete(url: string, token?: string, data?: object) : Observable<ApiResponse> {
        var req = this.prepareRequest(url, token, data);
        if (this.DEV) console.log('[Api.Service]: delete(): ', req);
        return this.http.delete<ApiResponse>(req.url, req.httpOptions);
    }

    get(url: string, token?: string, data?: object) : Observable<ApiResponse> {
        var req = this.prepareRequest(url, token, data);
        if (this.DEV) console.log('[Api.Service]: get(): ', req);
        return this.http.get<ApiResponse>(req.url, req.httpOptions);
    }

    post(url: string, token?: string, data?: object) : Observable<ApiResponse> {
        var req = this.prepareRequest(url, token, data);
        if (this.DEV) console.log('[Api.Service]: post(): ', req);
        return this.http.post<ApiResponse>(req.url, req.body, req.httpOptions);
    }

    put(url: string, token?: string, data?: object) : Observable<ApiResponse> {
        var req = this.prepareRequest(url, token, data);
        if (this.DEV) console.log('[Api.Service]: put(): ', req);
        return this.http.put<ApiResponse>(req.url, req.body, req.httpOptions);
    }

}


