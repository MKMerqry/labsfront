
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class DocService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    doc_test () {
        return "paciente prueba de servicio ";
    }


	doc_list(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/doc', {headers: headers}).map(
            res => res.json()
            ); 
    }
    doc_getid(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/docid', {headers: headers}).map(
            res => res.json()
            ); 
    }    
 
    doc_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/doc/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }    
    
   doc_new(doc){
    let params =JSON.stringify(doc); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/doc/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }

    doc_edit(_id,doc){   
        let mkid = _id;  
        let params= JSON.stringify(doc);           
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/doc/' + mkid, params, {headers: headers}).map(
            res => res.json()        
            );
    }    
}
