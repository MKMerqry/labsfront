import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SolicitudService } from '../../../_services/lab/solicitud.service';
import { RecipienteService } from '../../../_services/lab/recipiente.service';
import { ResultadoService } from '../../../_services/lab/resultado.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder  } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutorizaService } from '../../../_services/lab/autoriza.service';
import { HTMLfuctions } from '../../../_functions/html.fuctions';
import { HttpClient } from '@angular/common/http';
import { Cfg } from '../../../_config/gral.config';
import { LinkService } from '../../../_services/login/link.service';
import Swal from 'sweetalert2';


declare var $:any;

@Component({
  selector: 'app-select-resultado',
  templateUrl: './select.resultado.component.html',
  providers:[SolicitudService,RecipienteService,ResultadoService,AutorizaService,LinkService]
})

export class SelectResultadoComponent implements OnInit {
  public title: string;
  public mkid:  string;
  public solicitud: any[];
  public solicitudD: any[];
  public agregados: any[];
  public artfiltro: any[];
  public recipientelst: any[];
  public formarecip: FormGroup;
  public formaresultado: FormGroup;
  public formafinal: FormGroup; 
  public formres:FormGroup;
  public autorizaform:FormGroup;
  public indice: number;
  public cant: number;
  public newcant: number;
  public recipienteresp: any;
  public folio: any;
  public ContactoNombre: any;
  public vendedornombre: any;
  public Estatus: any;
  public evenCap: any;
  public autorizado: any;
  public usuario: any;
  public estatus: any;
  public recipientemov: any;
  public backendUrl: any;
  public folioInv: any[];
  public resultadolst : any[];
  public control : any[];
  public bcID: any;
  public uploadForm: FormGroup;
  public hoy = new Date();
  public login: any;
  public link: any;
  public linkd: any;

  constructor(
    private _rutaActiva: ActivatedRoute,
    private _solicitudService:SolicitudService,
    private _recipienteService:RecipienteService,
    private _resultadoService:ResultadoService,
    private _autorizaService:AutorizaService,
    private _fb: FormBuilder,
    private _router:Router,
    private httpClient: HttpClient,
    private _linkService :LinkService,
  ) { 
    this.title="Captura de Resultados";
    this.solicitud=[];;
    this.solicitudD=[];
    this.agregados=[];
    this.recipientelst=[];
    this.resultadolst=[];
    this.indice=0;
    this.folioInv;
    this.control =[];
    this.backendUrl= Cfg.BackendUrl;
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

  ngOnInit() {
    this.mkid = this._rutaActiva.snapshot.params._key;
    this.getsolicitud();
    this.getsolicitudD();
    this.getresultado();
    this.createFormRecipiente();
    this.createformres();
    this.createformautoriza();
    //this.createFormLink();
    //this.getlink();
    //this.getlinkd();
    this.login = localStorage.getItem('login');
    console.log(this.login );
     
  }

  public createFormLink() {
    this.uploadForm = this._fb.group({
      idventa : [{value: ''}],
      idbanco : [{value: ''}],
      fecha : [{value: ''}],
      file : [{value: ''}],
      usuario : [{value: ''}],
    });
    this.uploadForm.reset();
    this.uploadForm.controls['idventa'].setValue(this.mkid);
    this.uploadForm.controls['idbanco'].setValue(this.mkid);
    this.uploadForm.controls['fecha'].setValue(this.hoy);
    this.uploadForm.controls['usuario'].setValue('1');



  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
     // console.log(file);
      //console.log(file.type);
      if (file.type==='text/plain'){
        this.uploadForm.controls['file'].setValue(file);
      } else {
        Swal.fire('MerQry', 'El archivo debe ser extension TXT', 'error');
      }

      
    }
  }

