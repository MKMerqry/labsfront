import { NgModule } from '@angular/core';
import { Select2Module } from 'ng2-select2';
import { NgxPrintModule } from 'ngx-print';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { LockscreenComponent } from './pages/lockscreen/lockscreen.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { Error404Component } from './pages/error-404/error-404.component';
import { Error500Component } from './pages/error-500/error-500.component';


import { PacienteListComponent } from './pages/paciente/list/list.paciente.component';

import { RecipienteListComponent } from './pages/recipiente/list/list.recipiente.component';
import { RecipienteEditComponent } from './pages/recipiente/edit/edit.recipiente.component';

import { MuestraListComponent } from './pages/muestra/list/list.muestra.component';
import { MuestraEditComponent } from './pages/muestra/edit/edit.muestra.component';

import { DeptoListComponent } from './pages/depto/list/list.depto.component';
import { DeptoEditComponent } from './pages/depto/edit/edit.depto.component';

import { DocListComponent } from './pages/doc/list/list.doc.component';
import { DocEditComponent } from './pages/doc/edit/edit.doc.component';

import { PruebaListComponent } from './pages/prueba/list/list.prueba.component';
import { PruebaEditComponent } from './pages/prueba/edit/edit.prueba.component';
import { EstudioListComponent } from './pages/estudio/list/list.estudio.component';
import { WizardComponent } from './pages/wizard/wizard.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { PagoComponent } from './pages/pago/pago.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { InvoiceComponent } from './pages/invoice/invoice.component'
import { SelectMuestraComponent } from './pages/muestra/seleccion/select.muestra.component';
import { SelectRecipComponent } from './pages/recipiente/seleccion/select.recip.component';
import { SelectResultadoComponent } from './pages/resultado/seleccion/select.resultado.component';
import { ComprobanteComponent } from './pages/comprobante/comprobante.component';
import { PacienteEditComponent } from './pages/paciente/edit/edit.paciente.component';
import { ImpResultadoComponent } from './pages/impresultado/impresultodo.component';
import { UpResultadoListComponent } from './pages/upresultado/list/list.upresultado.component';
import { UpResultadoEditComponent } from './pages/upresultado/edit/edit.upresultado.component';


import { ResultadoListComponent } from './pages/resultado/list/list.resultado.component';

import { ImpSelectMuestraComponent } from './pages/muestra/impseleccion/impselect.muestra.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';


const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {
        'path': '',
        'component': LayoutComponent,
        'children': [
            {
                path: 'index',
                component: HomeComponent
            },
            {
                path: 'logout',
                component: LogoutComponent
            },
            {
                path: 'pacienteedit/:_key',
                component: PacienteEditComponent
            },             
            {
                path: 'paciente/list',
                component: PacienteListComponent
            },
            {
                path: 'recipienteedit/:_key',
                component: RecipienteEditComponent
            },            
            {
                path: 'recipiente/list',
                component: RecipienteListComponent
            },
            {
                path: 'muestraedit/:_key',
                component: MuestraEditComponent
            },            
            {
                path: 'muestra/list',
                component: MuestraListComponent
            },
            {
                path: 'depto/list',
                component: DeptoListComponent
            },
            {
                path: 'deptoedit/:_key',
                component: DeptoEditComponent
            },
            {
                path: 'docedit/:_key',
                component: DocEditComponent
                
            },
            {
                path: 'doc/list',
                component: DocListComponent
            },
            
            {
                path: 'pruebaedit/:_key',
                component: PruebaEditComponent
            },
            {
                path: 'prueba/list',
                component: PruebaListComponent
            },
            {
                path: 'estudio/list',
                component: EstudioListComponent
            },
            {
                path: 'solicitud/new',
                component: ProductsListComponent
            },
            {
                path: 'pago/new',
                component: PagoComponent
            },
            {
                path: 'solicitud',
                component: SolicitudesComponent
            },
            {
                path: 'solicitud/:_key',
                component: InvoiceComponent
            },
            {
                path: 'situacionsol/:_key',
                component: WizardComponent
            },
            {
                path: 'selmuestra/:_key',
                component: SelectMuestraComponent
            },
            {
                path: 'selrecip/:_key',
                component: SelectRecipComponent
            },
            {
                path: 'resultado/:_key',
                component: SelectResultadoComponent
            }, 
            {
                path: 'upresultado/list',
                component: UpResultadoListComponent
            },
            
            {
                path: 'upresultadoedit/:_key',
                component: UpResultadoEditComponent
            },


        ]
    },

    {
        'path': 'login',
        'component': LoginComponent
    },
    {
        'path': 'lockscreen',
        'component': LockscreenComponent
    },
    {
        'path': 'forgot_password',
        'component': ForgotPasswordComponent
    },
    {
        'path': 'error_404',
        'component': Error404Component
    },
    {
        path: 'impresultado/:id',
        component: ImpResultadoComponent
    },
    {
        path: 'comprobante/:id',
        component: ComprobanteComponent
    },
    {
        path: 'impselmuestra/:_key',
        component: ImpSelectMuestraComponent
    },
    {
        'path': 'error_500',
        'component': ComprobanteComponent
    },
  
    {
        'path': '**',
        'redirectTo': 'error_404',
        'pathMatch': 'full'
    },
];

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    LockscreenComponent,
    ForgotPasswordComponent,
    Error404Component,
    Error500Component,

    PacienteListComponent,
    RecipienteListComponent,
    RecipienteEditComponent,
    MuestraListComponent,
    MuestraEditComponent,
    DeptoListComponent,
    DeptoEditComponent,
    LogoutComponent,
    DocListComponent,
    PruebaListComponent,
    PruebaEditComponent,
    EstudioListComponent,
    WizardComponent,
    ProductsListComponent,
    PagoComponent,
    SolicitudesComponent,
    InvoiceComponent,
    SelectMuestraComponent,
    SelectRecipComponent,
    SelectResultadoComponent,
    ComprobanteComponent,
    PacienteEditComponent,
    ImpResultadoComponent,
    UpResultadoListComponent,
    UpResultadoEditComponent,
    
    ResultadoListComponent,
    RecipienteEditComponent,
    ImpSelectMuestraComponent,
    DocEditComponent

  ],
  imports: [ 
      RouterModule.forRoot(routes), 
      FormsModule, 
      ReactiveFormsModule, 
      CommonModule, 
      BrowserModule, 
      Select2Module,
      NgxPrintModule,
      NgxBarcodeModule,
      NgxDropzoneModule
    ],
  exports: [
    RouterModule, ReactiveFormsModule, CommonModule
  ]
})

export class AppRoutingModule { }
