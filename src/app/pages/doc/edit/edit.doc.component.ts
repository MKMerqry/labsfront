import { Component, OnInit,  OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocService } from '../../../_services/lab/doc.service';
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-doc-edit',
  templateUrl: './edit.doc.component.html',
  providers: [FormsModule, ReactiveFormsModule, DocService]
})
export class DocEditComponent implements OnInit,  OnChanges {
  public mkid: any;
 public docforma: FormGroup;
 public mkEditar: boolean;
 public doc: any;
 public docedit: any;
 public docnew: any;
 public title: string;

  constructor(
    private _rutaActiva: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router,
    private _script: ScriptLoaderService,  
    private _docService:DocService,  

  ) { 
    this.mkid=0;
  }

  ngOnChanges() {
    console.log('00 Componente empresa iniciado');

  }

  ngOnInit() {
    console.log(this.mkid);
    this.mkid = this._rutaActiva.snapshot.params._key;
    console.log(this.mkid);
    this.docforma = this._fb.group({
      contacto : [{value: ''}, Validators.required],
      nombre : [{value: ''}, Validators.required],
      paterno : [{value: ''}, Validators.required],
      materno : [{value: ''}, Validators.required],
      rfc : [{value: ''}, Validators.required],
      usocomprobante : [{value: ''}, Validators.required],
      correo : [{value: ''}, Validators.required],
      estatus: [{value: ''}, Validators.required],
    });

    if (this.mkid=='0') {
      this.getnewid();
    } 
    this.createFormDoc();   
  
  }

getnewid(){
  this._docService.doc_getid().subscribe(
    response => {
      if (response.docID) {
        this.docnew=response.docID[0][0].Clave;
        //console.log(this.pacientenew);
        this.docforma.controls['contacto'].setValue(this.docnew);
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
  createFormDoc() {
    this.docforma.reset();

    if (this.mkid=='0') {      
      this.title='Doctor Nuevo';
      this.mkEditar=true;
      this.docforma.controls['nombre'].setValue('');
      this.docforma.controls['paterno'].setValue('');
      this.docforma.controls['materno'].setValue('');
      this.docforma.controls['rfc'].setValue('');
      this.docforma.controls['usocomprobante'].setValue('');
      this.docforma.controls['correo'].setValue('');
      this.docforma.controls['estatus'].setValue('ACTIVO');

    } else {
      this.title='Doctor Editar';
      this.mkEditar=true;
      this._docService.doc_uno(this.mkid).subscribe(
        response => {
          if (response.doc) {
            this.docedit = response.doc;
            this.docforma.controls['contacto'].setValue(this.docedit[0].Contacto);
            this.docforma.controls['nombre'].setValue(this.docedit[0].Nombre);
            this.docforma.controls['paterno'].setValue(this.docedit[0].ApellidoPaterno);
            this.docforma.controls['materno'].setValue(this.docedit[0].ApellidoMaterno);
            this.docforma.controls['rfc'].setValue(this.docedit[0].RFC);
            this.docforma.controls['usocomprobante'].setValue(this.docedit[0].UsoComprobante);
            this.docforma.controls['correo'].setValue(this.docedit[0].Email);
            this.docforma.controls['estatus'].setValue('ACTIVO');
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


mk_save(){
  if (this.mkid=='0') {
    this._docService.doc_new(this.docforma.value).subscribe(
      response => {
        if (response.doc) {
          this.doc = response.doc;
          Swal.fire('MerQry', 'El doctor se guardo correctamente', 'success');
          this._router.navigate(['/doc/list']);
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var mkerrores =JSON.parse(error._body);
          Swal.fire('MerQry', mkerrores.message, 'error');          
        }
      });

  } else {
    this._docService.doc_edit(this.mkid,this.docforma.value).subscribe(
      response => {
        if (response.doc) {
          this.doc = response.doc;
          Swal.fire('MerQry', 'El doctor se guardo correctamente', 'success');
          this._router.navigate(['/doc/list']);
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



}
