import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from './../../_services/script-loader.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Cfg } from './../../_config/gral.config';
import { FormaPagCobService } from './../../_services/lab/formapagcob.service';
import { SolicitudService } from './../../_services/lab/solicitud.service';
import { MonedaService } from './../../_services/lab/moneda.service';

import Swal from 'sweetalert2';
export interface Iart { articulo: string, descripcion: string};

declare var $:any;

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  providers: [ ScriptLoaderService, FormaPagCobService, SolicitudService, MonedaService]
})
export class PagoComponent implements OnInit, AfterViewInit {
  public info: any;
  title: string;
  cambio: string;
  doc: any;
  solrespuesta: any;
  login: any;

  paciente: any;
  notaimporte: number;
  notadescuento: number;
  notadescuentoimp: number;


  notasubtotal: number;
  notaimpuesto: number;
  notatotal: number;

  total: number;
  anticipo: number;
  resta: number;

  totaldolares: number;
  anticipodolares: number;
  restadolares: number;

  tipo: string;
  detallepago: any[];
  detalle: any[];
  artdetalle: any[];
  totalDescuentopct: number;
  
  formapagcoblst: any[];
  formatoFecha: string;
  hoy = new Date();
  tipocambio: number;
  tipocambiores: any;
  formartdetalles: FormGroup;
  formasolicitud: FormGroup;
  formapago: FormGroup;
  formpaso:FormGroup;

  formobservaciones:FormGroup;
  importDolar: number;
  newimporte: number;
  totalDescuento:number;
  
  constructor(
    private _script: ScriptLoaderService,
    private _fb: FormBuilder,
    private _monedaService:MonedaService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _formaPagCobService: FormaPagCobService,
    private _solicitudService: SolicitudService
  ) {
    this.title = 'Pago de Solciitud de Servicio';
    this.detallepago = [];
    this.detalle = [];
    this.artdetalle = [];
 
    this.notaimporte=0;
  this.notadescuento=0;
  this.notadescuentoimp=0;
  this.notasubtotal=0;
  this.notaimpuesto=0;
  this.notatotal=0;
    this.total = 0;
    this.anticipo = 0;
    this.resta = 0;
    this.totaldolares = 0;
    this.anticipodolares = 0;
    this.restadolares = 0;
    this.formatoFecha = Cfg.formatoFecha;
   }

  ngOnInit() {
    this.info = JSON.parse(localStorage.getItem("solicitud"));
    console.log(this.info);
    this.createFormPago();
    this.getformaspagcob();  
    this.createformartdetalle();
    this.createformpaso();
    this.createformobsv();

    this.artdetalle=this.info.articulos;    
    
    this.artdetalle.forEach(resulta => {
      this.formpaso.controls['Articulo'].setValue(resulta.Articulo);
      this.formpaso.controls['Descripcion'].setValue(resulta.Descripcion);
      this.formpaso.controls['MKCantidad'].setValue(resulta.MKCantidad);
      this.formpaso.controls['PrecioBruto'].setValue(resulta.PrecioBruto);
      this.formpaso.controls['PrecioNeto'].setValue(resulta.PrecioNeto);
      this.formpaso.controls['pxcNeto'].setValue(resulta.pxcNeto);
      this.formpaso.controls['Impuesto1'].setValue(resulta.Impuesto1);
      this.formpaso.controls['MKDescuento'].setValue(resulta.MKDescuento);
      this.detalle.push(this.formpaso.value);
      //console.log(resulta.Articulo);
      //console.log(resulta.MKCantidad);
      //console.log(resulta.PrecioNeto);
      //console.log(resulta.Impuesto1);
      //console.log(resulta.MKDescuento);

    })

    let mkresControl = <FormArray>this.formartdetalles.controls.mkarticulos;
    //let mkresControl = <FormArray>this.formres.controls.mkres;
    this.detalle.forEach(resulta => {
      //console.log(resulta);
      mkresControl.push(this._fb.group(resulta))
    })
    mkresControl.removeAt( 0 );
    //console.log(mkresControl);
    //console.log(this.info.tipoCambioDolar);

    this.notaimporte = this.formartdetalles.value.mkarticulos.reduce((sum, value) =>
    (typeof value.MKCantidad === 'number' ? sum + (value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0))  : sum), 0);
    
    this.notadescuento=this.formobservaciones.value.descuentopct;


    this.notadescuentoimp=this.notaimporte*(this.notadescuento/100.0);
    this.notasubtotal=this.notaimporte-this.notadescuentoimp;
    this.notaimpuesto=this.notasubtotal*(8/100.0);
    //this.notaimpuesto = this.formartdetalles.value.mkarticulos.reduce((sum, value) =>
    //(typeof value.MKCantidad === 'number' ? sum + 
    //( (((value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0)))*(value.Impuesto1/100.00)) )  : sum), 0);