  onSubmit() {
    console.log(this.uploadForm.get('file').value);
    if (this.uploadForm.get('file').value==null || this.uploadForm.get('file').value==undefined){
      Swal.fire('MerQry', 'Seleccione un archivo con extension TXT', 'error');
    } else {

      const formData = new FormData();
      formData.append('idventa', this.mkid);
      formData.append('idbanco', this.mkid);
      formData.append('fecha', this.hoy.toString());
      formData.append('file', this.uploadForm.get('file').value);
      formData.append('usuario', this.login.usuario);

      this.httpClient.post<any>(this.backendUrl + '/link/new', formData).subscribe(
        response => {
          if (response.link) {
            //this.proylink = response.link;
            Swal.fire('MerQry', 'El Archivo subio correctamente', 'success');
            this.ngOnInit();

          }
        },
        error => {
          var errorMessage =<any>error;
          if (errorMessage != null) {
            var mkerrores =JSON.parse(error._body);
            Swal.fire('MerQry', mkerrores.message, 'error');
          }
        });
    }
  }

  createformautoriza(){
    this.autorizaform=this._fb.group({
      usuario : [{value: ''}, Validators.required],
      contrasena : [{value: ''}, Validators.required],
      bcid : [{value: ''}, Validators.required],
    });
    this.autorizaform.reset();
    this.autorizaform.controls['usuario'].setValue(''); 
    this.autorizaform.controls['contrasena'].setValue(''); 
    this.autorizaform.controls['bcid'].setValue(this.bcID);     
  }

  createformres(){
  this.formres = this._fb.group({
    vid: ['', [Validators.required,Validators.maxLength(25)]],
    mkres: this._fb.array([
      this.getUnit()
    ])
  });
  this.formres.reset();
  this.formres.controls['vid'].setValue(this.mkid);  
  }

  get resultFormGroup() {
    return this.formres.get('mkres') as FormArray;
  }

  getControls() {
    return (this.formres.get('mkres') as FormArray).controls;
  }
  
  getUnit() {
    return this._fb.group({
      id : [{value: ''}, Validators.required],
      Articulo : [{value: ''}, Validators.required],
      rengloID : [{value: ''}, Validators.required],
      descripcion : [{value: ''}, Validators.required],
      ValorCapturado : [{value: ''}, Validators.required],
      ValorMinimo : [{value: ''}, Validators.required],
      ValorMaximo : [{value: ''}, Validators.required],
      ValorTexto : [{value: ''}, Validators.required],
      Unidad : [{value: ''}, Validators.required],
    });
  }

