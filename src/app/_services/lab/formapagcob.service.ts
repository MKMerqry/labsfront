
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class FormaPagCobService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    formapagcob_test () {
        return "paciente prueba de servicio ";
    }


	formapagcob_list(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/formapagcob', {headers: headers}).map(
            res => res.json()
            ); 
    }
 
    formapagcob_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/formapagcob/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }    
    
   formapagcob_new(doc){
    let params =JSON.stringify(doc); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/formapagcob/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }

    formapagcob_edit(doc,_id){   
        let mkid = _id;  
        let params= JSON.stringify(doc);           
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/formapagcob/' + mkid, params, {headers: headers}).map(
            res => res.json()        
            );
    }    
}
