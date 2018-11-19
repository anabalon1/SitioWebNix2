import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { url } from 'inspector';


@Injectable()
export class ClimaService {
    constructor(private http: HttpClient) { }

    getClima(ciudad:string) {
        let url ='http://api.openweathermap.org/data/2.5/weather?q='+ciudad+',ar&units=metric&lang=es&APPID=6f56d9b283678db01439855c6a1b8d9c';
        return this.http.get(url);
    }

}