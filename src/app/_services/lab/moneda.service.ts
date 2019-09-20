
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class MonedaService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    moneda_test () {
        return "moneda de servicio ";
    }


	moneda_list(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/moneda', {headers: headers}).map(
            res => res.json()
            ); 
    }
 
    moneda_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/moneda/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }

}
