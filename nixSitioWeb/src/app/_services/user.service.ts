import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models';
import { map } from 'rxjs/operators';

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
     //console.log(this.usuario)
     var info  = 
        {
            "nombre": this.usuario.nombre,
            "apellido": this.usuario.apellido,
            "email": this.usuario.email,
            "idRol": this.usuario.idRol,
            "idPuesto": this.usuario.idPuesto,
            "dni": this.usuario.dni
        }
    return this.http.post('http://localhost/slimApiNueva/slimApi/apiCRUD/public/usuario/modificar/'+this.usuario.id,info)
    .pipe(map(res => {
        localStorage.setItem('currentUser.user', JSON.stringify(this.usuario));

        return res;
    }))
    }

    updatePwd(pwdActual:string,newPwd: string , id:number){
        var passwords = 
                     {
                         "password": pwdActual,
                         "nuevoPass": newPwd
                     };
        return this.http.post('http://localhost/slimApiNueva/slimApi/apiCRUD/public/cambiarPassword/'+id,passwords);

    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}