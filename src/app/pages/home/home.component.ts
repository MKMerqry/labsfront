import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ScriptLoaderService } from '../../_services/script-loader.service';
import { HTMLfuctions } from '../../_functions/HTML.fuctions';
import { SolicitudService } from '../../_services/lab/solicitud.service';
import { ArticuloService } from '../../_services/lab/art.service';
import { BancoService } from '../../_services/lab/banco.service';
import { Cfg } from '../../_config/gral.config';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [SolicitudService,ArticuloService ,BancoService]
})
export class HomeComponent implements OnInit, AfterViewInit {
  public proylst: string[];
  public daslst: any;
  public dasConcluidos: any;
  public dasActivos: any;
  public dasInactivos: any;
  public PieChart: any;
  public MK_labels01: any[] = new Array();
  public MK_data01: any[] = new Array();
  public topics: string[];
  public solicitudlst: string[];
  public artlst: any[];
  public bancolst :any[];
  public fechaformato: string;
  public total: number;
  public saldo: number;
 


  constructor(
    private _script: ScriptLoaderService,
    private _solicitudService: SolicitudService,
    public _articuloService:ArticuloService,
    public _bancoService:BancoService,
    private datePipe: DatePipe,
    
    ) {
      this.fechaformato=Cfg.formatoFecha;
       }

  ngOnInit() {
    console.log('inicio');
    this.getsolicitud();
    this.getart_topten();
    this.topics = ['C', 'C#'];

    //this._script.load('./assets/js/scripts/home.js');
    //this._script.load('./assets/js/scripts/home.js');
  }

  mk_getBottonClass(status){
    return HTMLfuctions.getEstatusClass(status);
  }

  ngAfterViewInit() {
    this._script.load('./assets/js/scripts/dashboard_6.js');
    //this._script.load('./assets/js/scripts/dashboard_6.js', './assets/js/scripts/calendar-demo.js');
    //console.log('fin');
    //console.log(this.nombre); // aparece la propiedad nativeElement y dentro una gran cantidad de propiedades y métodos
    //this.nombre.nativeElement.setAttribute('placeholder', 'Escriba su nombre');
    //this.nombre.nativeElement.addClass('una-clase');
    //this.nombre.nativeElement.focus();
    }


    getart_topten() {
      this._articuloService.art_list2().subscribe(
        response => {
          if (response.articulo) {
            this.artlst = response.articulo;     
            console.log( this.artlst);
            console.log( response.articulo);
          }
        },
        error => {
          var errorMessage = <any>error;
          if (errorMessage != null) {
            var mkerrores =JSON.parse(error._body);
            Swal.fire('MerQry', mkerrores.message, 'error');
          }
        });
    }
    getsolicitud() {
      this._bancoService.banco_list2('1').subscribe(
        response => {
          if (response.banco) {
            this.bancolst = response.banco;

            this.total = this.bancolst.reduce((sum, value) => (typeof value.Importe == "number" ? sum + value.importe : sum), 0);
            this.saldo = this.bancolst.reduce((sum, value) => (typeof value.Saldo == "number" ? sum + value.importe : sum), 0);


            console.log(this.bancolst);
          }
        },
        error => {
          var errorMessage = <any>error;
          if (errorMessage != null) {
            var mkerrores =JSON.parse(error._body);
            Swal.fire('MerQry', mkerrores.message, 'error');
          }
        });
    }
}
