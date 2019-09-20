import { Cfg } from '../../../_config/gral.config';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HTMLfuctions } from '../../../_functions/html.fuctions';
import Swal from 'sweetalert2';

import { PruebaService } from '../../../_services/lab/prueba.service';

declare var $: any;


@Component({
  selector: 'app-prueba',
  templateUrl: './list.prueba.component.html',
  providers: [PruebaService]
})
export class PruebaListComponent implements OnInit, AfterViewInit {
  public devEmpresa: string;
  public formatoFecha: string;
  public classEstatus: string;
	public title: string;
  public pruebalst: string[];
    
  constructor(
    private datePipe: DatePipe,
    private _pruebaService: PruebaService

  ) { 
     this.formatoFecha = Cfg.formatoFecha;
    this.title="Lista de Pruebas";
 
  }

  ngOnInit() {
    console.log('01 Componente pruebas OnInit');
    this.getpruebas();	
  }


  mk_getBottonClass(status){
    return HTMLfuctions.getEstatusClass(status);
  }

  ngAfterViewInit() {
  }

  getpruebas() {
      this._pruebaService.prueba_list().subscribe(
        response => {
          if (response.prueba) {
            this.pruebalst = response.prueba;
            $( document ).ready(function() {
              $('#dtbl_prueba').DataTable({
                  pageLength: 10,
                  fixedHeader: true,
                  responsive: true,
                  "sDom": 'rtip',
                  columnDefs: [{
                      targets: 'no-sort',
                      orderable: false
                  }]
              });
  
              var table = $('#dtbl_prueba').DataTable();
              $('#key-search').on('keyup', function() {
                  table
                      .search(this.value)
                      .draw();
              });
  
              $('#type-filter').on('change', function() {
                  table.column(5).search($(this).val()).draw();
              });
          });            
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
