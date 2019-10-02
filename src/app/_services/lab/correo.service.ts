
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class CorreoService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    correo_test () {
        return "estudio de servicio ";
    }

   correo_new(parametros){
    let params = JSON.stringify(parametros); 
    console.log(params);
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/correo/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }
  
}
