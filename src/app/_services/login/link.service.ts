
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class LinkService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http){
        this.url = Cfg.BackendUrl;

    }

    link_test () {
        return "tipo prueba de servicio ";
    }


  link_list(_id){  
        let mkid=_id;
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/link/'+ mkid, {headers:headers}).map(
            res=>res.json()
            ); 
    }

    link_listd(_id){  
        let mkid=_id;
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/linkd/'+ mkid, {headers:headers}).map(
            res=>res.json()
            ); 
    }    

    link_download(_id) {
        let mkid = _id;
        //console.log(this.url+'/planactlink/download/'+ mkid);
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url + '/planactlinkdown/' +  mkid, {headers:headers}).map(
            res=>res
            ); 
    }
 
    link_new(link){
        let params =JSON.stringify(link); 
        let headers = new Headers({
              'Content-Type': 'application/json'
        });
        return this._http.post(this.url+'/planactlink/new',link).map(
            res=>res.json()
            );
        }
        perfil_lst(_id){     
            let mkid=_id;           
            //console.log(mkid);          
            let headers = new Headers({'Content-Type':'application/json'});
            return this._http.get(this.url+'/perfil/'+mkid, {headers:headers}).map(
                res=>res.json()        
                ); 
        }
}