import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Subject }    from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css']
})
export class SpotifyComponent implements OnInit {

  playlistName: string;
  userData: any;
  errorMessage: string;
  newArtist: string;
  newArtistChanged: Subject<string> = new Subject<string>();
  loading = false;
  loadingPlaylist = false;
  access_token: string;
  responseData: any;
  apiBaseUrl = "https://api.spotify.com/v1/search?";
  public genreList = [
      {Name: "Pop", IsSelected: false},
      {Name: "Dance Pop", IsSelected: false},
      {Name: "Pop Rap", IsSelected: false},
      {Name: "Rap", IsSelected: false},
      {Name: "Post-teen pop", IsSelected: false},
      {Name: "Tropical House", IsSelected: false},
      {Name: "Modern Rock", IsSelected: false},
      {Name: "Trap Music", IsSelected: false},
      {Name: "Dwn Trap", IsSelected: false},
      {Name: "Southern Hip Hop", IsSelected: false},
      {Name: "Hip Hop", IsSelected: false},
      {Name: "EDM", IsSelected: false},
      {Name: "Latin", IsSelected: false},
      {Name: "Pop Rock", IsSelected: false},
      {Name: "R&N", IsSelected: false},
      {Name: "Alternative Rock", IsSelected: false},
      {Name: "Neo Mellow", IsSelected: false},
      {Name: "Classic Rock", IsSelected: false},
      {Name: "Mellow Gold", IsSelected: false}
  ]
  public artistSearchResults = [];
  public selectedArtists = [];
  public selectedGenres = [];

  constructor(private activatedRoute: ActivatedRoute,private router: Router,private http: Http) {
   
    this.newArtistChanged
        .debounceTime(1000) // wait 1 sec after the last event before emitting last event
        .distinctUntilChanged() // only emit if value is different from previous value
        .subscribe(model => {
          this.newArtist = model;
          // Call your function which calls API or do anything you would like do after a lag of 1 sec
          this.loading = true;
          let headers = new Headers();
          headers.append('Content-Type', 'application/json');
          headers.append('Authorization', `Bearer ${this.access_token}`);
          let options = new RequestOptions({ headers: headers });
          var url = this.apiBaseUrl + "q=" + this.newArtist.replace(" ", "%20") + "&type=artist";
          if (this.newArtist != ""){
            
            http.get(url, options)
            .subscribe(response => {
                if (response.json().artists.items.length == 0){
                  this.errorMessage = "There were no matches found. Please try again";
                  this.artistSearchResults = [];
                }else{
                  this.errorMessage = "";
                  this.artistSearchResults = response.json().artists.items;
                  console.log(this.artistSearchResults);
                }
                this.loading = false;
              });
          }else{
            this.artistSearchResults = [];
            this.loading = false;
          }
        });
    }
   

  ngOnInit() {
    // this.access_token = this.activatedRoute.snapshot.queryParams["access_token"];
    this.access_token = "BQC9_yTTE_KOCcrag7lRdexculnLmwRGEO0c-vBQBbrkCYlp7h7_n5c4BVCSyI2q4ncBmfnvk2Cx8Wq771_QifRb-R4yzoHZvRN-j63z8dCwAdceG86f6yZujH2o0dH70hsnH4QZf_w7B-XlGPSd1N8IwrDAs8fb0Z2fueb4Sg2Bnc5aIJjaCciTifAU5H8PQ3jzc0hWkbQV8t-l5sIR0oT_MhKN3xCvn7s8-EapEY6KOw";
    var url = 'https://api.spotify.com/v1/me';
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.access_token}`);
    let options = new RequestOptions({ headers: headers });
    // use the access token to access the Spotify Web API
    this.http.get(url, options)
      .subscribe(response => {
        this.userData = response.json();
        this.loading = false;
      });
    // if (access_token == undefined){
    //   this.router.navigate(['/login'])
    // }
  }

  onFieldChange(query:string){
    this.newArtistChanged.next(query);
  }
  addArtist(artist){
    this.selectedArtists.push(artist);
  }
  toggleGenre(genre){
    genre.IsSelected = !genre.IsSelected;
    if(this.selectedGenres.indexOf(genre) !== -1) {
      this.selectedGenres.splice(this.selectedGenres.indexOf(genre), 1);
    }else{
      this.selectedGenres.push(genre);
    }
  }
  generatePlaylist(){
    var playlistId = "";
    var numberOfTracks = 20;
    var selectedTracks = {"uris":[]};
    var newPlaylistOptions = {
      Genre: this.selectedGenres
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.access_token}`);
    let options = new RequestOptions({ headers: headers });
    this.loadingPlaylist = true;
    var url = this.apiBaseUrl + "q=genre:" + newPlaylistOptions.Genre[0].Name + "&type=track";
    var url2 = "https://api.spotify.com/v1/users/" + this.userData.id + "/playlists"
    
    this.http.get(url, options)
      .subscribe(response => {
          response.json().tracks.items.forEach(element => {
            var trackToAdd = {
              id: element.id,
              name: element.name,
              artist: element.artists[0].name
            }
            selectedTracks.uris.push("spotify:track:" + trackToAdd.id);
          })
          var data = {
          "name": this.playlistName
          }
          var data2 = {
            "uris": selectedTracks.uris
          }
          this.http.post(url2, JSON.stringify(data), options)
          .subscribe(response => {
            var url3 = "https://api.spotify.com/v1/users/" + this.userData.id + "/playlists/" + response.json().id + "/tracks"
            this.http.post(url3, JSON.stringify(data2), options)
            .subscribe(response => {
              this.loadingPlaylist = false;
              console.log(response.json());
            })
          })
      });
  }
}