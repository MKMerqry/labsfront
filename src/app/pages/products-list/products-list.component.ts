import { DocService } from './../../_services/lab/doc.service';
import { PacienteService } from './../../_services/lab/paciente.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ArticuloService } from './../../_services/lab/art.service';
import { CancelacionService } from './../../_services/lab/cancelacion.service';
import { ScriptLoaderService } from './../../_services/script-loader.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MonedaService } from './../../_services/lab/moneda.service';

import Swal from 'sweetalert2';
import { DecimalPipe } from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  providers: [ArticuloService, DocService, PacienteService, ScriptLoaderService,MonedaService,CancelacionService]
})
export class ProductsListComponent implements OnInit, AfterViewInit {
  public title: string;
  public identity: any;

  public artlst: any; doclst: any; pacientelst: any;
  public artlstant: any;
  public total: string;
  public artadd: any;
  public urgentelist: any;
  public detallefoliocan: any;
  public indice: number;
  public moneda: any;
  public folionew: any;
  public folionewNombreCntacto: any;
  public infofolionew: any;
  public pacienteforma: FormGroup;
  public CantAnt: number;
  public pxcNetoNnuevo: number;
  public CantNueva: number;
  public newfoliocontacto: any;
  public detalle: any[];
  public tipoNomlis: any[]; pacienteNom: any[]; doctorNom: any[];
  formsolicitud: FormGroup;
  public concepto: any;
  public edad: any;
  




  constructor(
    private _articuloService: ArticuloService,
    private _docService: DocService,
    private _pacienteService: PacienteService,
    private _script: ScriptLoaderService,
    private _fb: FormBuilder,
    private _router: Router,
    private _monedaService:MonedaService,
    private _cancelacionService:CancelacionService,
  ) {
    this.title = 'Nueva Solicitud de Servicio';
    this.detalle = [];
    this.pacienteNom = [];
    this.doctorNom = [];
    this.tipoNomlis=['Personal','Empresa/Seguro']
    this.total = '0';
    this.identity=JSON.parse(localStorage.getItem('identity'));
    this.folionew = localStorage.getItem("folio");
   }

  ngOnInit() {
    this.createFormSolicitud();
    this.createFormPaciente();

    console.log(this.folionew);

    if ( (this.folionew =='0' || this.folionew =='null'|| this.folionew == null)  ) {
      this.formsolicitud.controls['folionew'].setValue('');
      this.folionew ='0'
    } else {
      this.getfolios();

    }

    this.getart();    
    this.getdoc();
    this.getpaciente();
    this.onChangesNacimiento();
    
     
  }

  mk_quitarfolio(){
    localStorage.removeItem("folio");
    this.ngOnInit();
  }

