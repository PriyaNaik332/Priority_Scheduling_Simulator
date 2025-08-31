import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { PreemptiveComponent } from './preemptive/preemptive';
import { NonPreemptiveComponent } from './nonpreemptive/nonpreemptive';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'preemptive', component: PreemptiveComponent },
  { path: 'nonpreemptive', component: NonPreemptiveComponent }
];
