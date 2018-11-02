import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TipoRescate } from '../_models';

@Injectable()
export class TipoRescateService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/tipoRescate');
    }

    getById(id: number) {
        return this.http.get(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/tipoRescate/` + id);
    }

    register(tipoRescate: TipoRescate) {
        
        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/tipoRescate/nuevo`,tipoRescate);

    }


    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}