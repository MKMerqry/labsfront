
import { Component,  OnInit } from '@angular/core';
import { Cfg } from './../../_config/gral.config';
//Servicios
import { UserService } from '../../_services/login/user.service';
import { NotiService } from '../../_services/login/notificaciones.service';
import { PerfilService } from '../../_services/login/perfil.service';

import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: '[app-header]',
  templateUrl: './app-header.component.html',
  providers: [UserService, NotiService, PerfilService]

})
export class AppHeader implements OnInit {
  public identity: any;
  public login: any;
  public perfil: string;
  public empresa: string;
  public sucursal: string;
  public fechaTrabajo : string;
  public usuario : string;
  public database : string;
  public backend : string;
  public foto : any;
  public perfil_lst : any;
  public perfilnew : any;
  public mensajes: any;
  public notificacion : any;
  public noti_lst : any[];
  public noticia_lst : Array<object> = [];



constructor ( 
  private _userService: UserService,
  private _notificacionService: NotiService,
  private _perfilService: PerfilService,

   ) {
    this.backend = Cfg.BackendUrl;

}

  ngOnInit () {
    this.login = JSON.parse(this._userService.getLogin());
    this.identity = this._userService.getIdentity();
    this.empresa = 'MerQry';
    if (this.identity!==null && this.identity!==undefined && this.identity.nombre!==undefined) {
      this.empresa = this.login.empnombre;
      this.fechaTrabajo = this.login.fecha;
      this.sucursal = this.login.sucnombre;
      this.usuario = this.identity.nombre ;
      this.perfil = this.identity.usuario;

      //console.log(this.identity);
    } else {

      console.log('header no se encontro localStorage.nombre');

    }
    //this.getnotificiones();
    this.getimagen();

  }

  mk_borrar(){
    console.log(this.perfil);
    this._notificacionService.notificacion_update(this.perfil).subscribe(
      response => {
        if (response.notificacion){
          console.log(response.notificacion);
          this.ngOnInit();
           }
      },
      error => {
        var errorMessage =<any>error;
        if (errorMessage != null) {
          var mkerrores =JSON.parse(error._body);
          Swal.fire('AMLO',mkerrores.message + '...', 'error');
        }
      });
  }

  getimagen(){
    this._perfilService.perfil_lst(this.perfil).subscribe(
      response => {
        if (response.perfil){
          this.foto = response.perfil[0].Nombre;
          this.foto = 'assets/img/users/' + this.foto;
          //console.log(this.foto);
          // this.noti_lst = this.notificacion;
          // this.mensajes = this.noti_lst.length;
          // console.log(this.notificacion);



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


  getnotificiones(){
        
    this._notificacionService.notificacion_list(this.perfil).subscribe(
      response => {
        if (response.notificacion){            
          this.notificacion = response.notificacion;
          this.noti_lst = this.notificacion;
          this.mensajes = this.noti_lst.length;
          for (let p of this.noti_lst) { 
            //console.log(p.Usuario);
            this._perfilService.perfil_lst(p.Usuario).subscribe(
              response => {
                if (response.perfil){
                  //console.log(p);
                  p.imagenperfil='./assets/img/users/'+ response.perfil[0].Nombre;
                  //console.log(p);
                  this.noticia_lst.push(p);
                  //this.foto = 'assets/img/users/' + this.foto;
                  //console.log(this.foto);
                  // this.noti_lst = this.notificacion;
                  // this.mensajes = this.noti_lst.length;
                  // console.log(this.notificacion);
        
        
        
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







}
