
import { Component, OnInit } from '@angular/core';

//servicios
import { UserService} from '../../_services/login/user.service';
declare var $: any;
@Component({
  selector: '[app-footer]',
  templateUrl: './app-footer.component.html',
  providers: [UserService]
})
export class AppFooter implements OnInit {
  public usuario: string;
  public empresa: string;
  public sucursal: string;
  public devEmpresa: string;
  public devEmpLink: string;
  public devEmpFrace: string;
  public fechaTrabajo: string;
  public anio: number;
  public login: any;



  constructor (
    private _userService: UserService
  )
  {
    this.anio = (new Date).getFullYear();
    this.login=JSON.parse(this._userService.getLogin());
  }

  ngOnInit () {    
    if ((localStorage.identity !== undefined)) {
      this.usuario=this.login.usuario;
      this.empresa = this.login.empresa;
      this.fechaTrabajo = this.login.fecha;
      this.sucursal = this.login.sucursal;
    } else {
      console.log('footer no se encontro localStorage.nombre');
    }

  }



}


