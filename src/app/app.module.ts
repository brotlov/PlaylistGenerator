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
import {MatChipsModule} from '@angular/material/chips';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';


import { AppComponent } from './app.component';
import { SpotifyComponent } from './spotify/spotify.component';
import { AppleComponent } from './apple/apple.component';
import { LoginComponent } from './login/login.component';
import { DialogComponent } from './dialog/dialog.component';

import { PlaylistParametersService } from './services/playlist-parameters.service';
import { AccessTokenService } from './services/access-token.service';
import {HttpServiceService} from "./services/http-service.service";
import {PlaylistTracksService} from "./services/playlist-tracks.service";

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
    LoginComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSliderModule,
    MatTableModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatMenuModule,
    MatSortModule,
    MatChipsModule,
    MatInputModule,
    MatPaginatorModule,
    MatTabsModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  entryComponents: [DialogComponent],
  providers: [PlaylistParametersService, AccessTokenService,HttpServiceService,PlaylistTracksService],
  bootstrap: [AppComponent]
})
export class AppModule { }
