import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

import { AlertService, UserService, RolService, PuestoService } from '../_services';

@Component({
    templateUrl: 'register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    roles : any;
    puestos : any;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private http: HttpClient,
        private rolService: RolService,
        private puestoService: PuestoService) { }

    ngOnInit() {
        this.loadAllRoles();
        this.loadAllPuestos();
        this.registerForm = this.formBuilder.group({
            nombre: ['', Validators.required],
            apellido: ['', Validators.required],
            dni: ['', [Validators.required, Validators.max(70000000)]],
            email: ['', Validators.required,Validators.email],
            pwd: ['', [Validators.required, Validators.minLength(6)]],
            rol: ['', Validators.required],
            puesto: ['', Validators.required]
        });
    }

    private loadAllRoles() {
        this.rolService.getAll().pipe(first()).subscribe(roles => { 
            this.roles = roles; 
        });
    }

    private loadAllPuestos() {
        this.puestoService.getAll().pipe(first()).subscribe(puestos => { 
            this.puestos = puestos; 
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registro exitoso', true);
                    console.log(this.registerForm.value);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
