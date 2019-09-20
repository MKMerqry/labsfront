import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ScriptLoaderService } from '../../_services/script-loader.service';
import { HTMLfuctions } from '../../_functions/HTML.fuctions';
import { SolicitudService } from '../../_services/lab/solicitud.service';
import { BancoService } from '../../_services/lab/banco.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Cfg } from '../../_config/gral.config';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FormaPagCobService } from './../../_services/lab/formapagcob.service';
import { CancelacionService } from './../../_services/lab/cancelacion.service';
import { MonedaService } from './../../_services/lab/moneda.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './solicitudes.component.html',
  providers: [SolicitudService, BancoService, FormaPagCobService,  MonedaService, CancelacionService]
})
export class SolicitudesComponent implements OnInit, AfterViewInit {
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
  public formatofecha: string;
  public title: string;


  total: number;
  anticipo: number;
  resta: number;

  totaldolares: number;
  anticipodolares: number;
  restadolares: number;
  nota: any;
  bancores: any;
  tipo: string;
  detallepago: any[];
  detalle: any[];
  formapagcoblst: any[];
  folio: any;
  hoy = new Date();
  tipocambio: number;
  tipocambiores: any;
  info: any;
  formasolicitud: FormGroup;
  formapago: FormGroup;
 


  constructor(
    private _script: ScriptLoaderService,
    private _solicitudService: SolicitudService,
    private _bancoService: BancoService,
    private datePipe: DatePipe,
    private _formaPagCobService: FormaPagCobService,
    private _monedaService:MonedaService,
    public _cancelacionService:CancelacionService,
    private _fb: FormBuilder,
    private _router:Router,
    
    ) {
      
      this.detallepago = [];
      this.detalle = [];
  
      this.total = 0;
      this.anticipo = 0;
      this.resta = 0;
      this.totaldolares = 0;
      this.anticipodolares = 0;
      this.restadolares = 0;
      this.title="Solicitudes"
      this.formatofecha = Cfg.formatoFecha;

       }

  ngOnInit() {
    this.getsolicitud();
    //this.info = JSON.parse(localStorage.getItem("solicitud"));
    this.topics = ['C', 'C#']; 
    this.gettipocambio('Dolares');
    this.createFormPago();
    this.getformaspagcob();    
    this.detallepago=[];


  }

  mk_iniciarModal(mov){
    this.nota=mov;
    if (this.nota.Estatus=='PENDIENTE'){
      //console.log(this.nota);
      this.detallepago=[];
      this.total = this.nota.Saldo;
      this.resta = this.nota.Saldo;
      this.totaldolares = this.total/18.85;
      this.restadolares = this.resta/18.85;
      this.folio=this.nota.Folio;
      this.formapago.reset();
      this.formapago.controls['formapago'].setValue('Efectivo');
      this.formapago.controls['importe'].setValue(this.nota.Saldo);
      this.formapago.controls['referencia'].setValue(this.nota.Folio);

    } else {
      this.close_modal_formapago();
      Swal.fire('MerQry','esta funcion es solo para las notas pendientes', 'error');

  }
}

  gettipocambio(moneda){
    this._monedaService.moneda_uno(moneda).subscribe(
      response => {
        if (response.moneda){  
          //console.log(response.moneda);          
          this.tipocambiores = response.moneda;
          this.tipocambio=this.tipocambiores[0].TipoCambio;  
          //console.log(this.tipocambiores);
        }          
      },
      error=>{
        var errorMessage =<any>error;
        if (errorMessage != null) {
          var mkerrores =JSON.parse(error._body);
          Swal.fire('MerQry',mkerrores.message + '...', 'error');
        }
      }); 
  }

  public createFormPago() {
    this.formapago = this._fb.group({
      formapago : [{value: ''}, Validators.required],
      importe : [{value: ''}, Validators.required],
      referencia : [{value: ''}, Validators.required],
    });
    this.formapago.reset();
    this.formapago.controls['formapago'].setValue('');
    this.formapago.controls['importe'].setValue('');
    this.formapago.controls['referencia'].setValue('');
  }

  
  mk_agregarforma(){
    if ( this.formapago.value.formapago == "" || !this.formapago.value.formapago    ) {
			  Swal.fire('MerQry','Debe seleccionar una forma de pago', 'error');	
    } else if ( this.formapago.value.importe == "" || !this.formapago.value.importe ) {
      Swal.fire('MerQry','El Importe debe ser mayor a cero', 'error');	
    } else if ( this.formapago.value.referencia == "" || !this.formapago.value.referencia ) {
      Swal.fire('MerQry','La referencia no debe estar vacia', 'error');	
    }  else {
    this.detallepago.push(this.formapago.value); 
    this.anticipo = this.detallepago.reduce((sum, value) => (typeof value.importe == "number" ? sum + value.importe : sum), 0);
    this.anticipodolares= this.anticipo/this.tipocambio;
    this.formapago.reset();
    this.formapago.controls['formapago'].setValue('');
    this.formapago.controls['importe'].setValue('');    
    this.formapago.controls['referencia'].setValue('');
    this.resta = this.total - this.anticipo;
    this.restadolares = (this.total - this.anticipo)/this.tipocambio;
    }
  }

