import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesComponent } from './countries/countries.component';
import { CountryRoutingModule } from './country-routing.module';
import { SharedModule } from '../shared-module/shared-module.module';



@NgModule({
  declarations: [
    CountriesComponent
  ],
  imports: [
    CommonModule,
    CountryRoutingModule,
    SharedModule
  ]
})
export class CountryModule { }
