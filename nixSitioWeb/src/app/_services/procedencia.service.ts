import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Procedencia } from '../_models';

@Injectable()
export class ProcedenciaService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/procedencia');
    }

    getById(id: number) {
        return this.http.get(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/procedencia/` + id);
    }

    register(procedencia: Procedencia) {
        
        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/procedencia/nuevo`,procedencia);

    }


    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}