
import { Component, OnInit, AfterViewInit, OnDestroy, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Cfg } from './../../_config/gral.config';


import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent implements OnInit, AfterViewInit, OnDestroy {

	public devEmpresa: string;

	




  constructor(
    private _route: ActivatedRoute,
    private _router: Router

  ) {

	
  }

	ngOnInit() {		
		console.log('Componente Logout iniciado');
		Swal.fire({
			title: '¿Quieres salir del sistema?',
			text: 'MerQry',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, Seguro',
			cancelButtonText: 'No, gracias'
		}).then((result) => {
			if (result.value) {
				Swal.fire('MerQry',
					'Su sesion sera crerrada',
					'success'
				)
				localStorage.clear();
				this._router.navigate(['']);
			// For more information about handling dismissals please visit
			// https://sweetalert2.github.io/#handling-dismissals
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				Swal.fire(
					'MerQry',
					'la accion sera cancelado',
					'success'
				)
				this._router.navigate(['index']);
			}
		})

	}
	ngAfterViewInit() {		
  	}

  	ngOnDestroy() {		
  	}
}
