import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SolicitudService } from '../../_services/lab/solicitud.service';
import { DatePipe } from '@angular/common';
import { Cfg } from '../../_config/gral.config';
import { WfEstadoService } from '../../_services/lab/wfestado.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { ResultadoService } from '../../_services/lab/resultado.service';
import { HTMLfuctions } from '../../_functions/html.fuctions'
import { LinkService } from '../../_services/login/link.service';
export interface wfe {formawfe: string}


declare var $:any;

@Component({
  selector: 'app-impresultado',
  templateUrl: './impresultado.component.html',
  providers:[SolicitudService,WfEstadoService,ResultadoService,LinkService]
})
export class ImpResultadoComponent implements OnInit {
public mkid:  string;
public mkbcid:  string;

public solicitud: any;
public solicitudD: any;
public formatoFecha: string;
public formawfe: FormGroup;
public wfestado: any;
public resultadolst: any;
public resultadoClst: any[];
public impreso: boolean;
public objwfe: wfe= {formawfe:"Archivar"};

public folio :string;
public clavep :string;
public fecha :string;
public sexo :string;
public edad :string;
public servicio :string;
public paciente :string;
public doctor :string;
public examenes :string;
public qfb_nombre: string;
public qbp_nombre: string;
public link: any;
public linkd: any;


  constructor(
    private _rutaActiva: ActivatedRoute,
    private _solicitudService: SolicitudService,
    private _wfEstadoService:WfEstadoService,
    private _fb: FormBuilder,
    private _resultadoService:ResultadoService,
    private _router:Router,
    private datePipe: DatePipe,
    private _linkService:LinkService,
  ) { 
    this.formatoFecha = Cfg.formatoFecha;
    this.impreso=false;
    this.resultadoClst=[];


  }

  ngOnInit() {
    this.mkid = this._rutaActiva.snapshot.params.id;
    this.getsolicitud();
    this.getsolicitudD();
    this.getresultado();
    //this.getlink();
    //this.getlinkd();
  }

mk_imprimir(){
    window.print()
    this.mk_wfEstado();
    this.ngOnInit(); 
    
}


getlink(){
  this._linkService.link_list(this.mkid).subscribe(
    response => {
      if (response.link) {
        this.link = response.link;
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

getlinkd(){
  this._linkService.link_listd(this.mkid).subscribe(
    response => {
      if (response.link) {
        this.linkd = response.link;
        console.log(this.linkd);
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

mk_wfEstado(){
  this._wfEstadoService.wfestado_edit(this.objwfe,this.mkbcid).subscribe(
    response => {
      if (response.wfestado) {
        //console.log(response.wfestado);
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
          //console.log(this.solicitud);
          this.folio=this.solicitud[0].Folio;
          this.mkbcid=this.solicitud[0].BancoID;
          this.wfestado=this.solicitud[0].WFEstado;        
          this.clavep='????'
          this.fecha= this.solicitud[0].FechaEmision;
          this.sexo =this.solicitud[0].ContactoSexo;
          this.edad = this.solicitud[0].ContactoEdad;
          this.servicio='ORDINARIO';
          this.paciente =this.solicitud[0].ContactoNombre;
          this.doctor=this.solicitud[0].vendedornombre;
          this.examenes ='BH, Hb, PQ25, PQ14, PQ7';
          this.qfb_nombre='Q.F.B. MARIO LEONARDO ESTRADA OCHOA';
          this.qbp_nombre='QBP. GUMERSINDO ORTUÑO GUTIERREZ Q.F';

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
        console.log(this.solicitudD);
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

mk_titulo( valor ){
  return HTMLfuctions.gettituloClass(valor);
}

mk_captura(min,valor,max){
  return HTMLfuctions.getcapturacellClass(min,valor,max); 
}



getresultado(){
  this._resultadoService.resultado_listsp(this.mkid).subscribe(
    response => {
      if (response.resultado) {
        this.resultadolst = response.resultado;
        
        //this.resultadolst.forEach(function(u) {
        for (const u of this.resultadolst) {
         var rango= HTMLfuctions.getcapturacellClass(u.ValorMinimo,u.ValorCapturado,u.ValorMaximo); 
         //console.log(rango);
         if (rango=='cuidado'){
          u.asterisco='*'
         } else {
          u.asterisco=''
         }
         this.resultadoClst.push(u);
        };
        this.resultadoClst.sort((a, b) => Number(a.NewOrder) - Number(b.NewOrder));
       // console.log(this.resultadoClst);
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
