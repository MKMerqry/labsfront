
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class BancoService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    banco_test () {
        return "banco de servicio ";
    }

    banco_list(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/banco/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }
   banco_list2(_id){  
    let mkid=_id; 
    let headers = new Headers({'Content-Type':'application/json'});
    return this._http.get(this.url+'/banco2/'+mkid, {headers:headers}).map(
        res=>res.json()        
        );
}
   banco_new(front_params){
    let params = JSON.stringify(front_params); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/banco/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }

}
