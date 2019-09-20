
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Cfg } from './../../_config/gral.config';

@Injectable()


export class PacienteService {
    public url: string;
    public identity: string;
    public token: string;

    constructor( private _http: Http) {
        this.url = Cfg.BackendUrl;
    }

    paciente_test () {
        return "paciente prueba de servicio ";
    }


	paciente_list(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/paciente', {headers: headers}).map(
            res => res.json()
            ); 
    }
    paciente_getid(){               
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/pacienteid', {headers: headers}).map(
            res => res.json()
            ); 
    }
    paciente_uno(_id){  
        let mkid=_id; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'/paciente/'+mkid, {headers:headers}).map(
            res=>res.json()        
            );
   }    
    
   


   paciente_new(paciente){
    let params =JSON.stringify(paciente); 
    let headers = new Headers({
          'Content-Type': 'application/json'
    });
    return this._http.post(this.url+'/paciente/new',params,{headers:headers}).map(
        res=>res.json()
        );
    }

    paciente_newexpress(paciente){
        let params =JSON.stringify(paciente); 
        let headers = new Headers({
              'Content-Type': 'application/json'
        });
        return this._http.post(this.url+'/pacienteexpress/new',params,{headers:headers}).map(
            res=>res.json()
            );
        }

    paciente_edit(_id,paciente){   
        let mkid = _id;  
        let params= JSON.stringify(paciente);           
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url + '/paciente/' + mkid, params, {headers: headers}).map(
            res => res.json()        
            );
    }    
}
