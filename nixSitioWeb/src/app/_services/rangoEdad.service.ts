import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RangoEdad } from '../_models';

@Injectable()
export class RangoEdadService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/rangoEdad');
    }

    getById(id: number) {
        return this.http.get(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/rangoEdad/` + id);
    }

    register(rangoEdad: RangoEdad) {
        
        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/rangoEdad/nuevo`,rangoEdad);

    }


    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}