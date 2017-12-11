import { Component, OnInit, HostListener } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Subject }    from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css']
})

export class SpotifyComponent implements OnInit {

  access_token: string;
  refresh_token: string;
  searchTerm: string;
  searchTermChanged: Subject<string> = new Subject<string>();
  searchActive = false;
  searchResults = new Array();
  searchLoading = false;

  constructor(private activatedRoute: ActivatedRoute,private router: Router,private http: Http) {
    this.searchTermChanged
        .debounceTime(1000) // wait 1s after the last event before emitting last event
        .distinctUntilChanged() // only emit if value is different from previous value
        .subscribe(searchTerm => {
          var url = "https://api.spotify.com/v1/search?q=" + searchTerm.replace(" ", "%20") + "&type=artist,track,album";
          this.searchResults = [];
          this.HttpGet(url)
          .subscribe(
            (data) => {
              data.json().artists.items.forEach(result => {
                var newResult = {
                    Name: "",
                    Type: "",
                    Image: ""
                  };
                  newResult.Name = result.name;
                  if (result.images.length > 0){
                    newResult.Image = result.images[0].url;
                  }
                  newResult.Type = result.type;
                  this.searchResults.push(newResult);
              });
              data.json().albums.items.forEach(result => {
                var newResult = {
                    Name: "",
                    Type: "",
                    Image: ""
                  };
                  newResult.Name = result.name;
                  if (result.images.length > 0){
                    newResult.Image = result.images[0].url;
                  }
                  newResult.Type = result.type;
                  this.searchResults.push(newResult);
              });
              data.json().tracks.items.forEach(result => {
                var newResult = {
                    Name: "",
                    Type: "",
                    Image: ""
                  };
                  newResult.Name = result.name;
                  if (result.images != undefined && result.images.length > 0){
                    newResult.Image = result.images[0].url;
                  }
                  newResult.Type = result.type;
                  this.searchResults.push(newResult);
                console.log(this.searchResults);
              });
              this.searchLoading = false;
            },
            (error) => {
              this.ErrorHander(url, "", error);
            });
        });
    }

  ngOnInit() {
    this.refresh_token = this.activatedRoute.snapshot.queryParams["refresh_token"];
    this.access_token = this.activatedRoute.snapshot.queryParams["access_token"];
    // this.access_token = "BQDdk2j0DaxcuT-czb4JDlOAO3HGhrdRb90gzLdnIFqTNrGNlijzgYsL1bWxUMWNId4LTsjJsD6SEd1c-lK20IfuEdg_83qfaFdhwZeMBDrGpjFVZk1JFDYm6cCXU9Czg6L0fnemK4oGuoAE9zyf4J1CSKBJv9-h35ir0wcWfc6n-8y99w-mmETEow3XdHuvt3FVF8YlVCdgcNFXi_QJw8uY8yuumDjuRS6YDidQjbgdI-Yk";
    // this.refresh_token = "AQCtfoph_XvPHNVSFZiPBNoYPHMlVjPyMEa2_eKLaaEgz5pL-UWucBNDaXXUyd6W-ClQki9FIEnhtDKcKnKKGxnyct65_XAQcuUbysWOWabhrJcd_PCn2dOaRzzaGhaH27I";
  }
  
  activateSearch(){
    this.searchActive = true;
  }

  clickedInside($event: Event){
    $event.preventDefault();
    $event.stopPropagation();
    this.searchActive = true;
    console.log("hit");
  }

  @HostListener('document:click', ['$event']) clickedOutside($event){
    console.log(this.searchTerm)
    if(this.searchTerm == "" || this.searchTerm == undefined){
      if (this.searchActive){
        this.searchActive = false;
      }
    }
  }

  changed(text: string) {
    this.searchLoading = true;
    this.searchTermChanged.next(text);
  }

  public HttpGet(url){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.access_token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options) 
  }

  public HttpPost(url, data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.access_token}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, options, data);
  }

  public ErrorHander(url, data, error){
    var errorCode = error.json().error.status;
    switch(errorCode){
      case 401:
        data = {
          refresh_token: this.refresh_token
        } 
        this.router.navigateByUrl("/refresh_token?access_token=" + this.access_token + "refresh_token=" + this.refresh_token)
    }
  }

  addToAdditions(object){
    console.log(object);
  }

  openAdvancedoptions(object){
    console.log(object);
  }

}