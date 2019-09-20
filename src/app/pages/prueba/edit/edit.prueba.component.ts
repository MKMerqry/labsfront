
import { Component, OnInit,  OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PruebaService } from '../../../_services/lab/prueba.service'
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import Swal from 'sweetalert2';

declare var $: any;


@Component({
  selector: 'app-prueba-edit',
  templateUrl: './edit.prueba.component.html',
  providers: [FormsModule, ReactiveFormsModule, PruebaService]
})
export class PruebaEditComponent implements OnInit,  OnChanges {
  public mkid: any;
  public articuloforma: FormGroup;
  public mkEditar: boolean;
  public prueba: any;
 public title: string;

  constructor(
    private _rutaActiva: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router,
    private _script: ScriptLoaderService,  
    private _pruebaService:PruebaService,  

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
      articulo : [{value: ''}, Validators.required],
      descripcion : [{value: ''}, Validators.required],
      estatus : [{value: ''}, Validators.required],
      tipo : [{value: ''}, Validators.required],
      linea : [{value: ''}, Validators.required],
      unidad : [{value: ''}, Validators.required],
    });

    this.articuloforma.reset();

    if (this.mkid=='0') {
      this.title='Prueba Nueva';
      this.mkEditar=false;
      this.articuloforma.controls['articulo'].setValue('');
      this.articuloforma.controls['descripcion'].setValue('');
      this.articuloforma.controls['estatus'].setValue('ACTIVO');
      this.articuloforma.controls['tipo'].setValue('Servicio');
      this.articuloforma.controls['unidad'].setValue('Pieza');
      this.articuloforma.controls['linea'].setValue('Determinacion');

    } else {
      this.title='Prueba Editar';
      this.mkEditar=true;
      this._pruebaService.prueba_uno(this.mkid).subscribe(
        response => {
          if (response.prueba) {
            this.prueba = response.prueba;
            //console.log(this.prueba);
            this.articuloforma.controls['articulo'].setValue(this.prueba[0].Articulo);
            this.articuloforma.controls['descripcion'].setValue(this.prueba[0].Descripcion);
            this.articuloforma.controls['estatus'].setValue(this.prueba[0].Estatus);
            this.articuloforma.controls['tipo'].setValue(this.prueba[0].Tipo);
            this.articuloforma.controls['unidad'].setValue(this.prueba[0].Unidad);
            this.articuloforma.controls['linea'].setValue(this.prueba[0].Linea);
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
    this._pruebaService.prueba_new(this.articuloforma.value).subscribe(
      response => {
        if (response.prueba) {
          this.prueba = response.prueba;
          Swal.fire('MerQry', 'La prueba se guardo correctamente', 'success');
          this._router.navigate(['/prueba/list']);
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
    this._pruebaService.prueba_edit(this.mkid,this.articuloforma.value).subscribe(
      response => {
        if (response.prueba) {
          this.prueba = response.prueba;
          Swal.fire('MerQry', 'La prueba se guardo correctamente', 'success');
          this._router.navigate(['/prueba/list']);
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
