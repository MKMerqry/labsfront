import { Cfg } from '../../../_config/gral.config';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HTMLfuctions } from '../../../_functions/html.fuctions';
import Swal from 'sweetalert2';

import { RecipienteService } from '../../../_services/lab/recipiente.service';

declare var $: any;


@Component({
  selector: 'app-paciente',
  templateUrl: './list.recipiente.component.html',
  providers: [RecipienteService]
})
export class RecipienteListComponent implements OnInit, AfterViewInit {
  public devEmpresa: string;
  public formatoFecha: string;
  public classEstatus: string;
	public title: string;
  public recipientelst: string[];
    
  constructor(
    private datePipe: DatePipe,
    private _recipienteService: RecipienteService

  ) { 
     this.formatoFecha = Cfg.formatoFecha;
    this.title="Lista de Recipientes";
 
  }

  ngOnInit() {
    console.log('01 Componente recipiente OnInit');
    this.getrecipientes();	
  }


  mk_getBottonClass(status){
    return HTMLfuctions.getEstatusClass(status);
  }

  ngAfterViewInit() {  
  }

  getrecipientes() {
      this._recipienteService.recipiente_list().subscribe(
        response => {
          if (response.recipientes) {
            this.recipientelst = response.recipientes;

            $( document ).ready(function() {
              console.log( "ready!" );
              $('#dtbl_recipientes').DataTable({
                  pageLength: 10,
                  fixedHeader: true,
                  responsive: true,
                  "sDom": 'rtip',
                  columnDefs: [{
                      targets: 'no-sort',
                      orderable: false
                  }]
              });
  
              var table = $('#dtbl_recipientes').DataTable();
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
