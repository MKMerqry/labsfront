import { HTMLfuctions } from './../../../_functions/html.fuctions';
import { Cfg } from '../../../_config/gral.config';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

import { PacienteService } from '../../../_services/lab/paciente.service';

declare var $: any;


@Component({
  selector: 'app-paciente',
  templateUrl: './list.paciente.component.html',
  providers: [PacienteService]
})
export class PacienteListComponent implements OnInit, AfterViewInit {
  public devEmpresa: string;
  public formatoFecha: string;
  public classEstatus: string;
	public title: string;
  public pacientelst: string[];
  public listo: boolean;
    
  constructor(
    private datePipe: DatePipe,
    private _pacienteService: PacienteService

  ) { 
     this.formatoFecha = Cfg.formatoFecha;
    this.title="Lista de Pacientes";
    
  }

  ngOnInit() {
    this.listo=false;
    console.log('01 Componente proyecto OnInit');
    this.getpacientes();	
  }


  mk_getBottonClass(status){
    return HTMLfuctions.getEstatusClass(status);
  }

  ngAfterViewInit() {
  }

  getpacientes() {
      this._pacienteService.paciente_list().subscribe(
        response => {
          if (response.pacientes) {
            this.pacientelst = response.pacientes;

            $( document ).ready(function() {

              $('#dtbl_pacientes').DataTable({
                  pageLength: 10,
                  fixedHeader: true,
                  responsive: true,
                  "sDom": 'rtip',
                  columnDefs: [{
                      targets: 'no-sort',
                      orderable: false
                  }]
              });
              var table = $('#dtbl_pacientes').DataTable();
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
