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
            fecha: ['', Validators.required],
            puesto: ['', Validators.required],
            hora: ['', Validators.required],
            clima: ['', Validators.required],
            tipoRescate: ['', Validators.required],
            primerosAuxilios: ['', Validators.required],
            zonaIntervencion: ['', Validators.required],
            rangoEdad: ['', Validators.required],
            observacion: ['', Validators.required],
            procedencia: ['', Validators.required],

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
        this.datos = this.registerForm.value;
        this.victima = {
            "idRangoEdad": this.datos.rangoEdad,
            "idProcedencia": this.datos.procedencia
        };


        //victima
        this.victimaService.register(this.victima)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registro exitoso', true);
                    this.victimaService.getUltimo().subscribe(ultimaVictima => {
                        this.ultimaVictima = ultimaVictima;
                    });
                    console.log(this.ultimaVictima[0].id);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });

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