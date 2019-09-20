
import { Component, OnInit,  OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeptoService } from '../../../_services/lab/depto.service';
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import Swal from 'sweetalert2';

declare var $: any;


@Component({
  selector: 'app-depto-edit',
  templateUrl: './edit.depto.component.html',
  providers: [FormsModule, ReactiveFormsModule, DeptoService]
})
export class DeptoEditComponent implements OnInit,  OnChanges {
  public mkid: any;
  public articuloforma: FormGroup;
  public mkEditar: boolean;
  public depto: any;
  public title: string;

  constructor(
    private _rutaActiva: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router,
    private _script: ScriptLoaderService,  
    private _deptoService:DeptoService,  

  ) { 

  }

  ngOnChanges() {
    console.log('00 Componente empresa iniciado');

  }

  ngOnInit() {
    this.mkid = this._rutaActiva.snapshot.params._key;
   
    this.createFormArt();
    //console.log(this.mkid);
  }


 createFormArt() {

    this.articuloforma = this._fb.group({
      depto : [{value: ''}, Validators.required]
    });

    this.articuloforma.reset();

    if (this.mkid=='0') {
      this.title='Departamento Nuevo';
      this.mkEditar=false;
      this.articuloforma.controls['depto'].setValue('');
      

    } else {
      this.title='Departamento Editar';
      this.mkEditar=false;
      this._deptoService.depto_uno(this.mkid).subscribe(
        response => {
          if (response.depto) {
            this.depto = response.depto;
            //console.log(this.prueba);
            this.articuloforma.controls['depto'].setValue(this.depto[0].Grupo);
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
    this._deptoService.depto_new(this.articuloforma.value).subscribe(
      response => {
        if (response.depto) {
          this.depto = response.depto;
          Swal.fire('MerQry', 'El departamento se guardo correctamente', 'success');
          this._router.navigate(['/depto/list']);
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
    this._deptoService.depto_edit(this.mkid,this.articuloforma.value).subscribe(
      response => {
        if (response.depto) {
          this.depto = response.depto;
          Swal.fire('MerQry', 'El departamento se guardo correctamente', 'success');
          this._router.navigate(['/depto/list']);
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
