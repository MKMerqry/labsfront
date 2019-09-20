import { Cfg } from '../../../_config/gral.config';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HTMLfuctions } from '../../../_functions/html.fuctions';
import Swal from 'sweetalert2';

import { EstudioService } from '../../../_services/lab/estudio.service';

declare var $: any;


@Component({
  selector: 'app-estudio',
  templateUrl: './list.estudio.component.html',
  providers: [EstudioService]
})
export class EstudioListComponent implements OnInit, AfterViewInit {
  public devEmpresa: string;
  public formatoFecha: string;
  public classEstatus: string;
	public title: string;
  public estudiolst: string[];
    
  constructor(
    private datePipe: DatePipe,
    private _estudioService: EstudioService

  ) { 
     this.formatoFecha = Cfg.formatoFecha;
    this.title="Lista de Estudios";
 
  }

  ngOnInit() {
    console.log('01 Componente estudio OnInit');
    this.getestudio();	
  }


  mk_getBottonClass(status){
    return HTMLfuctions.getEstatusClass(status);
  }

  ngAfterViewInit() {
  }

  getestudio() {
      this._estudioService.estudio_list().subscribe(
        response => {
          if (response.estudio) {
            this.estudiolst = response.estudio;

            $( document ).ready(function() {
              $('#dtbl_estudio').DataTable({
                  pageLength: 10,
                  fixedHeader: true,
                  responsive: true,
                  "sDom": 'rtip',
                  columnDefs: [{
                      targets: 'no-sort',
                      orderable: false
                  }]
              });
  
              var table = $('#dtbl_estudio').DataTable();
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
