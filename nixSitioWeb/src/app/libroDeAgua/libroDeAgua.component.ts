import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { TipoRescateService,PuestoService } from '../_services';


@Component({templateUrl: 'libroDeAgua.component.html'})
export class LibroDeAguaComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    puestos : any;
    tipoRescates : any;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private puestoService: PuestoService,
        private tipoRescateService: TipoRescateService) { }

    ngOnInit() {
        this.loadAllPuestos();
        this.loadAllTipoRescate();
        this.registerForm = this.formBuilder.group({
            fecha: ['', Validators.required],
            puesto: ['', Validators.required],
            hora: ['', Validators.required],
            clima: ['', Validators.required],
            tipoRescate: ['', Validators.required]
        });
       
    }
    private loadAllPuestos() {
        this.puestoService.getAll().pipe(first()).subscribe(puestos => { 
            this.puestos = puestos; 
        });
    }
    private loadAllTipoRescate() {
        this.tipoRescateService.getAll().pipe(first()).subscribe(tipoRescates => { 
            this.tipoRescates = tipoRescates; 
        });
    }

    onSubmit() {}




    
    

   
}