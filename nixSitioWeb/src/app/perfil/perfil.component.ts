import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup} from '@angular/forms';
import { User } from '../_models';
import { UserService } from '../_services';

@Component({templateUrl: 'perfil.component.html'})
export class PerfilComponent implements OnInit {
    registerForm: FormGroup;
    currentUser: User;
    users: any;

    constructor(private userService: UserService ,private formBuilder: FormBuilder,) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
         this.registerForm = this.formBuilder.group({
            modificarNombre: [''] });
    }

    modificarNombre(nombre: string){
        console.log(this.registerForm)
        
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
        
    }
    
}