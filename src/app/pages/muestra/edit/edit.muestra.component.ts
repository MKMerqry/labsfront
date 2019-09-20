
import { Component, OnInit,  OnChanges } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MuestraService } from '../../../_services/lab/muestra.service'
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import Swal from 'sweetalert2';

declare var $: any;


@Component({
  selector: 'app-muestra-edit',
  templateUrl: './edit.muestra.component.html',
  providers: [FormsModule, ReactiveFormsModule, MuestraService]
})
export class MuestraEditComponent implements OnInit,  OnChanges {
  public mkid: any;
  public articuloforma: FormGroup;
  public mkEditar: boolean;
  public muestra: any;
  public title: string;

  constructor(
    private _rutaActiva: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router,
    private _script: ScriptLoaderService,  
    private _muestraService:MuestraService,  

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
      unidad : [{value: ''}, Validators.required],
      linea : [{value: ''}, Validators.required],
    });

    this.articuloforma.reset();

    if (this.mkid=='0') {
      this.title='Muestra Nueva';
      this.mkEditar=false;
      this.articuloforma.controls['articulo'].setValue('');
      this.articuloforma.controls['descripcion'].setValue('');
      this.articuloforma.controls['estatus'].setValue('ACTIVO');
      this.articuloforma.controls['tipo'].setValue('Servicio');
      this.articuloforma.controls['unidad'].setValue('Pieza');
      this.articuloforma.controls['linea'].setValue('Muestra');

    } else {
      this.title='Muestra Editar';
      this.mkEditar=true;
      this._muestraService.muestra_uno(this.mkid).subscribe(
        response => {
          if (response.muestra) {
            this.muestra = response.muestra;
            //console.log(this.prueba);
            this.articuloforma.controls['articulo'].setValue(this.muestra[0].Articulo);
            this.articuloforma.controls['descripcion'].setValue(this.muestra[0].Descripcion);
            this.articuloforma.controls['estatus'].setValue(this.muestra[0].Estatus);
            this.articuloforma.controls['tipo'].setValue(this.muestra[0].Tipo);
            this.articuloforma.controls['unidad'].setValue(this.muestra[0].Unidad);
            this.articuloforma.controls['linea'].setValue(this.muestra[0].Linea);
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
    this._muestraService.muestra_new(this.articuloforma.value).subscribe(
      response => {
        if (response.muestra) {
          this.muestra = response.muestra;
          Swal.fire('MerQry', 'La muestra se guardo correctamente', 'success');
          this._router.navigate(['/muestra/list']);
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
    this._muestraService.muestra_edit(this.mkid,this.articuloforma.value).subscribe(
      response => {
        if (response.muestra) {
          this.muestra = response.muestra;
          Swal.fire('MerQry', 'La muestra se guardo correctamente', 'success');
          this._router.navigate(['/muestra/list']);
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
