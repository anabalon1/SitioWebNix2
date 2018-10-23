import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup} from '@angular/forms';
import { User } from '../_models';
import { UserService } from '../_services/user.service';
import { PuestoService } from '../_services/puesto.service';
import { Router } from '@angular/router';
import { DISABLED } from '@angular/forms/src/model';

@Component({templateUrl: 'perfil.component.html'})
export class PerfilComponent implements OnInit {
    registerForm: FormGroup;
    currentUser: any;
    users: any;
    update: any;
    puestos: any;
    pwdActual: string;
    newPwd: string;
    id: number;
    
 
    
    


    constructor(private puestoService: PuestoService ,private userService: UserService ,private formBuilder: FormBuilder,private router: Router) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        if(this.currentUser.user.idRol==1){
            this.loadAllUsers();
        }
        
        this.loadAllPuestos();
         this.registerForm = this.formBuilder.group({
            modificarNombre: '' ,
            modificarApellido: '',
            modificarDni: '',
            modificarPuesto:'',
            //subirImg: [''] });
    //}
            pwdActual:'',
            newPassword:''
            

        });
        //console.log(this.currentUser)
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

    private loadAllPuestos() {
        this.puestoService.getAll().pipe(first()).subscribe(puestos => { 
            this.puestos = puestos; 
        });
    }

    onSubmit() {
         // this.currentUser.user.id
         //this.registerForm.
         //this.userService.update()
         
         if((this.registerForm.value.modificarApellido != "")){
             //console.log("contenido Apellido")
             this.currentUser.user.apellido = this.registerForm.value.modificarApellido
            /* 
            this.update = JSON.stringify(this.currentUser.user)
             console.log(this.update)
             this.userService.update(this.update).subscribe(res => { 
                console.log(res)
            
            */             
         }
       
         if (this.registerForm.value.modificarNombre != ""){
            //console.log("contenido nombre")
             this.currentUser.user.nombre = this.registerForm.value.modificarNombre
             /*this.update = JSON.stringify(this.currentUser.user)
             this.userService.update(this.update)
             */
         }
         
         if (this.registerForm.value.modificarDni != ""){
            //console.log("contenido nombre")
             this.currentUser.user.dni = this.registerForm.value.modificarDni
             /*this.update = JSON.stringify(this.currentUser.user)
             this.userService.update(this.update)
             */
         }
         if (this.registerForm.value.modificarPuesto != ""){
            //console.log(this.registerForm.value.modificarPuesto)
             this.currentUser.user.idPuesto = this.registerForm.value.modificarPuesto
             /*this.update = JSON.stringify(this.currentUser.user)
             this.userService.update(this.update)
             */
         }
         if((this.registerForm.value.modificarNombre == "")&&(this.registerForm.value.modificarApellido == "")&&(this.registerForm.value.modificarDni != "")){

            
         }
         
         this.update = JSON.stringify(this.currentUser.user)
             console.log(this.update)
             this.userService.update(this.update).subscribe(res => { 
               
                console.log(res)
                console.log(this.currentUser)
                this.router.navigate(['/login']);
            });

         if(this.registerForm.value.pwdActual != ""){
            this.pwdActual = this.registerForm.value.pwdActual
            this.newPwd = this.registerForm.value.newPassword
            this.id = this.currentUser.user.id
            this.userService.updatePwd(this.pwdActual,this.newPwd,this.id).subscribe(res => { 
                console.log(res)
                this.router.navigate(['/login']);
            });
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