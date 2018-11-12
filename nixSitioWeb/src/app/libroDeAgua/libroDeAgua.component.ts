import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { TipoRescateService, PuestoService, ZonaIntervencionService, RangoEdadService, LibroDeAguaService, AlertService, VictimaService, ProcedenciaService } from '../_services';
import { Victima } from '../_models';


@Component({ 
    templateUrl: 'libroDeAgua.component.html' ,
    styleUrls: ['./libroDeAgua.component.css']
})
export class LibroDeAguaComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    puestos: any;
    tipoRescates: any;
    zonaIntervenciones: any;
    rangoEdades: any;
    mostrar: boolean;
    victima: any;
    datos: any;
    procedencias: any;
    ultimaVictima: any;


    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private puestoService: PuestoService,
        private tipoRescateService: TipoRescateService,
        private zonaIntervencion: ZonaIntervencionService,
        private rangoEdad: RangoEdadService,
        private libroDeAgua: LibroDeAguaService,
        private alertService: AlertService,
        private victimaService: VictimaService,
        private procedenciaService: ProcedenciaService) { }

    ngOnInit() {
        this.loadAllPuestos();
        this.loadAllTipoRescate();
        this.loadAllZonaIntervencion();
        this.loadAllRangoEdad();
        this.loadAllProcedencia();
        this.registerForm = this.formBuilder.group({
            dia: ['', Validators.required],
            idPuesto: ['', Validators.required],
            horaRescate: ['', Validators.required],
            clima: ['', Validators.required],
            idTipoRescate: ['', Validators.required],
            primerosAuxilios: ['', Validators.required],
            idZonaIntervencion: ['', Validators.required],
            idRangoEdad: ['', Validators.required],
            observaciones: ['', Validators.required],
            idProcedencia: ['', Validators.required],

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
    private loadAllZonaIntervencion() {
        this.zonaIntervencion.getAll().pipe(first()).subscribe(zonaIntervenciones => {
            this.zonaIntervenciones = zonaIntervenciones;
        });
    }
    private loadAllRangoEdad() {
        this.rangoEdad.getAll().pipe(first()).subscribe(rangoEdades => {
            this.rangoEdades = rangoEdades;
        });
    }
    private loadAllProcedencia() {
        this.procedenciaService.getAll().pipe(first()).subscribe(procedencias => {
            this.procedencias = procedencias;
        });
    }

    activarInput(): void {
        this.mostrar = true;
    }


    onSubmit() {
        console.log(this.registerForm.value);
        //libro
        this.libroDeAgua.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registro exitoso', true);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

}