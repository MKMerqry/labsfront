import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ScriptLoaderService } from '../../_services/script-loader.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
})
export class WizardComponent implements OnInit, AfterViewInit {
	public title: string;
  constructor(
    private _script: ScriptLoaderService,
  ) {
    this.title = 'Situacion Solicitud'
   }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._script.load('./assets/vendors/jquery.steps/build/jquery.steps.min.js', 'assets/js/app.min.js', 'assets/js/scripts/wizar.js');
    }

}
