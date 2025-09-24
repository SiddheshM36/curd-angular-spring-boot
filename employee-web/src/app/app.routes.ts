import { Routes } from '@angular/router';
import { HomeComponent } from './employee/home/home.component';

export const routes: Routes = [
    {path:"", component:HomeComponent},
    {path:"employee", redirectTo:"",pathMatch:"full"},
    {path:"", redirectTo:"",pathMatch:"full"}
];
