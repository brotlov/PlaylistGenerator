import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {MatExpansionModule} from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';


import { AppComponent } from './app.component';
import { SpotifyComponent } from './spotify/spotify.component';
import { AppleComponent } from './apple/apple.component';
import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
  { path: '',      component: LoginComponent },
  { path: 'home',      component: LoginComponent },
  { path: 'login',      component: LoginComponent },
  { path: 'apple',      component: AppleComponent },
  { path: 'spotify',      component: SpotifyComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    SpotifyComponent,
    AppleComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSliderModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatExpansionModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
