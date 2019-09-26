import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SolicitudService } from '../../../_services/lab/solicitud.service';
import { MuestraService } from '../../../_services/lab/muestra.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { HTMLfuctions } from '../../../_functions/html.fuctions';
import { Datefuctions } from '../../../_functions/date.function';
import { WfEstadoService } from '../../../_services/lab/wfestado.service';
import { RecipienteService } from '../../../_services/lab/recipiente.service';
import Swal from 'sweetalert2';


export interface wfe {formawfe: string}
export interface intrecipiente { articulo: string, descripcion: string};
export interface arrayrecipiente { articulo: string, descripcion: string};

@Component({
  selector: 'app-select-muestra',
  templateUrl: './select.muestra.component.html',
  providers:[SolicitudService,MuestraService,WfEstadoService,RecipienteService]
})

export class SelectMuestraComponent implements OnInit {
  public title: string;
  mkid:  string;
  solicitud: any[];
  solicitudD: any[];
  agregados: any[];
  muestralst: any[];
  newmuestraslst: any[];
  newmuestraslstsinkit: any[];
  newmuestrasEti: any[];
  formamuestra: FormGroup;
  formafinal: FormGroup; 
  recipientelst: any[];
  formawfe: FormGroup;
  formarecip: FormGroup;
  indice: number;
  cant: number;
  soli: string;
  mkbcid: string;
  artfiltro: any[];
  paciente: string;
  doctor: string;
  hoy : Date = new Date();
  edad: number;
  fecha: string;
  identity: any;
  hora: string;
  objwfe: wfe= {formawfe:"Consumo Mat."}
  public objrecipiente: intrecipiente;
  


  constructor(
    private _rutaActiva: ActivatedRoute,
    private _solicitudService:SolicitudService,
    private _muestraService:MuestraService,
    private _wfEstadoService:WfEstadoService,
    private _fb: FormBuilder,
    private _router: Router,
    private _recipienteService:RecipienteService,
    
  ) { 
    
    this.title="Orden de Trabajo";
    this.solicitud=[];;
    this.solicitudD=[];
    this.agregados=[];
    this.muestralst=[];
    this.newmuestraslst=[];
    this.newmuestraslstsinkit=[];
    this.fecha = Datefuctions.getFechaSinHora(this.hoy);
    this.hora = Datefuctions.getFechaSoloHora(this.hoy);
    this.newmuestrasEti=[];
    this.indice=0;
  }

  ngOnInit() {
    this.mkid = this._rutaActiva.snapshot.params._key;
    this.identity=JSON.parse(localStorage.getItem('identity'));
    this.getsolicitud();
    this.getsolicitudD();
    this.getmuestras();
    this.getnewmuestras(); 
    this.getrecipiente();
    this.createFormRecipiente();

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

  arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

public createFormRecipiente() {
  this.formarecip = this._fb.group({
    recipiente : [{value: ''}, Validators.required],
  });
  this.formarecip.reset();
  this.formarecip.controls['recipiente'].setValue('');
}  

mkagregar(){ 

  if (this.formarecip.value.recipiente==""){
    Swal.fire('MerQry','Debe seleccionar un recipiente','error');
  } else {

   
    this.agregados.push(this.formarecip.value.recipiente);

    
     // console.log(this.agregados);
      this.formarecip.reset();
      this.formarecip.controls['recipiente'].setValue('');
    //}
  }
}

mk_quitar(i){
  this.agregados.splice(i, 1);     
}



mk_imprimir() {

  if (this.agregados.length==0){
    Swal.fire('MerQry', 'Debe un recipiente', 'error');
  } else {
    for (const u of this.agregados) {
      
      var var_recipiente=u;
      var var_nombre=this.paciente;
      var var_sexedad=this.edad;
      var var_fecha=this.fecha+' '+this.hora
      var var_folio=this.soli;
      console.log(this.identity);
  
      var mk_ticket='^XA~TA000~JSN^LT0^MNW^MTD^PON^PMN^LH0,0^JMA^PR5,5~SD15^JUS^LRN^CI0^XZ^XA^MMT^PW440^LL0200^LS0^FT103,187^A0N,22,16^FB228,1,0,C^FH\^FD'+var_recipiente+'^FS^FT87,55^A0N,23,24^FB247,1,0,C^FH\^FD'+var_nombre+'^FS^FT3,25^A0N,20,19^FB230,1,0,C^FH\^FD'+var_sexedad+'^FS^FT220,26^A0N,20,19^FB226,1,0,C^FH\^FD'+var_fecha+'^FS^BY2,3,72^FT113,139^BCN,,Y,N^FD>:'+var_folio+'^FS^PQ1,0,1,Y^XZ'
      fetch("https://rtpos.merqry.mx/print",{
        mode: 'cors',
        headers:{
            'Content-Type': 'application/json'
          },
        body:JSON.stringify({ mac: this.identity.MacImpresion, empresa: this.identity.Empresa, sucursal: this.identity.Sucursal, ticket:mk_ticket }),
        method:"POST"
        }).then(function(data) {
               console.log(data);
        });

    }
    Swal.fire('MerQry', 'La Impresion se envio Correctamente',"success");
  }

  
  // fetch('https://rtpos.merqry.mx/print', {
  //   headers: {
  //     'Content-type': 'application/json'
  //   },
  //   method: 'POST',
  //   body: { mac: '24:B6:FD:17:6F:B4', empresa: 1, sucursal: 1 },
  //   }).then(function(data) {
  //     console.log(data);
  //   });

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


getsolicitud(){
    this._solicitudService.solicitud_uno(this.mkid).subscribe(
      response => {
        if (response.solicitud) {
          this.solicitud = response.solicitud;
          //this.folio=this.solicitud[0].folio;
          this.soli=this.solicitud[0].Folio
          this.paciente=this.solicitud[0].ContactoNombre;         
          this.edad=this.solicitud[0].ContactoEdad;
          this.mkbcid=this.solicitud[0].BancoID;
          this.doctor=this.solicitud[0].vendedornombre;

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

mk_getBottonClass(status){
  return HTMLfuctions.getEstatusClass(status);
}


mk_verImprimir(){
  localStorage.removeItem("recip");
  localStorage.removeItem("recipientes_agregados");
  localStorage.setItem("recipientes_agregados", JSON.stringify(this.agregados.toString()));
  this.mk_wfEstado();
  this._router.navigate(['impselmuestra',this.mkid]);

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

getnewmuestras() {
  this._muestraService.muestra_eti(this.mkid).subscribe(
    response => {
      if (response.etiqueta) {
        //console.log(response.etiqueta);
        this.newmuestraslst = response.etiqueta;    
        console.log('muestra',this.newmuestraslst);
        if (this.newmuestraslst.length > 0 ){
          this.agregados.push(this.newmuestraslst[0].Recipiente);
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

getmuestras() {
  this._muestraService.muestra_list().subscribe(
    response => {
      if (response.muestra) {
        this.muestralst = response.muestra;
        //console.log(this.muestralst);
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