  mk_quitar(i){
    this.detallepago.splice(i, 1);    
    this.anticipo = this.detallepago.reduce((sum, value) => (typeof value.importe == "number" ? sum + value.importe : sum), 0);
    this.anticipodolares=this.anticipo/this.tipocambio;
    this.resta = this.total - this.anticipo;
    this.restadolares = (this.total - this.anticipo)/this.tipocambio;
  }




  mk_savecancelacion(idventa,folio){ 
    console.log(idventa,folio);
    this._cancelacionService.cancelacion_uno(idventa).subscribe(
      response => {
        //console.log(response.articulo);
        if (response.cancelacion) {
          //this.formapagcoblst = response.formapagcob;
          Swal.fire('MerQry','El folio se encuentra disponible',"success");
          localStorage.removeItem("folio");
          localStorage.setItem("folio", folio);
          this._router.navigate(['solicitud/new']);


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


  getformaspagcob(){ 
    this._formaPagCobService.formapagcob_list().subscribe(
      response => {
        //console.log(response.articulo);
        if (response.formapagcob) {
          this.formapagcoblst = response.formapagcob;
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

  mk_getBottonClass(status){
    return HTMLfuctions.getEstatusClass(status);
  }


    ngAfterViewInit() {
}

    getsolicitud() {
      this._bancoService.banco_list('1').subscribe(
        response => {
          if (response.banco) {
            this.solicitudlst = response.banco;

            $( document ).ready(function() {
              $('#dtbl_solicitudes').DataTable({
                  pageLength: 10,
                  fixedHeader: true,
                  responsive: true,
                  "sDom": 'rtip',
                  columnDefs: [{
                      targets: 'no-sort',
                      orderable: false
                  }]
              });
  
              var table = $('#dtbl_solicitudes').DataTable();
              $('#key-search').on('keyup', function() {
                  table
                      .search(this.value)
                      .draw();
              });
  
              $('#type-filter').on('change', function() {
                  table.column(5).search($(this).val()).draw();
              });
          });

            //console.log(this.solicitudlst);
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

    public createFormfinal() {
      this.formasolicitud = this._fb.group({
        paciente : [{value: ''}, Validators.required],
        doctor : [{value: ''}, Validators.required],
        almacen : [{value: ''}, Validators.required],
        importe : [{value: ''}, Validators.required],
        anticipo : [{value: ''}, Validators.required],
        empresa : [{value: ''}, Validators.required],
        sucursal : [{value: ''}, Validators.required],
        usuario : [{value: ''}, Validators.required],
        mov : [{value: ''}, Validators.required],
        estatus : [{value: ''}, Validators.required],
        moneda : [{value: ''}, Validators.required],
        tipocambio : [{value: ''}, Validators.required],
        listaprecio : [{value: ''}, Validators.required],
        ctaBanco : [{value: ''}, Validators.required],
        bancoID : [{value: ''}, Validators.required],
        detalle: [],
        pago : [],
      });
  
    }

    close_modal_formapago() {
      $("#modal_formapago").modal('hide');//ocultamos el modal
      $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
      $('.modal-backdrop').remove();//eliminamos el backdrop del modal
    }

    mk_generarIngreso(){
      //console.log(this.detallepago);
      //console.log(this.detallepago.length);
      if ( this.detallepago.length === 0 ) {
        Swal.fire('MerQry','HRO Debe agregar una forma de pago ', 'error');
      } else if  (  this.resta !== 0 ) {
        Swal.fire('MerQry','El pago no de ser menor ni excederse del pendiente', 'error');
      } else {
    
        this.createFormfinal();
        this.formasolicitud.reset();
        //this.formasolicitud.controls['paciente'].setValue(this.info.paciente);
        //this.formasolicitud.controls['doctor'].setValue(this.info.doctor);
        this.formasolicitud.controls['almacen'].setValue('ALM-G');
        //this.formasolicitud.controls['importe'].setValue(this.info.total);
        this.formasolicitud.controls['moneda'].setValue('Pesos');
        this.formasolicitud.controls['tipocambio'].setValue('1.0');
        this.formasolicitud.controls['listaprecio'].setValue('General');
        this.formasolicitud.controls['empresa'].setValue('1');
        this.formasolicitud.controls['mov'].setValue('Nota');
        this.formasolicitud.controls['estatus'].setValue('SINAPLICAR');
        this.formasolicitud.controls['usuario'].setValue('1');
        this.formasolicitud.controls['sucursal'].setValue('1');
        //this.formasolicitud.controls['detalle'].setValue(this.info.articulos);
        this.formasolicitud.controls['pago'].setValue(this.detallepago);        
        this.formasolicitud.controls['ctaBanco'].setValue('CJ-R01');
        this.formasolicitud.controls['bancoID'].setValue(this.nota.ID);

        this._bancoService.banco_new(this.formasolicitud.value).subscribe(
          response => {
            if (response.banco){            
              this.bancores = response.banco;  
              if (this.bancores.search("Tipo, Descripcion ,") == -1){
                Swal.fire('MerQry',this.bancores,'error');              
              } else {
                this.close_modal_formapago();
                Swal.fire('MerQry','La nota se aplico correctamente','success');  
                this.ngOnInit();
              }
                        
              //this._router.navigate(['/proy/edit/'+this.mkid]);
              //this.ngOnInit();
            }          
          },
          error=>{
            var errorMessage =<any>error;
            if (errorMessage != null) {
              var mkerrores =JSON.parse(error._body);
              Swal.fire('MerQry',mkerrores.message + '...', 'error');
            }
          });   
        } 
      }

}
