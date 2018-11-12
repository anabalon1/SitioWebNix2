import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LibroDeAgua } from '../_models';

@Injectable()
export class LibroDeAguaService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/libroDeAgua');
    }
    
    getRescates(){
        
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/libroDeAgua/rescates');
    }
    getRangoEdad(){
        
        return this.http.get('http://localhost/slimApiNueva/slimApi/apiCRUD/public/libroDeAgua/rangoedad');
    }
    

    getById(id: number) {
        return this.http.get(`${config.apiUrl}/users/` + id);
    }

    register(libroDeAgua: LibroDeAgua) {
        
        return this.http.post(`http://localhost/slimApiNueva/slimApi/apiCRUD/public/libroDeAgua/nuevo`,libroDeAgua);

    }

    update(libroDeAgua: LibroDeAgua) {
     //   return this.http.put(`${config.apiUrl}/users/` + estado.id, estado);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}