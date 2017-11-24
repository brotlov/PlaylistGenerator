import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css']
})
export class SpotifyComponent implements OnInit {

  public users = [
    { name: 'Jilles', age: 21 },
    { name: 'Todd', age: 24 },
    { name: 'Lisa', age: 18 }
  ];

  public genreList = [
      {Name: "Pop", IsSelected: false},
      {Name: "Dance Pop", IsSelected: false},
      {Name: "Pop Rap", IsSelected: false},
      {Name: "Rap", IsSelected: false},
      {Name: "Post-teen pop", IsSelected: false},
      {Name: "Tropical House", IsSelected: false},
      {Name: "Modern Rock", IsSelected: false},
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

  constructor() { }

  ngOnInit() {
    
  }

}
