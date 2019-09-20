
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class PerfilService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http){
        this.url = Cfg.BackendUrl;

    }

    perfil_test () {
        return "tipo prueba de servicio ";
    }


    perfil_lst(_id){     
        let mkid=_id;           
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/perfil/'+mkid, {headers:headers}).map(
            res=>res.json()        
            ); 
    }
}