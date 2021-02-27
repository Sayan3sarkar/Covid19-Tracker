import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { CountriesComponent } from "./countries/countries.component";

const authRoutes: Routes = [
    { path: '', component: CountriesComponent}
];

@NgModule({
    imports: [RouterModule.forChild(authRoutes)],
    exports: [RouterModule]
})
export class CountryRoutingModule{}