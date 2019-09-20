
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class UpfileService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    upfile_test () {
        return "banco de servicio ";
    }

    upfile_list(){  
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/upfile/list', {headers:headers}).map(
            res=>res.json()        
            );
   }


   upfile_uno(_id){  
        let mkid=_id;
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/upfile/'+ mkid, {headers:headers}).map(
            res=>res.json()
            ); 
    }

    upfile_spupdate(_id){  
        let mkid=_id;
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/upfileupdate/'+ mkid, {headers:headers}).map(
            res=>res.json()
            ); 
    }
  

    upfile_listd(_id){  
        let mkid=_id;
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/upfiled/'+ mkid, {headers:headers}).map(
            res=>res.json()
            ); 
    } 

}
