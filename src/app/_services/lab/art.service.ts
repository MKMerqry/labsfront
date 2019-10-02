
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class ArticuloService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    art_test () {
        return "estudio de servicio ";
    }


	art_list(_id){   
        let mkid=_id;            
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/art/'+mkid ,{headers: headers}).map(
            res => res.json()
            ); 
    }

    art_list2(_id){     
        let mkid=_id;           
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/art2/'+mkid, {headers: headers}).map(
            res => res.json()
            ); 
    }
    art_list_topthen(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/artic', {headers: headers}).map(
            res => res.json()
            ); 
    }
 
    art_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/art/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }    
    
   art_etiq_list(_id){  
    let mkid=_id; 
    let headers = new Headers({'Content-Type':'application/json'});    
    return this._http.get(this.url+'/arteti/'+mkid, {headers:headers}).map(
        res=>res.json()        
        );
}  

   art_new(paciente){
    let params = JSON.stringify(paciente); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/art/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }

    art_edit(paciente,_id){   
        let mkid = _id;  
        let params = JSON.stringify(paciente);
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/art/' + mkid, params, {headers: headers}).map(
            res => res.json()
            );
    }    
}
