import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SolicitudService } from './../../_services/lab/solicitud.service';
import { DatePipe } from '@angular/common';
import { Cfg } from '../../_config/gral.config';
import { WfEstadoService } from '../../_services/lab/wfestado.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
export interface wfe {formawfe: string}

declare var $:any;

@Component({
  selector: 'app-comprobante',
  templateUrl: './comprobante.component.html',
  providers:[SolicitudService,WfEstadoService]
})
export class ComprobanteComponent implements OnInit {
public mkid:  string;
public mkbcid:  string;
public folio:  string;
public solicitud: any;
public solicitudD: any;
public formatoFecha: string;
public formawfe: FormGroup;
public wfestado: any;
public impreso: boolean;
public objwfe: wfe= {formawfe:"Imp. Etiquetas"};


  constructor(
    private _rutaActiva: ActivatedRoute,
    private _solicitudService: SolicitudService,
    private _wfEstadoService:WfEstadoService,
    private _fb: FormBuilder,
    private datePipe: DatePipe,
  ) { 
    this.formatoFecha = Cfg.formatoFecha;
    this.impreso=false;


  }

  ngOnInit() {
    this.mkid = this._rutaActiva.snapshot.params.id;
    this.getsolicitudD();
    this.getsolicitud();
  }

mk_imprimir(){
    window.print()
    this.mk_wfEstado();
    this.ngOnInit(); 
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


getsolicitud(){
    this._solicitudService.solicitud_uno(this.mkid).subscribe(
      response => {
        if (response.solicitud) {
          this.solicitud = response.solicitud;
          this.folio=this.solicitud[0].folio;
          this.mkbcid=this.solicitud[0].BancoID;
          this.wfestado=this.solicitud[0].WFEstado
          if (this.wfestado=='Comprobante'){
            this.impreso=true;
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

getsolicitudD(){
  this._solicitudService.solicitud_unod(this.mkid).subscribe(
    response => {
      if (response.solicitudd) {
        this.solicitudD = response.solicitudd;
        console.log(this.solicitudD)
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
