import { Cfg } from '../../../_config/gral.config';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HTMLfuctions } from '../../../_functions/html.fuctions';
import Swal from 'sweetalert2';

import { UpfileService } from '../../../_services/lab/upfile.service';

declare var $: any;


@Component({
  selector: 'app-upresultadolist',
  templateUrl: './list.upresultado.component.html',
  providers: [UpfileService]
})
export class UpResultadoListComponent implements OnInit, AfterViewInit {
  public devEmpresa: string;
  public formatoFecha: string;
  public classEstatus: string;
	public title: string;
  public upfilelst: string[];
    
  constructor(
    private datePipe: DatePipe,
    private _upfileService: UpfileService

  ) { 
     this.formatoFecha = Cfg.formatoFecha;
    this.title="Lista de Archivos";
 
  }

  ngOnInit() {
    console.log('01 Componente pruebas OnInit');
    this.getfilelist();	
  }


  mk_getBottonClass(status){
    return HTMLfuctions.getEstatusClass(status);
  }

  ngAfterViewInit() {
  }

  getfilelist() {
      this._upfileService.upfile_list().subscribe(
        response => {
          if (response.upfile) {
            this.upfilelst = response.upfile;

            $( document ).ready(function() {
              $('#dtbl_upfilelst').DataTable({
                  pageLength: 10,
                  fixedHeader: true,
                  responsive: true,
                  "sDom": 'rtip',
                  columnDefs: [{
                      targets: 'no-sort',
                      orderable: false
                  }]
              });
  
              var table = $('#dtbl_upfilelst').DataTable();
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
