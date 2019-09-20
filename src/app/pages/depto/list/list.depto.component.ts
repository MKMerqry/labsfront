import { Cfg } from '../../../_config/gral.config';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2';

import { DeptoService } from '../../../_services/lab/depto.service';

declare var $: any;


@Component({
  selector: 'app-paciente',
  templateUrl: './list.depto.component.html',
  providers: [DeptoService]
})
export class DeptoListComponent implements OnInit, AfterViewInit {
  public devEmpresa: string;
  public formatoFecha: string;
  public classEstatus: string;
	public title: string;
  public deptolst: string[];
  public listo: boolean;
    
  constructor(
    private _deptoService: DeptoService

  ) { 
     this.formatoFecha = Cfg.formatoFecha;
    this.title="Lista de Departamentos";
    
  }

  ngOnInit() {
    this.listo=false;
    console.log('01 Componente depto OnInit');
    this.getdeptos();	
  }


  ngAfterViewInit() {
  }
  
  getdeptos() {
      this._deptoService.depto_list().subscribe(
        response => {
          if (response.depto) {
            this.deptolst = response.depto;

            $( document ).ready(function() {

              $('#dtbl_depto').DataTable({
                  pageLength: 10,
                  fixedHeader: true,
                  responsive: true,
                  "sDom": 'rtip',
                  columnDefs: [{
                      targets: 'no-sort',
                      orderable: false
                  }]
              });
              var table = $('#dtbl_depto').DataTable();
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
