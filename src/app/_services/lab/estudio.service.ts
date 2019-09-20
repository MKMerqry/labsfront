
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class EstudioService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    estudio_test () {
        return "estudio de servicio ";
    }


	estudio_list(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/estudio', {headers: headers}).map(
            res => res.json()
            ); 
    }
 
    estudio_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/estudio/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }    
    
   estudio_new(paciente){
    let params = JSON.stringify(paciente); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/estudio/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }

    estudio_edit(paciente,_id){   
        let mkid = _id;  
        let params = JSON.stringify(paciente);
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/estudio/' + mkid, params, {headers: headers}).map(
            res => res.json()
            );
    }    
}
