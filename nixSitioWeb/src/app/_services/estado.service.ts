import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Estado } from '../_models';

@Injectable()
export class EstadoService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/estado');
    }

    getById(id: number) {
        return this.http.get(`${config.apiUrl}/users/` + id);
    }

    register(estado: Estado) {
        
        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/estado/nuevo`,estado);

    }

    update(estado: Estado) {
     //   return this.http.put(`${config.apiUrl}/users/` + estado.id, estado);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}