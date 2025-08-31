import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app'; // From app.ts
import { HomeComponent } from './home/home';
import { PreemptiveComponent } from './preemptive/preemptive';
import { NonPreemptiveComponent } from './nonpreemptive/nonpreemptive';

import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PreemptiveComponent,
    NonPreemptiveComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
