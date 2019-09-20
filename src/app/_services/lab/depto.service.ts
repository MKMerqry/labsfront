
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class DeptoService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    depto_test () {
        return "depto prueba de servicio ";
    }


	depto_list(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/depto', {headers: headers}).map(
            res => res.json()
            ); 
    }
 
    depto_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/depto/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }    
    
   depto_new(depto){
    let params =JSON.stringify(depto); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/depto/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }

    depto_edit(_id,depto){   
        let mkid = _id;  
        let params= JSON.stringify(depto);           
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/depto/' + mkid, params, {headers: headers}).map(
            res => res.json()        
            );
    }    
}
