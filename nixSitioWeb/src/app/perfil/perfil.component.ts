import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup} from '@angular/forms';
import { User } from '../_models';
import { UserService } from '../_services';

@Component({templateUrl: 'perfil.component.html'})
export class PerfilComponent implements OnInit {
    registerForm: FormGroup;
    currentUser: any;
    users: any;
    update: any;


    constructor(private userService: UserService ,private formBuilder: FormBuilder,) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
         this.registerForm = this.formBuilder.group({
            modificarNombre: [this.currentUser.user.nombre] ,
            modificarApellido: [this.currentUser.user.apellido]

        });
    }


    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => { 
            this.loadAllUsers() 
        });
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => { 
            this.users = users; 
        });
    }
    onSubmit() {
        // this.currentUser.user.id
         //this.registerForm.
         //this.userService.update()
         
         if(this.registerForm.value.modificarApellido != ""){
             this.currentUser.user.apellido = this.registerForm.value.modificarApellido
             this.update = JSON.stringify(this.currentUser.user)
             this.userService.update(this.update)
             
         }
         /*else{
            this.registerForm.value.modificarApellido = this.currentUser.user.apellido
             console.log( this.registerForm.value.modificarApellido)
         }

         if (this.registerForm.value.modificarNombre != ""){
            console.log(this.registerForm.value.modificarNombre)
         }
         else{
            this.registerForm.value.modificarNombre = this.currentUser.user.nombre
             console.log( this.registerForm.value.modificarNombre)
         }*/

         
        
        
    }
    
}