  getresultado(){
    this._resultadoService.resultado_list(this.mkid).subscribe(
      response => {
        if (response.resultado) {
          this.resultadolst = response.resultado;
          this.resultadolst.sort((a, b) => Number(a.renglon) - Number(b.renglon));
        //console.log(this.resultadolst);
          let mkresControl = <FormArray>this.formres.controls.mkres;
          //let mkresControl = <FormArray>this.formres.controls.mkres;
          this.resultadolst.forEach(resulta => {
            mkresControl.push(this._fb.group(resulta))
          })
          mkresControl.removeAt( 0 );
           //console.log(this.formres.value);
           //console.log(this.formres.get('mkres').value);  
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

  mk_getBottonClass(min,valor,max){
    
    return HTMLfuctions.getcapturacellClass(min,valor,max);
  }

  createArray(): FormArray {
    return new FormArray(this.resultadolst.map(item => new FormGroup({
      fr: new FormControl(item.frid)
    })));
  }

  mk_autoriza(){
    if (this.autorizado == 'Autorizado'){
      Swal.fire('MerQry','El Movimiento ya esta autorizado','error');
    } else {
      this._autorizaService.autoriza_list(this.autorizaform.value.usuario).subscribe(
        response => {
          if (response.usuario) {   
            this.usuario=response.usuario;
            //console.log(this.usuario[0].Contrasena);
            //console.log(this.autorizaform.value);
            if (this.usuario[0].Usuario != this.autorizaform.value.usuario){
              Swal.fire('MerQry','La contraseña no es correcta','error');
            } else if (this.usuario[0].Contrasena != this.autorizaform.value.contrasena){
              Swal.fire('MerQry','La contraseña no es correcta','error');
            } else  if (this.usuario[0].AgenteTipo != 'Autorizador'){
              Swal.fire('MerQry','El usuario no puede autorizar','error');
            } else {
              this._autorizaService.autoriza_edit( this.bcID,this.autorizaform.value).subscribe(
                response => {
                  if (response.autoriza) {
                    $("#modal_autoriza").modal('hide');//ocultamos el modal
                    $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
                    $('.modal-backdrop').remove();//eliminamos el backdrop del modal
                    Swal.fire('MerQry','El movimiento fue autorizado','success'); 
                    this.ngOnInit()
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

  mkImprimir(){
    if ( this.autorizado == "Sin Autorizar"  ) {
			Swal.fire('MerQry','Los resultados deben estar autorizados', 'error');	
		} else if ( this.estatus == "PENDIENTE"  ) {
      Swal.fire('MerQry','El estatus de la solicitud debe estar CONCLUIDO', 'error');
    } else {
      this._router.navigate(['impresultado/'+this.mkid]);
    }

//let printContents, popupWin;
  //  printContents = document.getElementById("MKprint").innerHTML;
//    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
 //   popupWin.document.open();
 //    popupWin.document.write(`
  //     <html>
 //        <head>
 //          <title>Print tab</title>
 //          <style>
  //         <link href="./assets/vendors/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" />
 //          <link href="./assets/vendors/font-awesome/css/font-awesome.min.css" rel="stylesheet" />
 //          <link href="./assets/vendors/line-awesome/css/line-awesome.min.css" rel="stylesheet" />
 //          <link href="./assets/vendors/themify-icons/css/themify-icons.css" rel="stylesheet" />
 //          <link href="./assets/vendors/animate.css/animate.min.css" rel="stylesheet" />
 //          <link href="./assets/vendors/toastr/toastr.min.css" rel="stylesheet" />
 //          <link href="./assets/vendors/bootstrap-select/dist/css/bootstrap-select.min.css" rel="stylesheet" />
 //          <!-- PLUGINS STYLES-->
 //          <!-- THEME STYLES-->
 //          <link href="assets/css/main.min.css" rel="stylesheet" />
 //          </style>
 //        </head>
 //    <body onload="window.print();window.close()">${printContents}</body>
  //     </html>`
  //   );
  //   popupWin.document.close();
    //const printContent = document.getElementById("MKprint");
//const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
//WindowPrt.document.write(printContent.innerHTML);
//WindowPrt.document.close();
//WindowPrt.focus();
//WindowPrt.print();
//WindowPrt.close();
     //Swal.fire('MerQry','Se imprimio correctamente','success');
  }

  mkEnviar(){
    if ( this.autorizado == "Sin Autorizar"  ) {
			Swal.fire('MerQry','Los resultados deben estar autorizados', 'error');	
		} else if ( this.estatus == "PENDIENTE"  ) {
      Swal.fire('MerQry','El estatus debe estar CONCLUIDO', 'error');
    } else {
      Swal.fire('MerQry','Se envio correctamente','success');
    }
    
  }

  mkGuardar(){   

    this._resultadoService.resultado_edit(this.formres.value,this.mkid).subscribe(
      response => {
        if (response.resultado) {
          //this.solicitud = response.solicitud;
          Swal.fire('MerQry','Se guardo correctamente','success');
          this.ngOnInit();
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

  getsolicitud(){
      this._solicitudService.solicitud_uno(this.mkid).subscribe(
        response => {
          if (response.solicitud) {
            this.solicitud = response.solicitud;
            this.folio=this.solicitud[0].Folio;
            this.ContactoNombre=this.solicitud[0].ContactoNombre;
            this.vendedornombre=this.solicitud[0].vendedornombre;
            this.Estatus=this.solicitud[0].Estatus;
            this.bcID=this.solicitud[0].BancoID;
            this.estatus=this.solicitud[0].Estatus;
            if (this.solicitud[0].DiotExcluir=="0"){
              this.autorizado='Sin Autorizar'
            } else {
              this.autorizado='Autorizado'
            }
           // console.log(this.autorizado);
            console.log(this.bcID);

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





}
