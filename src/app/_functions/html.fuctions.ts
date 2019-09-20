'use strict'
//import * as $ from "jquery";


declare var toastr: any;
declare var jQuery:any;
declare var $:any;
declare var Clipboard:any;

export class HTMLfuctions {
    static getEstatusClass(mk_estatus){
        let Estatus =mk_estatus;

        if (Estatus == "CONCLUIDO"){
            return 'badge badge-success badge-pill';
        } else if (Estatus == "INACTIVO") {
            return 'badge badge-danger badge-pill';
        } else if (Estatus == "ACTIVO") {
            return 'badge badge-warning badge-pill';
        } else if (Estatus == "PENDIENTE") {
            return 'badge badge-primary badge-pill';
        } else if (Estatus == "Determinacion") {
            return 'badge badge-success badge-pill';
        } else if (Estatus == "Etiqueta") {
            return 'badge badge-warning badge-pill';                        
        } else {
            return 'badge badge-secondary badge-pill';
        }
    }

    static gettituloClass(evalor){     
        
        let valor =evalor;
        if ( valor=="" || valor==null) {
            return "font-extra-bold";
          } else {
            return "";
          } 
    }

    static getcapturaClass(emin,evalor,emax){

        let min =emin;
        let valor =evalor;
        let max =emax;
        if ( valor=="" || valor==null) {
            return "";
          } else {
            if ( valor > 0 &&  valor > max) {
              return "font-extra-bold text-danger";
            } else if  (  valor > 0 && valor < min) {
              return "font-extra-bold text-danger";
              
            } else if ( valor >= 0 && ( valor >= min || valor <= max)) {
              return "";
            } 
          } 
    }
    static getcapturacellClass(emin,evalor,emax){
      var min : number;
      var valor : number;
      var max : number;
      min =parseInt(emin);
      valor = parseInt(evalor);
      max =parseInt(emax);

      if ( valor == 0 || valor==null) {
          return "ok";
        } else {
          if ( valor > 0 &&  valor > max) {
            return "cuidado";
          } else if  (  valor > 0 && valor < min) {
            return "cuidado";
            
          } else if ( valor >= 0 && ( valor >= min || valor <= max)) {
            return "ok";
          } 
        } 
  }
   
}