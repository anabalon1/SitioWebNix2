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
    pwdActual: string;
    newPwd: string;


    constructor(private userService: UserService ,private formBuilder: FormBuilder,) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
         this.registerForm = this.formBuilder.group({
            modificarNombre: '' ,
            modificarApellido: '',
            //subirImg: [''] });
    //}
            pwdActual:'',
            newPassword:''


        });
    }


    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => { 
            this.loadAllUsers() 
        });
    }
    
    subirImagen(img : File) {
        this.userService.subirImg(img).pipe(first()).subscribe(imagen => { 
            console.log(imagen); 
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
             console.log("contenido Apellido")
             this.currentUser.user.apellido = this.registerForm.value.modificarApellido
             this.update = JSON.stringify(this.currentUser.user)
             this.userService.update(this.update)
             
         }
         
         if (this.registerForm.value.modificarNombre != ""){
            console.log("contenido Apellido")
             this.currentUser.user.nombre = this.registerForm.value.modificarNombre
             this.update = JSON.stringify(this.currentUser.user)
             this.userService.update(this.update)
         }

         if(this.registerForm.value.pwdActual != ""){
            this.pwdActual = this.registerForm.value.pwdActual
            this.newPwd = this.registerForm.value.newPassword
            this.userService.updatePwd(this.pwdActual,this.newPwd)

         }

         
        
        
        //console.log(this.subirImagen(this.registerForm.value))
       /* this.subirImagen(this.registerForm.value).pipe(first())
        .subscribe(
            img => {
            
                console.log(this.registerForm.value);
                
            });
*/
    }
    
}