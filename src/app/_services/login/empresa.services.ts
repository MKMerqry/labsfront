import { Cfg } from './../../_config/gral.config';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';


@Injectable()


export class EmpresaService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http){
        this.url = Cfg.BackendUrl;

    }

    empresa_test () {
        return "Empresa prueba de servicio";
    }

    empresa_list(){
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url + '/empresa', {headers: headers}).map(
            res => res.json()
            );
    }


}