    //this.notatotal =  this.formartdetalles.value.mkarticulos.reduce((sum, value) => 
    //(typeof value.MKCantidad === 'number' ? sum + ((value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0)))+(((value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0)))*(value.Impuesto1/100.00)) : sum), 0);
   
    this.notatotal = this.notasubtotal+this.notaimpuesto;    



    this.total = this.notatotal;
    this.resta = this.notatotal;
    this.totaldolares = this.notatotal/this.info.tipoCambioDolar;
    this.restadolares = this.resta/this.info.tipoCambioDolar;
    this.tipocambiores = this.info.tipoCambioDolar;
    this.tipocambio=this.info.tipoCambioDolar; 
    this.formControlValueChanged();
    this.formobserChanged();
  }



  formobserChanged() {
      this.formobservaciones.get('descuentopct').valueChanges.subscribe(
        (mode: string) => {

          this.notaimporte = this.formartdetalles.value.mkarticulos.reduce((sum, value) =>
          (typeof value.MKCantidad === 'number' ? sum + (value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0))  : sum), 0);
          
          this.notadescuento=this.formobservaciones.value.descuentopct;
  
  
          this.notadescuentoimp=this.notaimporte*(this.notadescuento/100.0);
          this.notasubtotal=this.notaimporte-this.notadescuentoimp;
  
          if (this.notadescuento>0) {
            this.notaimpuesto=this.notasubtotal*(8/100.0);
          } else {
            this.notaimpuesto = this.formartdetalles.value.mkarticulos.reduce((sum, value) =>
            (typeof value.MKCantidad === 'number' ? sum + 
            ( (((value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento)/100.0)))*(value.Impuesto1/100.00)) )  : sum), 0); 
          }
          
          //this.notaimpuesto = this.formartdetalles.value.mkarticulos.reduce((sum, value) =>
          //(typeof value.MKCantidad === 'number' ? sum + 
          //( (((value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0)))*(value.Impuesto1/100.00)) )  : sum), 0);
   
          //this.notatotal =  this.formartdetalles.value.mkarticulos.reduce((sum, value) => 
          //(typeof value.MKCantidad === 'number' ? sum + ((value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0)))+(((value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0)))*(value.Impuesto1/100.00)) : sum), 0);
         
          this.notatotal = this.notasubtotal+this.notaimpuesto;    
          this.anticipo = this.detallepago.reduce((sum, value) => (typeof value.importe == "number" ? sum + value.importe : sum), 0);
          this.anticipodolares= this.anticipo/this.tipocambio;
          this.resta = this.notatotal - this.anticipo;
          this.restadolares = ( this.notatotal- this.anticipo)/this.tipocambio;   
  
          });
    }


  formControlValueChanged() {
    this.formartdetalles.get('mkarticulos').valueChanges.subscribe(
      (mode: string) => {
        
        this.notaimporte = this.formartdetalles.value.mkarticulos.reduce((sum, value) =>
        (typeof value.MKCantidad === 'number' ? sum + (value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0))  : sum), 0);
        
        this.notadescuento=this.formobservaciones.value.descuentopct;


        this.notadescuentoimp=this.notaimporte*(this.notadescuento/100.0);
        this.notasubtotal=this.notaimporte-this.notadescuentoimp;

        if (this.notadescuento > 0) {
          this.notaimpuesto=this.notasubtotal*(8/100.0);
        } else {
          this.notaimpuesto = this.formartdetalles.value.mkarticulos.reduce((sum, value) =>
          (typeof value.MKCantidad === 'number' ? sum + 
          ( (((value.PrecioBruto * value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*(value.MKDescuento/100.0)))*(value.Impuesto1/100.00)) )  : sum), 0); 
        }
        
        //this.notaimpuesto = this.formartdetalles.value.mkarticulos.reduce((sum, value) =>
        //(typeof value.MKCantidad === 'number' ? sum + 
        //( (((value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0)))*(value.Impuesto1/100.00)) )  : sum), 0);
 
        //this.notatotal =  this.formartdetalles.value.mkarticulos.reduce((sum, value) => 
        //(typeof value.MKCantidad === 'number' ? sum + ((value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0)))+(((value.PrecioBruto*value.MKCantidad)-((value.PrecioBruto*value.MKCantidad)*((value.MKDescuento )/100.0)))*(value.Impuesto1/100.00)) : sum), 0);
       
        this.notatotal = this.notasubtotal+this.notaimpuesto;      
        this.anticipo = this.detallepago.reduce((sum, value) => (typeof value.importe == "number" ? sum + value.importe : sum), 0);
        this.anticipodolares= this.anticipo/this.tipocambio;
        this.resta = this.notatotal - this.anticipo;
        this.restadolares = ( this.notatotal- this.anticipo)/this.tipocambio;

      });
  }

 

  createformobsv() {
    this.formobservaciones = this._fb.group({
      observaciones : [{value: ''}, Validators.required] ,
      descuentodesc : [{value: ''}, Validators.required],
      descuentopct : [{value: ''}, Validators.required],
      descuentobase : [{value: ''}, Validators.required],
      descuentoimp : [{value: ''}, Validators.required],  


    });
    this.formobservaciones.reset();
    this.formobservaciones.controls['observaciones'].setValue('');
    this.formobservaciones.controls['descuentodesc'].setValue('0');   
    this.formobservaciones.controls['descuentopct'].setValue('0');  
    this.formobservaciones.controls['descuentobase'].setValue('0');  
    this.formobservaciones.controls['descuentoimp'].setValue('0');  

    }



  createformpaso() {
    this.formpaso = this._fb.group({
      Articulo : [{value: ''}, Validators.required],
      Descripcion : [{value: ''}, Validators.required],
      MKCantidad : [{value: ''}, Validators.required],
      PrecioBruto : [{value: ''}, Validators.required],
      PrecioNeto : [{value: ''}, Validators.required],
      pxcNeto : [{value: ''}, Validators.required],
      Impuesto1 : [{value: ''}, Validators.required],
      MKDescuento : [{value: ''}, Validators.required],    
    });
  }
  getartdetalleUnit() {
    return this._fb.group({
      Articulo : [{value: ''}, Validators.required],
      Descripcion : [{value: ''}, Validators.required],
      MKCantidad : [{value: ''}, Validators.required],
      PrecioBruto : [{value: ''}, Validators.required],
      PrecioNeto : [{value: ''}, Validators.required],
      pxcNeto : [{value: ''}, Validators.required],
      Impuesto1 : [{value: ''}, Validators.required],
      MKDescuento : [{value: ''}, Validators.required],    
    });
  }
        
  
  createformartdetalle(){
    this.formartdetalles = this._fb.group({
      mkarticulos: this._fb.array([
        this.getartdetalleUnit()
      ])
    });
    this.formartdetalles.reset();
    }

   getartdetalle() {
    return (this.formartdetalles.get('mkarticulos') as FormArray).controls;
  }






  ngAfterViewInit() {}

  public createFormPago() {
    this.formapago = this._fb.group({
      formapago : [{value: ''}, Validators.required],
      importe : [{value: ''}, Validators.required],
      importedolar : [{value: ''}, Validators.required],
      tipocambio : [{value: ''}, Validators.required],
      referencia : [{value: ''}, Validators.required],
    });
    this.formapago.reset();
    this.formapago.controls['formapago'].setValue('');
    this.formapago.controls['importe'].setValue('');
    this.formapago.controls['importedolar'].setValue('');
    this.formapago.controls['tipocambio'].setValue('');
    this.formapago.controls['referencia'].setValue('');
  }


  public createFormfinal() {
    this.formasolicitud = this._fb.group({
      folionew : [{value: ''}, Validators.required],
      concepto : [{value: ''}, Validators.required],

      descuentodesc : [{value: ''}, Validators.required],
      descuentopct : [{value: ''}, Validators.required],
      descuentobase : [{value: ''}, Validators.required],
      descuentoimp : [{value: ''}, Validators.required],  

      observaciones:[{value:''},Validators.required],
      paciente : [{value: ''}, Validators.required],
      referencia : [{value: ''}, Validators.required],
      doctor : [{value: ''}, Validators.required],
      almacen : [{value: ''}, Validators.required],
      importe : [{value: ''}, Validators.required],
      impuesto : [{value: ''}, Validators.required],
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
      detalle: [],
      pago : [],
    });

  }


  mk_generarmov(){
  if ( this.detallepago.length === 0 ) {
    Swal.fire('MerQry','debe agregar una forma de pago ', 'error');
  //} else if  (  this.resta > 0 ) {
    //Swal.fire('MerQry','Para el saldo debe seleccionar la forma de pago Credito', 'error');
  } else {

    this.login=JSON.parse(localStorage.getItem("login"));
    
    if (this.resta > 0) {
      this.formapago.reset();
      this.formapago.controls['formapago'].setValue('Credito');
      this.formapago.controls['importe'].setValue(this.resta);    
      this.formapago.controls['importedolar'].setValue('0');  
      this.formapago.controls['referencia'].setValue('Saldo Portal');
      this.detallepago.push(this.formapago.value);
    }

    this.createFormfinal();
    this.formasolicitud.reset();

    //console.log(this.info);
    if (this.info.tipoNom == "Empresa/Seguro") {
      this.formasolicitud.controls['paciente'].setValue(this.info.corporativo);
      this.formasolicitud.controls['referencia'].setValue(this.info.pacienteNom);
    } else {
      this.formasolicitud.controls['paciente'].setValue(this.info.paciente);
      this.formasolicitud.controls['referencia'].setValue('personal');
    } 

    this.formasolicitud.controls['folionew'].setValue(this.info.folionew);
    this.formasolicitud.controls['concepto'].setValue(this.info.concepto);
    this.formasolicitud.controls['observaciones'].setValue(this.formobservaciones.get('observaciones').value);

    this.formasolicitud.controls['descuentodesc'].setValue(this.formobservaciones.get('descuentodesc').value);
    this.formasolicitud.controls['descuentopct'].setValue(this.formobservaciones.get('descuentopct').value);
    this.formasolicitud.controls['descuentobase'].setValue(this.formobservaciones.get('descuentobase').value);
    this.formasolicitud.controls['descuentoimp'].setValue(this.notadescuentoimp);


    this.formasolicitud.controls['doctor'].setValue(this.info.doctor);
    this.formasolicitud.controls['almacen'].setValue('ALM-G');
    this.formasolicitud.controls['importe'].setValue(this.notasubtotal);
    this.formasolicitud.controls['impuesto'].setValue(this.notaimpuesto);
    
    this.formasolicitud.controls['moneda'].setValue('Pesos');
    this.formasolicitud.controls['tipocambio'].setValue('1.0');
    this.formasolicitud.controls['listaprecio'].setValue('General');
    this.formasolicitud.controls['empresa'].setValue(this.login.empresa);
    this.formasolicitud.controls['mov'].setValue('Nota');
    this.formasolicitud.controls['estatus'].setValue('SINAPLICAR');
    this.formasolicitud.controls['usuario'].setValue(this.login.usuario);
    this.formasolicitud.controls['sucursal'].setValue(this.login.sucursal);
    this.formasolicitud.controls['detalle'].setValue(this.formartdetalles.get('mkarticulos').value);

    this.formasolicitud.controls['pago'].setValue(this.detallepago);

    this._solicitudService.solicitud_new(this.formasolicitud.value).subscribe(
      response => {
        if (response.solicitud){            
          this.solrespuesta = response.solicitud;  
          //console.log(this.solrespuesta);
          //var n = str.search("W3Schools");
          if (this.solrespuesta.search("Tipo, Descripcion ,") == -1){
            Swal.fire('MerQry',this.solrespuesta,'error');              
          } else {
            Swal.fire('MerQry','La nota se genero correctamente','success');  
            localStorage.removeItem("folio");
            this._router.navigate(['solicitud']);
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


  mk_agregarforma(){

    this.importDolar=this.formapago.value.importe;
    this.newimporte=this.importDolar * this.tipocambio;

    if ( this.formapago.value.formapago == "" || !this.formapago.value.formapago    ) {
			  Swal.fire('MerQry','Debe seleccionar una forma de pago', 'error');	
    } else if ( this.formapago.value.importe == "" || !this.formapago.value.importe ) {
      Swal.fire('MerQry','El Importe debe ser mayor a cero', 'error');	
    } else if ( this.formapago.value.referencia == "" || !this.formapago.value.referencia ) {
      Swal.fire('MerQry','La referencia no debe estar vacia', 'error');	
    }  else {

      if (this.formapago.value.formapago == "Dolares" || this.formapago.value.formapago == "Efectivo" ) {
        this.cambio="Cambio";
      } else {
        this.cambio="Saldo";
      }
      
   if (this.formapago.value.formapago == "Dolares" ) {

      this.formapago.controls['importedolar'].setValue(this.importDolar);
      this.formapago.controls['importe'].setValue(this.newimporte);
      this.formapago.controls['tipocambio'].setValue(this.tipocambio);

   }     

    this.detallepago.push(this.formapago.value); 
    this.anticipo = this.detallepago.reduce((sum, value) => (typeof value.importe == "number" ? sum + value.importe : sum), 0);
    this.anticipodolares= this.anticipo/this.tipocambio;
    this.formapago.reset();
    this.formapago.controls['formapago'].setValue('');
    this.formapago.controls['importe'].setValue('');    
    this.formapago.controls['importedolar'].setValue('');  
    this.formapago.controls['tipocambio'].setValue('');  
    this.formapago.controls['referencia'].setValue('');
    this.resta = this.notatotal - this.anticipo;
    this.restadolares = ( this.notatotal- this.anticipo)/this.tipocambio;
    }
  }
  
  mk_quitar(i){
    this.detallepago.splice(i, 1);    
    this.anticipo = this.detallepago.reduce((sum, value) => (typeof value.importe == "number" ? sum + value.importe : sum), 0);
    this.anticipodolares=this.anticipo/this.tipocambio;
    this.resta = this.notatotal - this.anticipo;
    this.restadolares = (this.notatotal - this.anticipo)/this.tipocambio;
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
}
