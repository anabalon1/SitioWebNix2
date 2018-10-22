import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { Console } from '@angular/core/src/console';

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

        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario/nuevo`, user);

    }

    update(user: any) {

     //   return this.http.put(`${config.apiUrl}/users/` + user.id, user);

     this.usuario = JSON.parse(user)
     console.log('http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario/modificar/'+this.usuario.id)
    return this.http.post('http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario/modificar/'+this.usuario.id,user)

     this.usuario = JSON.parse(user);
    return this.http.post('http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario/modificar/'+this.usuario.id,user);


        //   return this.http.put(`${config.apiUrl}/users/` + user.id, user);
        this.usuario = JSON.parse(user);
        console.log(user)
        console.log('http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario/modificar/' + this.usuario.id)
        return this.http.post('http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario/modificar/' + this.usuario.id, user);
    }

    updatePwd(pwdActual:string,newPwd: string , id:number){
        var passwords = 
                     {
                         "password": pwdActual,
                         "nuevoPass": newPwd
                     };
        return this.http.post('http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario/cambiarPassword/'+id,passwords);

    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}