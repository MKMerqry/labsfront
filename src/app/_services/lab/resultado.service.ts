
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class ResultadoService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    resultado_test () {
        return "banco de servicio ";
    }

    resultado_list(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/resultado/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }

   resultado_listsp(_id){  
    let mkid=_id; 
    let headers = new Headers({'Content-Type':'application/json'});
    return this._http.get(this.url+'/resultadosp/'+mkid, {headers:headers}).map(
        res=>res.json()        
        );
}   

   resultado_edit(resultado,_id){   
    let mkid = _id;
    let params = JSON.stringify(resultado);
    let headers = new Headers({'Content-Type':'application/json'});
    return this._http.put(this.url + '/resultado/' + mkid, params, {headers: headers}).map(
        res => res.json()
        );
    }  

}
