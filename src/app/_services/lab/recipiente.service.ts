
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class RecipienteService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    recipiente_test () {
        return "Recipiente prueba de servicio ";
    }


	recipiente_list(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/recipiente', {headers: headers}).map(
            res => res.json()
            ); 
    }
 
    recipiente_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/recipiente/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }    
   recipiente_mov(_id){  
    let mkid=_id; 
    let headers = new Headers({'Content-Type':'application/json'});
    return this._http.get(this.url+'/recipientemov/'+mkid, {headers:headers}).map(
        res=>res.json()        
        );
}  

recipiente_newmov(recipiente){
    let params = JSON.stringify(recipiente); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/recipiente/newmov',params,{headers:headers}).map(
        res=>res.json()
        );
    }
   recipiente_new(recipiente){
    let params = JSON.stringify(recipiente); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/recipiente/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }

    recipiente_edit(_id,paciente){   
        let mkid = _id;  
        let params = JSON.stringify(paciente);
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/recipiente/' + mkid, params, {headers: headers}).map(
            res => res.json()
            );
    }    
}