  getfolios(){
    this._cancelacionService.cancelacion_lst(this.folionew).subscribe(
      response => {
        if (response.cancelacion){       
          this.infofolionew = response.cancelacion;   
          console.log(this.infofolionew);
          this.formsolicitud.controls['folionew'].setValue(this.infofolionew[0].folio);
          this.formsolicitud.controls['paciente'].setValue(this.infofolionew[0].contacto);
          this.formsolicitud.controls['cliente'].setValue(this.infofolionew[0].contacto);
          this.formsolicitud.controls['doctor'].setValue(this.infofolionew[0].doctor);
          this.formsolicitud.controls['tipoNom'].setValue(this.infofolionew[0].tiponota);
          this.formsolicitud.controls['encuesta'].setValue(this.infofolionew[0].encuesta);
          this.formsolicitud.controls['tiposervicio'].setValue(this.infofolionew[0].servicio);
          this.formsolicitud.controls['tomamuestra'].setValue(this.infofolionew[0].muestra);
          this.formsolicitud.controls['tipoenvio'].setValue(this.infofolionew[0].envio);

          this.newfoliocontacto=this.infofolionew[0].contacto;  
          this._cancelacionService.cancelacion_lstdet(this.folionew).subscribe(
            response => {
              if (response.cancelaciondet){
                
                this.detallefoliocan=response.cancelaciondet;
                for (const art of this.detallefoliocan) {
                  this.mk_add(art.articulo);

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
      },
      error=>{
        var errorMessage =<any>error;
        if (errorMessage != null) {
          var mkerrores =JSON.parse(error._body);
          Swal.fire('MerQry',mkerrores.message + '...', 'error');
        }
      }); 
  }


  createFormSolicitud() {
    
    this.formsolicitud = this._fb.group({
      folionew :[{value:''},Validators.required],
      concepto :[{value:''},Validators.required],
      tipo :[{value:''},Validators.required],
      tipoCambioDolar :[{value:''},Validators.required],
      paciente :[{value:''},Validators.required],
      cliente :[{value:''},Validators.required],
      referencia :[{value:''},Validators.required],
      corporativo :[{value:''},Validators.required],
      doctor :[{value:''},Validators.required],
      tipoNom :[{value:''},Validators.required],
      pacienteNom :[{value:''},Validators.required],
      corporativoNom :[{value:''},Validators.required],
      doctorNom :[{value:''},Validators.required],
      articulos :[],
      total :[{value:''},Validators.required],
      encuesta  :[{value:''},Validators.required],
      tiposervicio  :[{value:''},Validators.required],
      tomamuestra  :[{value:''},Validators.required],
      tipoenvio  :[{value:''},Validators.required]
    });

    this.formsolicitud.reset();

    this.formsolicitud.controls['folionew'].setValue('');
    this.formsolicitud.controls['concepto'].setValue('');
    this.formsolicitud.controls['tipo'].setValue('');
    this.formsolicitud.controls['tipoCambioDolar'].setValue('');
    this.formsolicitud.controls['paciente'].setValue('');
    this.formsolicitud.controls['cliente'].setValue('');
    this.formsolicitud.controls['referencia'].setValue('');
    this.formsolicitud.controls['corporativo'].setValue('');
    this.formsolicitud.controls['doctor'].setValue('');
    this.formsolicitud.controls['tipoNom'].setValue('Personal');
    this.formsolicitud.controls['pacienteNom'].setValue('');
    this.formsolicitud.controls['corporativoNom'].setValue('');
    this.formsolicitud.controls['doctorNom'].setValue('');
    this.formsolicitud.controls['articulos'].setValue('');
    this.formsolicitud.controls['total'].setValue('');
    this.formsolicitud.controls['encuesta'].setValue('Anuncio Afuera');
    this.formsolicitud.controls['tiposervicio'].setValue('Ordinario');
    this.formsolicitud.controls['tomamuestra'].setValue('Sucursal');
    this.formsolicitud.controls['tipoenvio'].setValue('Indefinido');



  }

 arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}
onChangesNacimiento() {
  this.pacienteforma.get('nacimiento').valueChanges.subscribe(val => {
    var naci = new Date(val);
    var timeDiff = Math.abs(Date.now() - naci.getTime());
    this.edad = Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);
    this.edad=this.edad-1;
    this.pacienteforma.controls['edad'].setValue(this.edad);
  });
}
createFormPaciente(){
  this.pacienteforma = this._fb.group({
    contacto : [{value: ''}, Validators.required],
    nombre : [{value: ''}, Validators.required],
    paterno : [{value: ''}, Validators.required],
    materno : [{value: ''}, Validators.required],
    nacimiento : [{value: ''}, Validators.required],
    edad : [{value: ''}, Validators.required],
    sexo : [{value: ''}, Validators.required],
    correo : [{value: ''}, Validators.required],
    estatus: [{value: ''}, Validators.required],
    telefono: [{value: ''}, Validators.required],
  });

  this.pacienteforma.reset();
  this.pacienteforma.controls['contacto'].setValue('');
  this.pacienteforma.controls['nombre'].setValue('');
    this.pacienteforma.controls['paterno'].setValue('');
    this.pacienteforma.controls['materno'].setValue('');
    this.pacienteforma.controls['nacimiento'].setValue('');
    this.pacienteforma.controls['edad'].setValue('');
    this.pacienteforma.controls['sexo'].setValue('');
    this.pacienteforma.controls['correo'].setValue('');
    this.pacienteforma.controls['estatus'].setValue('ACTIVO');
    this.pacienteforma.controls['telefono'].setValue('');

    



}

  mk_guardarpaciente(){
    if ( this.pacienteforma.value.nombre == "" || !this.pacienteforma.value.nombre ) {
      Swal.fire('MerQry','El nombre es un dato obligatorio', 'error');	
    } else if ( this.pacienteforma.value.paterno == "" || !this.pacienteforma.value.paterno ) {
      Swal.fire('MerQry','El apellido paterno es un dato obligatorio', 'error');
    } else if ( this.pacienteforma.value.nacimiento == "" || !this.pacienteforma.value.nacimiento ) {
      Swal.fire('MerQry','La fecha de nacimiento es un dato obligatorio', 'error');       
    } else if ( this.pacienteforma.value.sexo == "" || !this.pacienteforma.value.sexo ) {
      Swal.fire('MerQry','El genero es un dato obligatorio', 'error');
    //} else if ( this.pacienteforma.value.correo == "" || !this.pacienteforma.value.correo ) {
     // Swal.fire('MerQry','El correo es un dato obligatorio', 'error');   
    } else {
      this._pacienteService.paciente_newexpress(this.pacienteforma.value).subscribe(
        response => {
          if (response.paciente) {
            //console.log(response.paciente);
            this.getpaciente();
            $("#modal_pacientenew").modal('hide');//ocultamos el modal
            $('body').removeClass('modal-open');//eliminamos la clase del body para poder hacer scroll
            $('.modal-backdrop').remove();//eliminamos el backdrop del modal
            this.createFormPaciente();
            this.formsolicitud.controls['paciente'].setValue(this.pacienteforma.value.contacto);
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

  mk_quitar(i){
       var Articuloquitar=  this.detalle[i].Articulo
       var artaddquitar=[];
       artaddquitar = this.artlst.filter( u => u.Articulo == Articuloquitar);
       console.log(artaddquitar[0]);
       this.detalle[i].MKCantidad=1;
       this.detalle[i].pxcNeto=artaddquitar[0].PrecioNeto;

        this.detalle.splice(i, 1);    
        this.total = this.detalle.reduce((sum, value) => (typeof value.pxcNeto === 'number' ? sum + value.pxcNeto : sum), 0);
        //console.log(this.total);
        this.formsolicitud.controls['articulos'].setValue(this.detalle);
        this.formsolicitud.controls['total'].setValue(this.total);
      }

      
  mk_add(key){
    //console.log(key);
    //console.log(this.artadd);
    this.artadd = this.artlst.filter( u => u.Articulo == key);
    this.indice = this.arrayObjectIndexOf(this.detalle, key, "Articulo" );
    //this.artadd[0].MKCantidad=1;
    if (this.indice === -1){

      this.detalle.push(this.artadd[0]);

    } else {

      this.CantAnt = this.detalle[this.indice].MKCantidad;
      this.CantNueva = this.CantAnt + 1;
      this.pxcNetoNnuevo = this.CantNueva * this.detalle[this.indice].PrecioNeto;
      this.detalle[this.indice].MKCantidad = this.CantNueva;
      this.detalle[this.indice].pxcNeto = this.pxcNetoNnuevo;
      
    }
    //console.log(this.detalle);
    this.total = this.detalle.reduce((sum, value) => (typeof value.pxcNeto === 'number' ? sum + value.pxcNeto : sum), 0);
    //console.log(this.total);
    this.formsolicitud.controls['articulos'].setValue(this.detalle);
    this.formsolicitud.controls['total'].setValue(this.total);
    // console.log(this.formsolicitud.value);

  }

  getart() {
    var mkempresa=this.identity.Empresa;
    this._articuloService.art_list(mkempresa).subscribe(
      response => {
        console.log(response.articulo);
        if (response.articulo) {
          this.artlstant = response.articulo;
          this.artlst=this.artlstant[0];
          //console.log(this.artlstant[0]);
          //console.log(this.artlst);
          //MKDescuento

          $( document ).ready(function() {
            $('#products-table').DataTable({
              pageLength: 10,
              fixedHeader: true,
              responsive: true,
              "sDom": 'rtip'
  
          });
          var table = $('#products-table').DataTable();
          $('#key-search').on('keyup', function() {
              table.search(this.value).draw();
          });
          $('#type-filter').on('change', function() {
              table.column(2).search($(this).val()).draw();
          });
          });


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


  getdoc() {
    this._docService.doc_list().subscribe(
      response => {
        if (response.doc) {
          this.doclst = response.doc;
         // console.log(this.doclst);
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

  onChange(event){
    //console.log(event);
    if (event=='nuevo')
      $('#modal_pacientenew').modal('show');
      
  }

  mk_pagar(){   

      console.log(this.formsolicitud.value.tiposervicio,this.detalle);

      this.urgentelist = this.detalle.filter( art => art.Articulo == "URGE");
  	if ( this.formsolicitud.value.paciente == "" || !this.formsolicitud.value.paciente ) {
      Swal.fire('MerQry','El paciente es un dato obligatorio', 'error');	
    //} else if ( this.formsolicitud.value.concepto == "" || !this.formsolicitud.value.concepto ) {
      //  Swal.fire('MerQry','El valor de la encuesta es un dato obligatorio', 'error');	
		} else if (this.formsolicitud.value.doctor == "" || !this.formsolicitud.value.doctor ) {
      Swal.fire('MerQry','El doctor es un dato obligatorio', 'error');
    } else if (this.formsolicitud.value.tipoNom == "" || !this.formsolicitud.value.tipoNom ) {
      Swal.fire('MerQry','El tipo es un dato obligatorio', 'error');              
    } else if (this.formsolicitud.value.tipoNom == "Empresa/Seguro" && (this.formsolicitud.value.corporativo == "" || !this.formsolicitud.value.corporativo) ) {
      Swal.fire('MerQry','El corporativo es un dato obligatorio', 'error'); 
    } else if ( this.detalle.length == 0  ) {
      Swal.fire('MerQry','Seleccione por lo menos un estudio', 'error');    
    } else if ( this.formsolicitud.value.encuesta == "" || !this.formsolicitud.value.encuesta ) {
      Swal.fire('MerQry','La encuesta es un dato obligatorio', 'error');   
    } else if ( this.formsolicitud.value.tiposervicio == "" || !this.formsolicitud.value.tiposervicio ) {
      Swal.fire('MerQry','El tipo de servicio es un dato obligatorio', 'error');   
    } else if ( this.formsolicitud.value.tomamuestra == "" || !this.formsolicitud.value.tomamuestra ) {
      Swal.fire('MerQry','La toma de muestra es un dato obligatorio', 'error'); 
    } else if ( this.formsolicitud.value.tipoenvio == "" || !this.formsolicitud.value.tipoenvio ) {
      Swal.fire('MerQry','El tipo de envio es un dato obligatorio', 'error'); 
    } else if ((this.folionew !='0') && (this.formsolicitud.value.tipoNom == "Empresa/Seguro" && this.formsolicitud.value.corporativo != this.newfoliocontacto ) ) {            
      Swal.fire('MerQry','El folio es exclusivo para el paciente: '+this.folionewNombreCntacto[0].MKNombre, 'error');  
    } else if ((this.folionew !='0') && (this.formsolicitud.value.tipoNom != "Empresa/Seguro" && this.formsolicitud.value.paciente != this.newfoliocontacto)) {
      Swal.fire('MerQry','El folio es exclusivo para el paciente: '+this.folionewNombreCntacto[0].MKNombre, 'error');  
    } else if (this.formsolicitud.value.tiposervicio == "Urgente" && this.urgentelist.length==0) {
        Swal.fire('MerQry','la Solicitud es urgente, y no se encontro el articulo URGE', 'error');             
    } else {  


    this.doctorNom = this.doclst.filter( u => u.Contacto == this.formsolicitud.value.doctor);
    this.pacienteNom = this.pacientelst.filter( u => u.Contacto == this.formsolicitud.value.paciente);      
    
    this.formsolicitud.controls['folionew'].setValue(this.folionew);
    this.formsolicitud.controls['concepto'].setValue(this.concepto);
    
    this.formsolicitud.controls['doctorNom'].setValue(this.doctorNom[0].MKNombre);
    this.formsolicitud.controls['corporativoNom'].setValue(this.pacienteNom[0].MKNombre);
    this.formsolicitud.controls['pacienteNom'].setValue(this.pacienteNom[0].MKNombre);
    this.formsolicitud.controls['tipoCambioDolar'].setValue(this.identity.TipoCambioDolar);
    this.formsolicitud
    localStorage.removeItem("solicitud");
    localStorage.setItem("solicitud", JSON.stringify(this.formsolicitud.value));
  
    this._router.navigate(['pago/new']);
    }
  }


  getpaciente() {
    this._pacienteService.paciente_list().subscribe(
      response => {
        if (response.pacientes) {
          this.pacientelst = response.pacientes;          
          //console.log(this.folionew);
         if (this.folionew =='0' || this.folionew =='null'|| this.folionew == null) {
          //console.log(this.folionew)  
        } else {
          this.folionewNombreCntacto = this.pacientelst.filter( u => u.Contacto == this.infofolionew[0].contacto);
         }
         
         //console.log(this.folionewNombreCntacto);
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

  ngAfterViewInit() {

    this._script.load('./assets/js/scripts/form-plugins.js');

  }


}
