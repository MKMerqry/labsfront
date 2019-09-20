import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './/app.component';
import { AppRoutingModule } from './/app-routing.module';
import { LayoutModule } from './/layouts/layout.module';
import { ScriptLoaderService } from './_services/script-loader.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Select2Module } from 'ng2-select2';
import { NgxPrintModule } from 'ngx-print';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxDropzoneModule } from 'ngx-dropzone';

//import { ChartsModule } from 'ng2-charts';
//import { ChartsModule } from 'ng2-charts/ng2-charts';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Select2Module,
    NgxPrintModule,
    NgxBarcodeModule,
    NgxDropzoneModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgxPrintModule


  ],
  providers: [ScriptLoaderService, ReactiveFormsModule, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
