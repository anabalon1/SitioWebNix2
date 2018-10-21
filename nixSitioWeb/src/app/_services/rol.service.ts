import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Rol } from '../_models';

@Injectable()
export class RolService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/rol');
    }

    getById(id: number) {
        return this.http.get(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/rol/` + id);
    }

    register(rol: Rol) {
        
        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/rol/nuevo`,rol);

    }

    update(rol: Rol) {
     //   return this.http.put(`${config.apiUrl}/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}