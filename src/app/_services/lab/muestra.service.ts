
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class MuestraService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    muestra_test () {
        return "Recipiente prueba de servicio ";
    }


	muestra_list(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/muestra', {headers: headers}).map(
            res => res.json()
            ); 
    }
 
    muestra_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/muestra/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }    

   muestra_eti(_id){  
    let mkid=_id; 
    let headers = new Headers({'Content-Type':'application/json'});
    return this._http.get(this.url+'/muestraeti/'+mkid, {headers:headers}).map(
        res=>res.json()        
        );
    }  
    
   muestra_new(muestra){
    let params = JSON.stringify(muestra); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/muestra/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }

    muestra_edit(_id,muestra){   
        let mkid = _id;  
        let params = JSON.stringify(muestra);
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/muestra/' + mkid, params, {headers: headers}).map(
            res => res.json()
            );
    }    
}
