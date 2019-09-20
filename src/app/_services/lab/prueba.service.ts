
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class PruebaService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    prueba_test () {
        return "prueba prueba de servicio ";
    }


	prueba_list(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/prueba', {headers: headers}).map(
            res => res.json()
            ); 
    }
 
    prueba_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/prueba/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }    
    
   prueba_new(prueba){
    let params = JSON.stringify(prueba); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/prueba/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }

    prueba_edit(_id,prueba){   
        let mkid = _id;  
        let params = JSON.stringify(prueba);
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/prueba/' + mkid, params, {headers: headers}).map(
            res => res.json()
            );
    }    
}
