
import { Component, OnInit,  OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipienteService } from '../../../_services/lab/recipiente.service';
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import Swal from 'sweetalert2';

declare var $: any;


@Component({
  selector: 'app-recipiente-edit',
  templateUrl: './edit.recipiente.component.html',
  providers: [FormsModule, ReactiveFormsModule, RecipienteService]
})
export class RecipienteEditComponent implements OnInit,  OnChanges {
 public mkid: any;
 public articuloforma: FormGroup;
 public mkEditar: boolean;
 public recipiente: any;
 public title: string;

  constructor(
    private _rutaActiva: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router,
    private _script: ScriptLoaderService,  
    private _recipienteService:RecipienteService,  

  ) { 
    this.title='';
  }

  ngOnChanges() {
    console.log('00 Componente empresa iniciado');

  }

  ngOnInit() {
    this.mkid = this._rutaActiva.snapshot.params._key;
    this.createFormArt();

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
      this.title='Recipiente Nuevo';
      this.mkEditar=false;
      this.articuloforma.controls['articulo'].setValue('');
      this.articuloforma.controls['descripcion'].setValue('');
      this.articuloforma.controls['estatus'].setValue('ACTIVO');
      this.articuloforma.controls['tipo'].setValue('Inventariable');
      this.articuloforma.controls['unidad'].setValue('Pieza');
      this.articuloforma.controls['linea'].setValue('Recipiente');

    } else {
      this.title='Recipiente Editar';
      this.mkEditar=true;
      this._recipienteService.recipiente_uno(this.mkid).subscribe(
        response => {
          if (response.recipiente) {
            this.recipiente = response.recipiente;
            this.articuloforma.controls['articulo'].setValue(this.recipiente[0].Articulo);
            this.articuloforma.controls['descripcion'].setValue(this.recipiente[0].Descripcion);
            this.articuloforma.controls['estatus'].setValue(this.recipiente[0].Estatus);
            this.articuloforma.controls['tipo'].setValue(this.recipiente[0].Tipo);
            this.articuloforma.controls['unidad'].setValue(this.recipiente[0].Unidad);
            this.articuloforma.controls['linea'].setValue(this.recipiente[0].Linea);
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
    this._recipienteService.recipiente_new(this.articuloforma.value).subscribe(
      response => {
        if (response.recipiente) {
          this.recipiente = response.recipiente;
          Swal.fire('MerQry', 'El recipiente se guardo correctamente', 'success');
          this._router.navigate(['/recipiente/list']);
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
    this._recipienteService.recipiente_edit(this.mkid,this.articuloforma.value).subscribe(
      response => {
        if (response.recipiente) {
          this.recipiente = response.recipiente;
          Swal.fire('MerQry', 'El recipiente se guardo correctamente', 'success');
          this._router.navigate(['/recipiente/list']);
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
