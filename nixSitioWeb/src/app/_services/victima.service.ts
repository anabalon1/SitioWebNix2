import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Victima } from '../_models';

@Injectable()
export class VictimaService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/victima');
    }

    getUltimo() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/ultimavictima');
    }

    getById(id: number) {
        return this.http.get(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/victima/` + id);
    }

    register(victima: Victima) {
        
        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/victima/nuevo`,victima);

    }


    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}