
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class SolicitudService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    solicitud_test () {
        return "solicitud de servicio ";
    }


	solicitud_list(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/solicitud', {headers: headers}).map(
            res => res.json()
            ); 
    }
 
    solicitud_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/solicitud/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }   

   solicitud_unod(_id){  
    let mkid=_id; 
    let headers = new Headers({'Content-Type':'application/json'});
    return this._http.get(this.url+'/solicitudD/'+mkid, {headers:headers}).map(
        res=>res.json()        
        );
} 

   solicitud_new(paciente){
    let params = JSON.stringify(paciente); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/solicitud/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }

    solicitud_edit(paciente,_id){   
        let mkid = _id;  
        let params = JSON.stringify(paciente);
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/solicitud/' + mkid, params, {headers: headers}).map(
            res => res.json()
            );
    }    
}
