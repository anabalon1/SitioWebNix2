import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { TipoRescateService, PuestoService, ZonaIntervencionService, RangoEdadService, LibroDeAguaService, AlertService,ClimaService , ProcedenciaService,RescateAvanzadoService } from '../_services';



@Component({ 
    templateUrl: 'libroDeAgua.component.html' ,
    styleUrls: ['./libroDeAgua.component.css']
})
export class LibroDeAguaComponent implements OnInit {
    currentUser: any;
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    puestos: any;
    tipoRescates: any;
    zonaIntervenciones: any;
    rangoEdades: any;
    mostrar: boolean;
    datos: any;
    procedencias: any;
    opciones = true;
    rescateAvanzado:any;
    idAvanzado :any;
    registroLibro:any;
    clima:any;
    localidad:any;
    infoClima:any



    constructor(
        private formBuilder: FormBuilder,
        private puestoService: PuestoService,
        private tipoRescateService: TipoRescateService,
        private zonaIntervencion: ZonaIntervencionService,
        private rangoEdad: RangoEdadService,
        private libroDeAgua: LibroDeAguaService,
        private alertService: AlertService,
        private procedenciaService: ProcedenciaService,
        private rescateAvanzadoService: RescateAvanzadoService,
        private climaService:ClimaService ) { 
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        }

    ngOnInit() {
        this.loadAllPuestos();
        this.loadAllTipoRescate();
        this.loadAllZonaIntervencion();
        this.loadAllRangoEdad();
        this.loadAllProcedencia();
        this.loadAllRescateAvanzado();
        this.getClima()
        
        
        this.registerForm = this.formBuilder.group({
            dia: ['', Validators.required],
            idPuesto: ['', Validators.required],
            horaRescate: ['', Validators.required],
            idTipoRescate: ['', Validators.required],
            primerosAuxilios: ['', Validators.required],
            idZonaIntervencion: ['', Validators.required],
            idRangoEdad: ['', Validators.required],
            observaciones: ['', Validators.required],
            idProcedencia: ['', Validators.required],
            rcp: [false, Validators.required],
            derivacion: [false, Validators.required],
            traumatismo: [false, Validators.required],

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
    private loadAllRescateAvanzado() {
        this.rescateAvanzadoService.getAll().pipe(first()).subscribe(rescatesAvanzado => {   
            this.rescateAvanzado = rescatesAvanzado;
        });
    }
    private getClima(){
        this.puestoService.getLocalidad(this.currentUser.user.idPuesto).pipe(first()).subscribe(localidad => {
            this.localidad = localidad["localidad"]
        this.climaService.getClima(this.localidad).pipe(first()).subscribe(clima =>{
            this.clima = clima["weather"][0].description
            console.log(this.clima)
        });
        });
    }

    activarInput(): void {
        this.mostrar = true;
    }
    activarOpciones(): void {
        console.log("prueba");
        if(this.registerForm.value.idTipoRescate == 4){
            this.opciones = true;
        }
    }
    


    onSubmit() {
        this.idAvanzado = null
        if((this.registerForm.value.traumatismo)&&(this.registerForm.value.rcp)&&(this.registerForm.value.derivacion)){
            this.idAvanzado = this.rescateAvanzado[0].id
        }
        if((this.registerForm.value.rcp)&&(this.registerForm.value.derivacion)&&(this.registerForm.value.traumatismo == false)){
            this.idAvanzado = this.rescateAvanzado[1].id
        }
        if((this.registerForm.value.traumatismo)&&(this.registerForm.value.derivacion)&&(this.registerForm.value.rcp == false)){
            this.idAvanzado = this.rescateAvanzado[2].id
        }
        console.log(this.currentUser)
        
        this.registroLibro ={
            "idUsuario":this.currentUser.user.id,
            "dia":this.registerForm.value.dia,
            "idPuesto":this.registerForm.value.idPuesto,
            "horaRescate":this.registerForm.value.horaRescate,
            "clima":this.clima,
            "idTipoRescate":this.registerForm.value.idTipoRescate,
            "primerosAuxilios":this.registerForm.value.primerosAuxilios,
            "idZonaIntervencion":this.registerForm.value.idZonaIntervencion,
            "idRangoEdad":this.registerForm.value.idRangoEdad,
            "observaciones":this.registerForm.value.observaciones,
            "idProcedencia":this.registerForm.value.idProcedencia,
            "idRescateAvanzado":this.idAvanzado,
        } 
        console.log(this.registroLibro)

      
        //libro
        this.libroDeAgua.register(this.registroLibro)
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