import { Component, OnInit,  OnChanges, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PacienteService } from '../../../_services/lab/paciente.service';
import { ScriptLoaderService } from '../../../_services/script-loader.service';
import { Datefuctions } from '../../../_functions/date.function'
import Swal from 'sweetalert2';

declare var $: any;


@Component({
  selector: 'app-paciente-edit',
  templateUrl: './edit.paciente.component.html',
  providers: [FormsModule, ScriptLoaderService,ReactiveFormsModule, PacienteService]
})
export class PacienteEditComponent implements OnInit,  OnChanges, AfterViewInit {
  public mkid: any;
  public pacienteforma: FormGroup;
  public mkEditar: boolean;
  public paciente: any;
  public pacientenew: any;
  public title: string;
  public edad: any;

  constructor(
    private _rutaActiva: ActivatedRoute,
    private _fb: FormBuilder,
    private _router: Router,
    private _script: ScriptLoaderService,  
    private _pacienteService:PacienteService,  

  ) { 
    this.mkid=0;

  }

  ngOnChanges() {
    console.log('00 Componente empresa iniciado');

  }

  ngOnInit() {

    this.mkid = this._rutaActiva.snapshot.params._key; 
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

    if (this.mkid=='0') {
      this.getnewid();
    }
    this.createFormPaciente();   
    this.onChangesNacimiento();
  }

getnewid(){
  this._pacienteService.paciente_getid().subscribe(
    response => {
      if (response.pacienteID) {
        this.pacientenew=response.pacienteID[0][0].Clave;
        //console.log(this.pacientenew);
        this.pacienteforma.controls['contacto'].setValue(this.pacientenew);
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


onChangesNacimiento() {
  this.pacienteforma.get('nacimiento').valueChanges.subscribe(val => {
    var naci = new Date(val);
    var timeDiff = Math.abs(Date.now() - naci.getTime());
    this.edad = Math.ceil((timeDiff / (1000 * 3600 * 24)) / 365);
    this.edad=this.edad-1;
    this.pacienteforma.controls['edad'].setValue(this.edad);
  });
}

createFormPaciente() {
  this.pacienteforma.reset();

  if (this.mkid=='0') {      
    this.title='Paciente Nuevo';
    this.mkEditar=true;
    this.pacienteforma.controls['nombre'].setValue('');
    this.pacienteforma.controls['paterno'].setValue('');
    this.pacienteforma.controls['materno'].setValue('');
    this.pacienteforma.controls['nacimiento'].setValue('');
    this.pacienteforma.controls['edad'].setValue('');
    this.pacienteforma.controls['sexo'].setValue('');
    this.pacienteforma.controls['correo'].setValue('');
    this.pacienteforma.controls['telefono'].setValue('');    
    this.pacienteforma.controls['estatus'].setValue('ACTIVO');

  } else {
    this.title='Paciente Editar';
    this.mkEditar=true;
    this._pacienteService.paciente_uno(this.mkid).subscribe(
      response => {
        if (response.paciente) {
          this.paciente = response.paciente;
          console.log(this.paciente);
          this.pacienteforma.controls['contacto'].setValue(this.paciente[0].Contacto);
          this.pacienteforma.controls['nombre'].setValue(this.paciente[0].Nombre);
          this.pacienteforma.controls['paterno'].setValue(this.paciente[0].ApellidoPaterno);
          this.pacienteforma.controls['materno'].setValue(this.paciente[0].ApellidoMaterno);
          this.pacienteforma.controls['nacimiento'].setValue(Datefuctions.getFechaSinHora_ymd(this.paciente[0].FechaNacimientoE));
          this.pacienteforma.controls['edad'].setValue(this.paciente[0].Edad);
          this.pacienteforma.controls['sexo'].setValue(this.paciente[0].Sexo);
          this.pacienteforma.controls['correo'].setValue(this.paciente[0].Email);
          this.pacienteforma.controls['telefono'].setValue(this.paciente[0].Telefono);
          this.pacienteforma.controls['estatus'].setValue('ACTIVO');
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

  if ( this.pacienteforma.value.nombre == "" || !this.pacienteforma.value.nombre ) {
    Swal.fire('MerQry','El nombre es un dato obligatorio', 'error');	
  } else if ( this.pacienteforma.value.paterno == "" || !this.pacienteforma.value.paterno ) {
    Swal.fire('MerQry','El apellido paterno es un dato obligatorio', 'error');
  } else if ( this.pacienteforma.value.nacimiento == "" || !this.pacienteforma.value.nacimiento ) {
    Swal.fire('MerQry','La fecha de nacimiento es un dato obligatorio', 'error');       
  } else if ( this.pacienteforma.value.sexo == "" || !this.pacienteforma.value.sexo ) {
    Swal.fire('MerQry','El genero es un dato obligatorio', 'error');
 // } else if ( this.pacienteforma.value.telefono == "" || !this.pacienteforma.value.correo ) {
   // Swal.fire('MerQry','El correo es un dato obligatorio', 'error');   
  } else {

      if (this.mkid=='0') {
        this._pacienteService.paciente_new(this.pacienteforma.value).subscribe(
          response => {
            if (response.paciente) {
              this.paciente = response.paciente;
              Swal.fire('MerQry', 'El paciente se guardo correctamente', 'success');
              this._router.navigate(['/paciente/list']);
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
        this._pacienteService.paciente_edit(this.mkid,this.pacienteforma.value).subscribe(
          response => {
            if (response.paciente) {
              this.paciente = response.paciente;
              Swal.fire('MerQry', 'El paciente se guardo correctamente', 'success');
              this._router.navigate(['/paciente/list']);
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


ngAfterViewInit() {
  this._script.load('./assets/js/scripts/form-plugins.js');

  }
}
