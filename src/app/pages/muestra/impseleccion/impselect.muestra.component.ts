import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SolicitudService } from '../../../_services/lab/solicitud.service';
import { MuestraService } from '../../../_services/lab/muestra.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { HTMLfuctions } from '../../../_functions/html.fuctions';
import { Datefuctions } from '../../../_functions/date.function';
import { WfEstadoService } from '../../../_services/lab/wfestado.service';
import Swal from 'sweetalert2';



export interface wfe { formawfe: string }


@Component({
  selector: 'app-impselect-muestra',
  templateUrl: './impselect.muestra.component.html',
  providers: [SolicitudService, MuestraService, WfEstadoService]
})

export class ImpSelectMuestraComponent implements OnInit {
  public title: string;
  mkid: string;
  solicitud: any[];
  solicitudD: any[];
  agregados: any[];
  muestralst: any[];
  newmuestraslst: any[];
  newmuestraslstsinkit: any[];
  newmuestrasEti: any[];
  formamuestra: FormGroup;
  formafinal: FormGroup;
  formawfe: FormGroup;
  indice: number;
  soli: string;
  mkbcid: string;
  paciente: string;
  hoy: Date = new Date();
  edad: number;
  fecha: string;
  hora: string;
  objwfe: wfe = { formawfe: "Consumo Mat." };
  width: string;
  height: string;



  constructor(
    private _rutaActiva: ActivatedRoute,
    private _solicitudService: SolicitudService,
    private _muestraService: MuestraService,
    private _wfEstadoService: WfEstadoService,
    private _fb: FormBuilder,

  ) {
    this.title = "Orden de Trabajo";
    this.solicitud = [];;
    this.solicitudD = [];
    this.agregados = [];
    this.muestralst = [];
    this.newmuestraslst = [];
    this.newmuestraslstsinkit = [];
    this.fecha = Datefuctions.getFechaSinHora(this.hoy);
    this.hora = Datefuctions.getFechaSoloHora(this.hoy);
    this.newmuestrasEti = [];
    this.indice = 0;
    this.width = "2";
    this.height = "45";
  }

  ngOnInit() {
    this.mkid = this._rutaActiva.snapshot.params._key;
    this.getsolicitud()
    //for (var i = 0; i < localStorage.length; i++) 
    //console.log( localStorage.key(i) +" has value " + localStorage[localStorage.key(i)] )
    //localStorage.setItem("recipientes_agregados", JSON.stringify(this.agregados));
    var array = JSON.parse(localStorage.getItem("recipientes_agregados"));
    this.agregados = array.split(',')
    //console.log(array);
    //console.log(this.agregados);

  }

  getsolicitud() {
    this._solicitudService.solicitud_uno(this.mkid).subscribe(
      response => {
        if (response.solicitud) {
          this.solicitud = response.solicitud;
          //this.folio=this.solicitud[0].folio;
          this.soli = this.solicitud[0].Folio
          this.paciente = this.solicitud[0].ContactoNombre;
          this.edad = this.solicitud[0].ContactoEdad;
          this.mkbcid = this.solicitud[0].BancoID;
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var mkerrores = JSON.parse(error._body);
          Swal.fire('MerQry', mkerrores.message, 'error');
        }
      });
  }

  mk_wfEstado() {
    this._wfEstadoService.wfestado_edit(this.objwfe, this.mkbcid).subscribe(
      response => {
        if (response.wfestado) {
          console.log(response.wfestado);
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var mkerrores = JSON.parse(error._body);
          Swal.fire('MerQry', mkerrores.message, 'error');
        }
      })
  }

  arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
  }

  mk_imprimir() {
    window.print()

    //var printWindow = window.open();
    //printWindow.document.open('text/plain');
    //printWindow.document.write('${'^XA~TA000~JSN^LT0^MNW^MTD^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ^XA^MMT^PW440^LL0200^LS0^FT103,187^A0N,22,16^FB228,1,0,C^FH\^FDvar_recipiente^FS^FT87,55^A0N,23,24^FB247,1,0,C^FH\^FDvar_nombre^FS^FT3,25^A0N,20,19^FB230,1,0,C^FH\^FDvar_sexedad^FS^FT220,26^A0N,20,19^FB226,1,0,C^FH\^FDvar_fecha^FS^BY2,3,72^FT113,139^BCN,,Y,N^FD>:CEN125^FS^PQ1,0,1,Y^XZ'}$');      
    //printWindow.document.write('${'^XA^FO50,100^BXN,10,200^FDYourTextHere^FS^XZ'}$');
    //printWindow.document.close();
    //printWindow.focus();
    //printWindow.print();

    //this.mk_wfEstado();
    //this.ngOnInit(); 

  }

}
