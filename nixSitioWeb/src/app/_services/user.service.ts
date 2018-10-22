import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';

@Injectable()
export class UserService {
    usuario: any;
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario');
    }
    subirImg(img : File) {
        return this.http.post('http://localhost/slimApiNueva/slimApi/apiCRUD/public/subirImg',img);
    }

    getById(id: number) {
        return this.http.get(`${config.apiUrl}/users/` + id);
    }

    register(user: User) {
        
        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario/nuevo`,user);

    }

    update(user: any) {
     //   return this.http.put(`${config.apiUrl}/users/` + user.id, user);
     this.usuario = JSON.parse(user)
     console.log('http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario/modificar/'+this.usuario.id)
    return this.http.post('http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario/modificar/'+this.usuario.id,user)
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}