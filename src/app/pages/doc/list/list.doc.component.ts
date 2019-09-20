import { Cfg } from '../../../_config/gral.config';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HTMLfuctions } from '../../../_functions/html.fuctions';
import Swal from 'sweetalert2';

import { DocService } from '../../../_services/lab/doc.service';

declare var $: any;


@Component({
  selector: 'app-doc',
  templateUrl: './list.doc.component.html',
  providers: [DocService]
})
export class DocListComponent implements OnInit, AfterViewInit {
  public devEmpresa: string;
  public formatoFecha: string;
  public classEstatus: string;
	public title: string;
  public doclst: string[];
  public listo: boolean;
    
  constructor(
    private datePipe: DatePipe,
    private _docService: DocService

  ) { 
     this.formatoFecha = Cfg.formatoFecha;
    this.title="Lista de Doctores";
    
  }

  ngOnInit() {
    this.listo=false;
    console.log('01 Componente doc OnInit');
    this.getdocs();	
  }


  mk_getBottonClass(status){
    return HTMLfuctions.getEstatusClass(status);
  }

  ngAfterViewInit() {
  }

  getdocs() {
      this._docService.doc_list().subscribe(
        response => {
          if (response.doc) {
            this.doclst = response.doc;
            $( document ).ready(function() {

              $('#dtbl_doc').DataTable({
                  pageLength: 10,
                  fixedHeader: true,
                  responsive: true,
                  "sDom": 'rtip',
                  columnDefs: [{
                      targets: 'no-sort',
                      orderable: false
                  }]
              });
              var table = $('#dtbl_doc').DataTable();
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
