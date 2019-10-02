
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class CancelacionService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    cancelacion_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/cancelacion/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   } 
   cancelacion_lstdet(_id){  
    let mkid=_id; 
    let headers = new Headers({'Content-Type':'application/json'});
    return this._http.get(this.url+'/cancelacionesdet/'+mkid, {headers:headers}).map(
        res=>res.json()        
        );
}  
cancelacion_lst(_id){  
    let mkid=_id; 
    let headers = new Headers({'Content-Type':'application/json'});
    return this._http.get(this.url+'/cancelaciones/'+mkid, {headers:headers}).map(
        res=>res.json()        
        );
}  
  
}
