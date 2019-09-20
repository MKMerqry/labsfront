
import { Component, OnInit,  OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpfileService } from '../../../_services/lab/upfile.service';
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import { Datefuctions } from '../../../_functions/date.function';
import { HttpClient } from '@angular/common/http';
import { Cfg } from '../../../_config/gral.config';
import Swal from 'sweetalert2';

declare var $: any;


@Component({
  selector: 'app-upresultado-edit',
  templateUrl: './edit.upresultado.component.html',
  providers: [FormsModule, ReactiveFormsModule, UpfileService, HttpClient]
})
export class UpResultadoEditComponent implements OnInit,  OnChanges {
  public mkid: any;
  public upfileforma: FormGroup;
  public mkEditar: boolean;
  public mkfile: boolean;
  public prueba: any;
  public identity: any;
  public linkd: any;
  public link: any;
  public update: any;
  public backendUrl: any;

 public title: string;
 public hoy = new Date();
 public files: File[] = [];


  constructor(
    private _rutaActiva: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router,
    private _httpClient:HttpClient,
    private _script: ScriptLoaderService,  
    private _upfileService:UpfileService,  

  ) { 
    this.backendUrl=Cfg.BackendUrl;
  }

  ngOnChanges() {
  }

  ngOnInit() {
    this.mkid = this._rutaActiva.snapshot.params._key;   
    this.createFormUp();
    this.getupfiled();

   
  }


 createFormUp() {
    this.upfileforma = this._fb.group({
      fecha : [{value: ''}, Validators.required],
      descripcion : [{value: ''}, Validators.required],
      file : [{value: ''}, Validators.required],
      usuario : [{value: ''}, Validators.required],
      estatus : [{value: ''}, Validators.required],
    });

    this.upfileforma.reset();

    if (this.mkid=='0') {
      this.mkEditar=false;      
      //this.mkfile=false;
      this.identity=JSON.parse(localStorage.getItem('identity'));
      this.title='Archivo Nuevo';
      this.upfileforma.controls['fecha'].setValue(Datefuctions.getFechaSinHora_ymd(this.hoy));
      this.upfileforma.controls['descripcion'].setValue('');
      this.upfileforma.controls['file'].setValue('');
      this.upfileforma.controls['usuario'].setValue(this.identity.usuario);
      this.upfileforma.controls['estatus'].setValue('ACTIVO');
    } else {
      this.title='Archivo Editar';
      this.mkEditar=true;
      //this.mkfile=true;
      this._upfileService.upfile_uno(this.mkid).subscribe(
        response => {
          if (response.upfile) {
            //console.log(response.upfile);
            this.link = response.upfile[0];
            this.upfileforma.controls['fecha'].setValue(Datefuctions.getFechaSinHora_ymd(this.link.Fecha));
            this.upfileforma.controls['descripcion'].setValue(this.link.Descripcion);
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

  onSelect(event) {
    console.log(event);
    this.files=[];
    this.files.push(...event.addedFiles);
    const file = this.files[0];
    this.upfileforma.get('file').setValue(file);

  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }


  
  mk_upload() {
    if (this.upfileforma.get('file').value==null || this.upfileforma.get('file').value==undefined){
      Swal.fire('MerQry', 'Seleccione un archivo con extension TXT', 'error');
    } else {

      const formData = new FormData();
      formData.append('fecha',  this.upfileforma.get('fecha').value);
      formData.append('descripcion',  this.upfileforma.get('descripcion').value);      
      formData.append('file', this.upfileforma.get('file').value);      
      formData.append('usuario', this.upfileforma.get('usuario').value);
      formData.append('estatus', this.upfileforma.get('estatus').value);

      this._httpClient.post<any>(this.backendUrl + '/upfile/new', formData).subscribe(
        response => {
          if (response.link) {
            //this.proylink = response.link;
            Swal.fire('MerQry', 'El Archivo subio correctamente', 'success');
            this._router.navigate(['upresultado/list']);

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

 
  mk_update(){
    this._upfileService.upfile_spupdate(this.mkid).subscribe(
      response => {
        if (response) {
          this.update = response.upfile;
          console.log(this.update);
          Swal.fire('MerQry', 'la actualizacion se realizo correctamente', 'error');
          this._router.navigate(['upresultado/list']);
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

  getupfiled(){
    this._upfileService.upfile_listd(this.mkid).subscribe(
      response => {
        if (response.upfiled) {
          this.linkd = response.upfiled;
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

}
