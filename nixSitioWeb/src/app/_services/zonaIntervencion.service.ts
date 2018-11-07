import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ZonaIntervencion } from '../_models';

@Injectable()
export class ZonaIntervencionService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/zonaIntervencion');
    }

    getById(id: number) {
        return this.http.get(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/zonaIntervencion/` + id);
    }

    register(zonaIntervencion: ZonaIntervencion) {
        
        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/zonaIntervencion/nuevo`,zonaIntervencion);

    }


    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}