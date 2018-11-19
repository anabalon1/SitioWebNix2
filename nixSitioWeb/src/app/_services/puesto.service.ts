import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Puesto } from '../_models';

@Injectable()
export class PuestoService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/puesto');
    }

    getLocalidad(id:number){
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/puesto/localidad/'+id);
    }

    getById(id: number) {
        return this.http.get(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/puesto/` + id);
    }

    register(puesto: Puesto) {
        
        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/puesto/nuevo`,puesto);

    }

    update(puesto: Puesto) {
     //   return this.http.put(`${config.apiUrl}/users/` + puesto.id, puesto);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}