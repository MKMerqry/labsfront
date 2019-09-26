

import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Datefuctions } from '../../_functions/date.function';
import { Cfg } from './../../_config/gral.config';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// servicios
import { ScriptLoaderService } from '../../_services/script-loader.service';
import { UserService } from '../../_services/login/user.service';
import { EmpresaService } from '../../_services/login/empresa.services';
import { SucursalService } from '../../_services/login/sucursal.service';


// sweetalert2
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [UserService, EmpresaService, SucursalService, FormsModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
	//public user: User;
	//public login : Login;
	public identity: any;	
	public token;
	public status: string;
	public errores: string[];
	public empresalst: any;
	public sucursallst: any;
	public message: string;
	public devEmpresa: string;
	public devEmpresaFrase : string;
	public devEmpresaFraseIni : string;
	public devEmpresaFraseIni2 : string;
	public clickMessage = '';
	public loginUser: string;
	public loginPassword: string;
	public loginEmpresa: string;
	public loginSucursal: string;
	public loginFechaTrabajo: string;
	public LSlogin: any;
	public hoy = new Date();
	public hoytxt: string;
	public mkuser: any;
	public empresalstlog: any;
	public sucursallstlog: any;
	public loginMensaje: string;
	formaLogin: FormGroup;
	


  constructor(
    private _route: ActivatedRoute,
	private _router: Router,
	private _fb: FormBuilder,
	private _userService: UserService,
	private _empresaService: EmpresaService,
	private _sucusalService: SucursalService,
	private _script: ScriptLoaderService
  ) {
		
  //this.user = new User('', '',  '',     '',   '',     'ROLE_USER','','','',Datefuctions.getFechaSinHora_ymd(this.hoy));

	
  }

	ngOnInit() {
		$('body').addClass('empty-layout');	
		this.getEmpresaAll();
		this.getSucursalAll();
		this.createFormLogin();
		this.formaLogin.reset();   
		this.formaLogin.controls['surname'].setValue('');
		 this.formaLogin.controls['password'].setValue('');
		 this.formaLogin.controls['empresa'].setValue('');
		this.formaLogin.controls['sucursal'].setValue('');
		this.formaLogin.controls['fechatrabajo'].setValue(Datefuctions.getFechaSinHora_ymd(this.hoy));
	}


	public createFormLogin (){
		this.formaLogin = this._fb.group({
		  surname : [{value: ''},Validators.required],
		  password : [{value: ''},Validators.required],
		  empresa : [{value: ''},Validators.required],
		  sucursal : [{value: ''},Validators.required],
		  fechatrabajo : [{value: ''},Validators.required],
		});
	  }

	ngAfterViewInit() {
		$('#login-form').validate({
			errorClass:"help-block",
			rules: {
						surname: {required:true},
						password: {required:true},
						empresa: {required:true},
						sucursal: {required:true},
						fechatrabajo: {required:true}
			},
			highlight:function(e){$(e).closest(".form-group").addClass("has-error")},
			unhighlight:function(e){$(e).closest(".form-group").removeClass("has-error")},
		});
		this._script.load('./assets/js/scripts/form-plugins.js');	
  	}

  	ngOnDestroy() {
		$('body').removeClass('empty-layout');
		console.log('Componente Loginnnn Finalizado');
  	}

	public getSucursalAll(){
		this._sucusalService.sucursal_list().subscribe(
			response => {
				if (response.sucursal){
					this.sucursallst = response.sucursal;
				} else {
					console.log('error al responder');
				}
			}
		);
	}

	public getEmpresaAll(){
		this._empresaService.empresa_list().subscribe(
			response => {
				if (response.empresa){
					this.empresalst = response.empresa;
				} else {
					console.log('error al responder');
				}
			}
		);
	}
	
	MkClickLogin(){
		this.empresalstlog = this.empresalst.filter( emp => emp.empresa == this.formaLogin.value.empresa);
		this.sucursallstlog = this.sucursallst.filter( suc => suc.sucursal == this.formaLogin.value.sucursal);

		this.loginUser = this.formaLogin.value.surname;
		this.loginPassword = this.formaLogin.value.password;
		this.loginEmpresa = this.formaLogin.value.empresa;
		this.loginSucursal = this.formaLogin.value.sucursal;
		this.loginFechaTrabajo = this.formaLogin.value.fechatrabajo;

		if ( this.loginUser == "" || !this.loginUser ||
			 this.loginPassword == "" || !this.loginPassword ||
			 this.loginEmpresa == "" || !this.loginEmpresa ||
			 this.loginSucursal == "" || !this.loginSucursal ||
			 this.loginFechaTrabajo == "" || !this.loginFechaTrabajo    ) {
			Swal.fire('MerQry','El usuario no se ha logueado correctamente', 'error');
			this.status='error';		
		} else {	
			this._userService.signup(this.formaLogin.value).subscribe(
				response=>{	
					this.loginMensaje=response[0][0].mensaje;
					
					if (this.loginMensaje=='OK'){
						this.identity=response[0][0];
						localStorage.setItem('identity',JSON.stringify(this.identity));
						this._userService.signup(this.formaLogin.value,'true').subscribe(
							response=>{
								this.token = response.token;
								//if(1 === 2 ){
								//	Swal('el token no se ha generado', this.devEmpresa, 'error');
								//	this.status='error';
								//}else{
									localStorage.setItem('token', this.token);
									this.LSlogin = { 
										usuario:this.loginUser, 
										empresa:this.loginEmpresa,
										empnombre:this.empresalstlog[0].nombre,
										sucursal:this.loginSucursal,
										sucnombre:this.sucursallstlog[0].nombre,
										fecha:this.loginFechaTrabajo
									 };
																	
									localStorage.setItem('login',JSON.stringify(this.LSlogin));
									this.status = 'success';
									Swal.fire('MerQry Welcome' ,this.identity.nombre, 'success');
									console.log(this.formaLogin.value);
									this._router.navigate(['index']);
								//}
							},
							error=>{
								var errorMessage =<any>error;
								if (errorMessage != null) {
									var mkerrores =JSON.parse(error._body);
									Swal.fire('MerQry',mkerrores.message + '...',  'error');
									this.status='error';
								}
							}				 			
						);						

					}
					else {
						Swal.fire('MerQry',this.loginMensaje,'error');
					}					

				},
				error=>{
					var errorMessage =<any>error;
					if (errorMessage != null) {
						var mkerrores =JSON.parse(error._body);
						Swal.fire(mkerrores.message + '...', this.devEmpresa, 'error');
						this.status='error';
					}
				}
			);		
		}
	}
}
