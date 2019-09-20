import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SolicitudService } from '../../../_services/lab/solicitud.service';
import { RecipienteService } from '../../../_services/lab/recipiente.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { WfEstadoService } from '../../../_services/lab/wfestado.service';
import Swal from 'sweetalert2';
export interface wfe { formawfe: string }
export interface intrecipiente { articulo: string, descripcion: string};

@Component({
  selector: 'app-select-recip',
  templateUrl: './select.recip.component.html',
  providers:[SolicitudService,RecipienteService,WfEstadoService]
})

export class SelectRecipComponent implements OnInit {
  public title: string;
  public mkid:  string;
  public solicitud: any[];
  public solicitudD: any[];
  public agregados: any[];
  public artfiltro: any[];
  public recipientelst: any[];
  public formarecip: FormGroup;
  public formafinal: FormGroup; 
  public objrecipiente:intrecipiente;
  public indice: number;
  public cant: number;
  public newcant: number;
  public recipienteresp: any;
  public recipientemov: any;
  public folioInv: any[];
  public mkbcid: string;
  public objwfe: wfe= {formawfe:"Cap. Resultasdos"}

  constructor(
    private _rutaActiva: ActivatedRoute,
    private _solicitudService:SolicitudService,
    private _recipienteService:RecipienteService,
    private _fb: FormBuilder,
    private _wfEstadoService:WfEstadoService,
  ) { 
    this.title="Consumo de Materiales";
    this.solicitud=[];;
    this.solicitudD=[];
    this.agregados=[];
    this.recipientelst=[];
    this.indice=0;
    this.folioInv=[];

  }

  ngOnInit() {
    this.mkid = this._rutaActiva.snapshot.params._key;
    this.getsolicitud();
    this.getsolicitudD();
    this.getrecipiente();
    this.createFormRecipiente();
    this.getrecipientemov();
    
  }

  mk_wfEstado(){
    this._wfEstadoService.wfestado_edit(this.objwfe,this.mkbcid).subscribe(
      response => {
        if (response.wfestado) {
          console.log(response.wfestado);
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var mkerrores =JSON.parse(error._body);
          Swal.fire('MerQry', mkerrores.message, 'error');
        }
      })
  }

  mkgenerarinv(){
    if (this.agregados.length==0){
      Swal.fire('MerQry','Debe agregar un recipiente','error');
    } else {
      this.formafinal = this._fb.group({     
        ventaID  : [{value: ''}, Validators.required],
        empresa : [{value: ''}, Validators.required],
        mov : [{value: ''}, Validators.required], 
        sucursal : [{value: ''}, Validators.required],      
        usuario : [{value: ''}, Validators.required], 
        moneda : [{value: ''}, Validators.required], 
        tipoCambio : [{value: ''}, Validators.required], 
        estatus : [{value: ''}, Validators.required], 
        referencia: [{value: ''}, Validators.required], 
        observaciones : [{value: ''}, Validators.required], 
        almacen: [{value: ''}, Validators.required], 
        embarcar: [{value: ''}, Validators.required],
        detalle : [],
      });

      this.formafinal.reset();
      this.formafinal.controls['ventaID'].setValue(this.mkid);
      this.formafinal.controls['empresa'].setValue('1');
      this.formafinal.controls['mov'].setValue('Salida');
      this.formafinal.controls['sucursal'].setValue('1');
      this.formafinal.controls['usuario'].setValue('1');
      this.formafinal.controls['moneda'].setValue('Pesos');
      this.formafinal.controls['tipoCambio'].setValue('1');
      this.formafinal.controls['referencia'].setValue('Nota '+this.solicitud[0].Folio);
      this.formafinal.controls['observaciones'].setValue('Nota '+this.solicitud[0].Folio);
      this.formafinal.controls['almacen'].setValue('ALM-G');
      this.formafinal.controls['embarcar'].setValue('0');
      this.formafinal.controls['detalle'].setValue(this.agregados);

      this._recipienteService.recipiente_newmov(this.formafinal.value).subscribe(
        response => {
          if (response.movsalida){            
            this.recipienteresp = response.movsalida;  
            if (this.recipienteresp.search("Tipo, Descripcion ,") == -1){
              Swal.fire('MerQry',this.recipienteresp,'error');              
            } else {
              Swal.fire('MerQry','El movimiento se genero correctamente','success');  
              this.mk_wfEstado();
              this.ngOnInit();
              this.agregados=[];
            }
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
  
public createFormRecipiente() {
    this.formarecip = this._fb.group({
      recipiente : [{value: ''}, Validators.required],
    });
    this.formarecip.reset();
    this.formarecip.controls['recipiente'].setValue('');
  }  

  arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}


  mkagregar(){    
    if (this.formarecip.value.recipiente==""){
      Swal.fire('MerQry','Debe seleccionar un recipiente','error');
    } else {
      this.indice = this.arrayObjectIndexOf(this.agregados, this.formarecip.value.recipiente, "Articulo" );
      console.log(this.indice);

      if (this.indice >= 0) {

        this.cant=this.agregados[this.indice].MKCantidad
        this.cant=this.cant+1;
        this.agregados[this.indice].MKCantidad=this.cant;
        
      } else {    
        this.artfiltro= this.recipientelst.filter( rec => rec.Articulo == this.formarecip.value.recipiente);
        
        this.agregados.push(this.artfiltro[0]);
        this.formarecip.reset();
        this.formarecip.controls['recipiente'].setValue('');
      }
    }
  }

  mk_quitar(i){
    this.agregados.splice(i, 1);     
  }

  getsolicitud(){
      this._solicitudService.solicitud_uno(this.mkid).subscribe(
        response => {
          if (response.solicitud) {
            this.solicitud = response.solicitud;
            this.mkbcid=this.solicitud[0].BancoID;
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

  getsolicitudD(){
    this._solicitudService.solicitud_unod(this.mkid).subscribe(
      response => {
        if (response.solicitudd) {
          this.solicitudD = response.solicitudd;
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

  getrecipiente() {
    this._recipienteService.recipiente_list().subscribe(
      response => {
        if (response.recipientes) {
          this.recipientelst = response.recipientes;
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

  getrecipientemov() {
    this._recipienteService.recipiente_mov(this.mkid).subscribe(
      response => {
        if (response.recipientesmov) {
          this.recipientemov = response.recipientesmov;
          console.log(this.recipientemov);
          
            const map = new Map();
            for (const item of this.recipientemov) {
                if(!map.has(item.Folio)){
                    map.set(item.Folio, true);    // set any value to Map
                    this.folioInv.push({
                        Folio: item.Folio,
                        Mov: item.Movimiento
                    });
                }
            }
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
