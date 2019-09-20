
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class WfEstadoService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }


    wfestado_edit(wf,_id){   
        let mkid = _id;  
        //console.log(wf);
        let params = JSON.stringify(wf);
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/wfestado/' + mkid, params, {headers: headers}).map(
            res => res.json()
            );
    }    
}
