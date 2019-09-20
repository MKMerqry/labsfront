
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class NotiService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http){
        this.url = Cfg.BackendUrl;

    }
    notificacion_list(id) {
        var mkid = id
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/notificaciones/'+mkid, {headers:headers}).map(
            res => res.json()
            );
    }

    notificacion_update(id) {
        var mkid = id
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url+'/notificaciones/'+mkid, {headers:headers}).map(
            res => res.json()
            );
    }
}