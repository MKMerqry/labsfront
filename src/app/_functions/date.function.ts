'use strict'
declare var toastr: any;
declare var jQuery:any;
declare var $:any;
declare var Clipboard:any;

export class Datefuctions {
    static getFechaSinHora(mk_fecha){
        let FechaVar = new Date(mk_fecha);
        let month = String(FechaVar.getMonth() + 1);
        let day = String(FechaVar.getDate());
        const year = String(FechaVar.getFullYear());          
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${day}/${month}/${year}`;

        }
    static getFechaSinHora_ymd(mk_fecha){
            let FechaVar = new Date(mk_fecha);
            let month = String(FechaVar.getMonth() + 1);
            let day = String(FechaVar.getDate());
            const year = String(FechaVar.getFullYear());
              
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
              
            return `${year}-${month}-${day}`;
    
        }
    static getFechaSoloHora(mk_fecha){

                let FechaVar = new Date(mk_fecha);
                let hora = String(FechaVar.getHours());
                let minuto = String(FechaVar.getMinutes());

                  
                if (hora.length < 2) hora = '0' + hora;
                if (minuto.length < 2) minuto = '0' + minuto;
                  
                return `${hora}:${minuto}`;
        
        }
}