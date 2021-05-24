import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule} from "@angular/forms";
import { RouterModule } from '@angular/router';

//Firebase
import { AngularFirestoreModule,FirestoreSettingsToken } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFireAuth } from '@angular/fire/auth';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//Moje komponente
import { AppComponent } from './app.component';
import { PregledComponent } from './pregled/pregled.component';
import { TureComponent } from './ture/ture.component';
import { UnosComponent } from './unos/unos.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { GostiComponent } from './gosti/gosti.component';
import { ZaradaComponent } from './zarada/zarada.component';
import { PlacaComponent } from './placa/placa.component';
import { BaksisComponent } from './baksis/baksis.component';
import { SlikeComponent } from './slike/slike.component';
import { VoznjaComponent } from './voznja/voznja.component';
import { KolegeComponent } from './kolege/kolege.component';
import { IzvlacenjaComponent } from './izvlacenja/izvlacenja.component';
import { DupleComponent } from './duple/duple.component';
import { GostiPoTuriComponent } from './gostiPoTuri/gostiPoTuri.component';
import { ZaradaPoTuriComponent } from './zaradaPoTuri/zaradaPoTuri.component';


@NgModule({
  declarations: [
    AppComponent,
    PregledComponent,
    TureComponent,
    UnosComponent,
    PrijavaComponent,
    ZaradaComponent,
    GostiComponent,
    PlacaComponent,
    BaksisComponent,
    SlikeComponent,
    VoznjaComponent,
    KolegeComponent,
    IzvlacenjaComponent,
    DupleComponent,
    GostiPoTuriComponent,
    ZaradaPoTuriComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {path:"menu",component:PregledComponent},
      {path:"prijava",component:PrijavaComponent},
      {path:"ture",component:TureComponent},
      {path:"unos",component:UnosComponent},
      {path:"zarada",component:ZaradaComponent},
      {path:"gosti",component:GostiComponent},
      {path:"placa",component:PlacaComponent},
      {path:"baksis",component:BaksisComponent},
      {path:"slike",component:SlikeComponent},
      {path:"voznja",component:VoznjaComponent},
      {path:"kolege",component:KolegeComponent},
      {path:"izvlacenja",component:IzvlacenjaComponent},
      {path:"duple",component:DupleComponent},
      {path:"gostiPoTuri",component:GostiPoTuriComponent},
      {path:"zaradaPoTuri",component:ZaradaPoTuriComponent},
    ]),
    AngularFireModule.initializeApp(environment.firebase, 'trips2019'),
    AngularFirestoreModule,   
    NgbModule

  ],
  providers: [{ provide: FirestoreSettingsToken, useValue: {} },AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
