
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
  public identity: any;




  constructor (
    private _userService: UserService
  )
  {
    this.anio = (new Date).getFullYear();
    this.login=JSON.parse(this._userService.getLogin());
  }

  ngOnInit () { 
    this.identity= JSON.parse(localStorage.getItem('identity'));
    if ((localStorage.identity !== undefined)) {
      this.usuario=this.identity.Usuario;
      this.empresa = this.identity.EmpresaNombre;
      this.fechaTrabajo = this.identity.Fecha;
      this.sucursal = this.identity.SucursalNombre;
    } else {
      console.log('footer no se encontro localStorage.nombre');
    }

  }



}


