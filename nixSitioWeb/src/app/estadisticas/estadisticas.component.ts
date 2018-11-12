import { Component, OnInit } from '@angular/core';
import { LibroDeAguaService } from '../_services/index'
import { first } from 'rxjs/operators';
import { RangoEdad } from '../_models';


@Component({
  templateUrl: 'estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  public tiporescate: Array<string>;
  public cantidad: any;
  prevencion: number;
  rescateSencillo: number;
  rescateComplicado: number;
  rescateAvanzado: number;
  totalRangoEdad:any;
  label="rangoEdad";
  

  constructor(private libroService: LibroDeAguaService) { }


  ngOnInit() {
    this.rescates();
    console.log(this.cantidad)
  }

//----------Grafico de dona----------//
  public rescates() {
    this.libroService.getRescates().pipe(first()).subscribe(datos => {

      if (datos != null) {
        if (datos[0]) {
          this.prevencion = datos[0].cantidad;
        }
        if (datos[1]) {
          this.rescateSencillo = datos[1].cantidad;
        }
        if (datos[2]) {
          this.rescateComplicado = datos[2].cantidad;
        }
        if (datos[3]) {
          this.rescateAvanzado = datos[3].cantidad;
        }
        this.cantidad = [this.prevencion, this.rescateSencillo, this.rescateComplicado, this.rescateAvanzado];
      }
    });

    this.libroService.getRangoEdad().pipe(first()).subscribe(RangoEdad => {
      console.log("rango")
      console.log(RangoEdad[0].total)
      this.totalRangoEdad = RangoEdad
    });
  }
  // Doughnut
  public doughnutChartLabels: string[] = ['Prevencion', 'Rescate Sencillo', 'Rescate Complicado', 'Rescate Avanzado'];
  //public doughnutChartData:number[] =[30,40,50,60];
  public doughnutChartType: string = 'doughnut';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  //----------Grafico de barras----------//
  


  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['0 a 2', '2 a 6', '6 a 10', '10 a 14', '14 a 17', '17 a 24', '24 a 30','30 a 45','45 a 60','+60'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [28, 48, 40, 19, 86, 27, 90, 23,32,44], label: 'RangoEdad'}
  ];

 
}