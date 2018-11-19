import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RescateAvanzado } from '../_models';

@Injectable()
export class RescateAvanzadoService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/rescateAvanzado');
    }

    getById(id: number) {
        return this.http.get(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/rescateAvanzado/` + id);
    }

    register(rescateAvanzado: RescateAvanzado) {
        
        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/rescateAvanzado/nuevo`,rescateAvanzado);

    }


    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}