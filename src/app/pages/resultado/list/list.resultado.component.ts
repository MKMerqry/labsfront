import { Cfg } from '../../../_config/gral.config';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HTMLfuctions } from '../../../_functions/html.fuctions';
import Swal from 'sweetalert2';

import { MuestraService } from '../../../_services/lab/muestra.service';

declare var $: any;


@Component({
  selector: 'app-resultado',
  templateUrl: './list.resultado.component.html',
  providers: [MuestraService]
})
export class ResultadoListComponent implements OnInit, AfterViewInit {
  public formatoFecha: string;
	public title: string;
  public muestralst: string[];
    
  constructor(
    private datePipe: DatePipe,
    private _muestraService: MuestraService

  ) { 
    this.formatoFecha = Cfg.formatoFecha;
    this.title="Lista de Muestras"; 
  }

  ngOnInit() {
    console.log('01 Componente muestrassssss OnInit');
    this.getmuestras();
  }


  mk_getBottonClass(status){
    return HTMLfuctions.getEstatusClass(status);
  }

  ngAfterViewInit() {
    setTimeout(function(){  
        $( document ).ready(function() {
            $('#dtbl_muestra').DataTable({
                pageLength: 10,
                fixedHeader: true,
                responsive: true,
                "sDom": 'rtip',
                columnDefs: [{
                    targets: 'no-sort',
                    orderable: false
                }]
            });

            var table = $('#dtbl_muestra').DataTable();
            $('#key-search').on('keyup', function() {
                table
                    .search(this.value)
                    .draw();
            });

            $('#type-filter').on('change', function() {
                table.column(5).search($(this).val()).draw();
            });
        });
    },900);
    
  }

  getmuestras() {
      this._muestraService.muestra_list().subscribe(
        response => {
          if (response.muestra) {
            this.muestralst = response.muestra;
            //console.log(this.muestralst);
          }
        },
        error => {
          var errorMessage = <any>error;
          if (errorMessage != null) {
            var mkerrores =JSON.parse(error._body);
            Swal.fire('MerQry', mkerrores.message, 'error');
          }
        });
    }


}
