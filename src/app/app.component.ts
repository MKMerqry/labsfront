

import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd} from '@angular/router';
import { Helpers} from "./helpers";
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, Form } from '@angular/forms';
import { Cfg } from './_config/gral.config';
import { PerfilService } from './_services/login/perfil.service';
import { UserService } from './_services/login/user.service';

import Swal from 'sweetalert2';


@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PerfilService, UserService],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  FormPerfil: FormGroup;
  public backendUrl: any;
  public perfil : any;
  public mkid : any;
  public identity: any;
  public login: any;
  public empresa: string;
  public sucursal: string;
  public fechaTrabajo : string;
  public usuario : string;
  public database : string;
  public backend : string;
  public foto : any;
  public perfil_lst : any;
  public perfilnew : any;

    constructor(
        private _router: Router,
        private _fb: FormBuilder,
        private httpClient: HttpClient,
        private _userService: UserService,
        private _perfilService: PerfilService,
        )
        {
            this.backendUrl = Cfg.BackendUrl;
        }

  ngOnInit() {

		this._router.events.subscribe((route) => {
			if (route instanceof NavigationStart) {
				Helpers.setLoading(true);
				Helpers.bodyClass('fixed-navbar');
			}
			if (route instanceof NavigationEnd) {
				window.scrollTo(0, 0);
				Helpers.setLoading(false);

				// Initialize page: handlers ...
				Helpers.initPage();
			}

		});

		this.login = JSON.parse(this._userService.getLogin());
    this.identity = this._userService.getIdentity();
    
		this.empresa = 'MerQry';
		if (this.identity!==null && this.identity!==undefined && this.identity.nombre!==undefined) {
		  this.empresa = this.login.empnombre;
		  this.fechaTrabajo = this.login.fecha;
		  this.sucursal = this.login.sucnombre;
		  this.usuario = this.identity.nombre ;
		  this.perfil = this.identity.usuario;
	
      //console.log(this.login);
		  //console.log(this.identity);
      
		} else {
	
		  console.log('header no se encontro localStorage.nombre');
	
		}
		this.createFormPerfil ();
		this.getperfil_lst();
	

  }

  ngAfterViewInit() {

  }

  getperfil_lst() {
    this._perfilService.perfil_lst(this.perfil).subscribe(
    response => {
      if ( response.perfil ) {
    this.perfil_lst = response.perfil;
    //this.foto = './assets/img/users/'+ this.perfil_lst[0].Archivo;
    if (this.perfil_lst!==null && this.perfil_lst!==undefined && this.perfil_lst[0].Archivo!==undefined) {
      this.foto = './assets/img/users/'+ this.perfil_lst[0].Archivo;
    } else {
      this.foto = './assets/img/users/admin-image.png';
    }
    

    
      } else {
        console.log('error al responder');
      }
    });
  }

  public createFormPerfil () {
    this.FormPerfil = this._fb.group({
      usuario : [{value: ''}],
      file : [{value: ''}],
    });
  }



  
  mk_savePerfil(){	  
	//Swal.fire('MerQry', 'HRO'+this.backendUrl, 'success');
	
	const formData = new FormData();
	formData.append('renglon', '0');
	formData.append('modulo', 'PERFIL');
	formData.append('usuario', this.identity.usuario);
	formData.append('file', this.FormPerfil.get('file').value);

  this.httpClient.post<any>(this.backendUrl + '/perfil/new', formData).subscribe(
	response => {
	  if (response.perfil) {
		this.perfilnew = response.perfil;
    
    Swal.fire('MerQry', 'La imagen se guardo correctamente', 'success');
    this._router.navigate(['index']);
		
		
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

  onFileSelect(event) {
    if (event.target.files.length > 0) {
	  const file = event.target.files[0];
	 // console.log('se agrego el file');
	   this.FormPerfil.get('usuario').setValue(this.identity.usuario);
      this.FormPerfil.get('file').setValue(file);
    }
  }



}
