import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCardComponent } from './shared/dashboard-card/dashboard-card.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { RouterModule } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';
import { NavbarComponent } from './navbar/navbar.component';



@NgModule({
  declarations: [
    DashboardCardComponent,
    SpinnerComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    GoogleChartsModule
  ],
  exports: [
    SpinnerComponent,
    DashboardCardComponent,
    GoogleChartsModule,
    NavbarComponent
  ]
})
export class SharedModule { }
