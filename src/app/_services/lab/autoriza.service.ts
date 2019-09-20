
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class AutorizaService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    autoriza_test () {
        return "prueba prueba de servicio ";
    }

    autoriza_list(_id){   
        let mkid = _id;         
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url + '/autoriza/' + mkid, {headers: headers}).map(
            res => res.json()
            );
    }     
    autoriza_edit(_id,autoriza){   
        let mkid = _id;  
        let params = JSON.stringify(autoriza);
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/autoriza/' + mkid, params, {headers: headers}).map(
            res => res.json()
            );
    }    
}
