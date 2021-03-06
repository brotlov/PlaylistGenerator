import { Component, OnInit, HostListener, ViewChild, ChangeDetectorRef  } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Subject }    from 'rxjs/Subject';
import {debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DialogComponent} from '../dialog/dialog.component';
import {MatSnackBar} from '@angular/material';
import {playlistParameterList} from '../models/playlistParameterList';
import {playlistParameter} from '../models/playlistParameter';
import {playlistTrack} from '../models/playlistTrackModel';
import {playlistTrackList} from '../models/playlistTrackModel';
import {PlaylistParametersService} from '../services/playlist-parameters.service';
import {PlaylistTracksService} from '../services/playlist-tracks.service';
import {AccessTokenService} from '../services/access-token.service';
import {Observable} from 'rxjs/Observable'
import {HttpServiceService} from '../services/http-service.service';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import {dialogObject} from '../models/dialogObject'
import {dialogObjectIndividual} from '../models/dialogObjectIndividual'

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css']
})

export class SpotifyComponent implements OnInit {

  loading = false;
  newPlaylistUrl: string;
  playlistGenerated = false;
  trackList = new playlistTrackList;
  completed = false;
  playlistName: string;
  playlistSongCount = 250;
  userData: any;
  parameters = new playlistParameterList();
  access_token: string;
  refresh_token: string;
  searchTerm: string;
  searchTermChanged: Subject<string> = new Subject<string>();
  searchActive = false;
  searchResults = new Array();
  searchLoading = false;

  displayedColumns = ['position', 'name', 'artist', 'album', 'source'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  /**
   * Set the sort after the view init since this component will
   * be able to query its view for the initialized sort.
   */
  
  public completeGenreList = [
    {Name: "pop", IsSelected: false},{Name: "dance pop", IsSelected: false},{Name: "pop rap", IsSelected: false},{Name: "rap", IsSelected: false},{Name: "post-teen pop", IsSelected: false},{Name: "tropical house", IsSelected: false},{Name: "rock", IsSelected: false},{Name: "modern rock", IsSelected: false},{Name: "trap music", IsSelected: false},{Name: "dwn trap", IsSelected: false},{Name: "southern hip hop", IsSelected: false},{Name: "hip hop", IsSelected: false},{Name: "edm", IsSelected: false},{Name: "latin", IsSelected: false},{Name: "pop rock", IsSelected: false},{Name: "r&b", IsSelected: false},{Name: "alternative rock", IsSelected: false},{Name: "neo mellow", IsSelected: false},{Name: "classic rock", IsSelected: false},{Name: "mellow gold", IsSelected: false},{Name: "album rock", IsSelected: false},{Name: "indie rock", IsSelected: false},{Name: "alternative metal", IsSelected: false},{Name: "latin pop", IsSelected: false},{Name: "post-grunge", IsSelected: false},{Name: "indie pop", IsSelected: false},{Name: "indie r&b", IsSelected: false},{Name: "viral pop", IsSelected: false},{Name: "soft rock", IsSelected: false},{Name: "reggaeton", IsSelected: false},{Name: "urban contemporary", IsSelected: false},{Name: "pop punk", IsSelected: false},{Name: "folk-pop", IsSelected: false},{Name: "singer-songwriter", IsSelected: false},{Name: "nu metal", IsSelected: false},{Name: "tropical", IsSelected: false},{Name: "permanent wave", IsSelected: false},{Name: "electro house", IsSelected: false},{Name: "indietronica", IsSelected: false},{Name: "indie folk", IsSelected: false},{Name: "gangster rap", IsSelected: false},{Name: "indie poptimism", IsSelected: false},{Name: "hard rock", IsSelected: false},{Name: "contemporary country", IsSelected: false},{Name: "country road", IsSelected: false},{Name: "rap metal", IsSelected: false},{Name: "underground hip hop", IsSelected: false},{Name: "big room", IsSelected: false},{Name: "hip pop", IsSelected: false},{Name: "folk rock", IsSelected: false},{Name: "dirty south rap", IsSelected: false},{Name: "country", IsSelected: false},{Name: "canadian pop", IsSelected: false},{Name: "garage rock", IsSelected: false},{Name: "chamber pop", IsSelected: false},{Name: "rock en espanol", IsSelected: false},{Name: "latin hip hop", IsSelected: false},{Name: "house", IsSelected: false},{Name: "grupera", IsSelected: false},{Name: "stomp and holler", IsSelected: false},{Name: "funk rock", IsSelected: false},{Name: "roots rock", IsSelected: false},{Name: "adult standards", IsSelected: false},{Name: "dance rock", IsSelected: false},{Name: "regional mexican", IsSelected: false},{Name: "new wave pop", IsSelected: false},{Name: "trap latino", IsSelected: false},{Name: "europop", IsSelected: false},{Name: "new wave", IsSelected: false},{Name: "synthpop", IsSelected: false},{Name: "blues-rock", IsSelected: false},{Name: "deep indie r&b", IsSelected: false},{Name: "latin alternative", IsSelected: false},{Name: "neo soul", IsSelected: false},{Name: "classic funk rock", IsSelected: false},{Name: "soul", IsSelected: false},{Name: "art rock", IsSelected: false},{Name: "emo", IsSelected: false},{Name: "neo-psychedelic", IsSelected: false},{Name: "alternative dance", IsSelected: false},{Name: "banda", IsSelected: false},{Name: "rap rock", IsSelected: false},{Name: "deep pop r&b", IsSelected: false},{Name: "psychedelic rock", IsSelected: false},{Name: "quiet storm", IsSelected: false},{Name: "spanish pop", IsSelected: false},{Name: "norteno", IsSelected: false},{Name: "motown", IsSelected: false},{Name: "modern country rock", IsSelected: false},{Name: "indie anthem-folk", IsSelected: false},{Name: "teen pop", IsSelected: false},{Name: "progressive electro house", IsSelected: false},{Name: "deep german hip hop", IsSelected: false},{Name: "progressive house", IsSelected: false},{Name: "reggaeton flow", IsSelected: false},{Name: "metal", IsSelected: false},{Name: "new rave", IsSelected: false},{Name: "vapor soul", IsSelected: false},{Name: "latin arena pop", IsSelected: false},{Name: "electronic", IsSelected: false},{Name: "trap francais", IsSelected: false},{Name: "regional mexican pop", IsSelected: false},{Name: "brostep", IsSelected: false},{Name: "escape room", IsSelected: false},{Name: "shimmer pop", IsSelected: false},{Name: "disco", IsSelected: false},{Name: "screamo", IsSelected: false},{Name: "funk", IsSelected: false},{Name: "crunk", IsSelected: false},{Name: "new romantic", IsSelected: false},{Name: "deep big room", IsSelected: false},{Name: "francoton", IsSelected: false},{Name: "punk", IsSelected: false},{Name: "pop reggaeton", IsSelected: false},{Name: "brill building pop", IsSelected: false},{Name: "deep tropical house", IsSelected: false},{Name: "metalcore", IsSelected: false},{Name: "acoustic pop", IsSelected: false},{Name: "focus", IsSelected: false},{Name: "electronic trap", IsSelected: false},{Name: "sertanejo universitario", IsSelected: false},{Name: "metropopolis", IsSelected: false},{Name: "hardcore hip hop", IsSelected: false},{Name: "new americana", IsSelected: false},{Name: "deep funk carioca", IsSelected: false},{Name: "jazz blues", IsSelected: false},{Name: "vocal jazz", IsSelected: false},{Name: "freak folk", IsSelected: false},{Name: "folk", IsSelected: false},{Name: "southern rock", IsSelected: false},{Name: "german hip hop", IsSelected: false},{Name: "west coast rap", IsSelected: false},{Name: "east coast hip hop", IsSelected: false},{Name: "groove metal", IsSelected: false},{Name: "ranchera", IsSelected: false},{Name: "argentine rock", IsSelected: false},{Name: "swedish pop", IsSelected: false},{Name: "boy band", IsSelected: false},{Name: "christian alternative rock", IsSelected: false},{Name: "worship", IsSelected: false},{Name: "lo-fi", IsSelected: false},{Name: "g funk", IsSelected: false},{Name: "modern blues", IsSelected: false},{Name: "chillwave", IsSelected: false},{Name: "piano rock", IsSelected: false},{Name: "soundtrack", IsSelected: false},{Name: "compositional ambient", IsSelected: false},{Name: "british blues", IsSelected: false},{Name: "talent show", IsSelected: false},{Name: "indie psych-rock", IsSelected: false},{Name: "christian music", IsSelected: false},{Name: "country rock", IsSelected: false},{Name: "new jack swing", IsSelected: false},{Name: "ccm", IsSelected: false},{Name: "vegas indie", IsSelected: false},{Name: "mpb", IsSelected: false},{Name: "rock-and-roll", IsSelected: false},{Name: "memphis soul", IsSelected: false},{Name: "deep underground hip hop", IsSelected: false},{Name: "dance-punk", IsSelected: false},{Name: "swedish idol pop", IsSelected: false},{Name: "cantautor", IsSelected: false},{Name: "noise pop", IsSelected: false},{Name: "redneck", IsSelected: false},{Name: "k-pop", IsSelected: false},{Name: "indiecoustica", IsSelected: false},{Name: "deep dutch hip hop", IsSelected: false},{Name: "electric blues", IsSelected: false},{Name: "southern soul", IsSelected: false},{Name: "protopunk", IsSelected: false},{Name: "soul blues", IsSelected: false},{Name: "cumbia pop", IsSelected: false},{Name: "melodic metalcore", IsSelected: false},{Name: "hollywood", IsSelected: false},{Name: "italian arena pop", IsSelected: false},{Name: "german pop", IsSelected: false},{Name: "outlaw country", IsSelected: false},{Name: "detroit hip hop", IsSelected: false},{Name: "deep german pop rock", IsSelected: false},{Name: "christian rock", IsSelected: false},{Name: "bass trap", IsSelected: false},{Name: "glam metal", IsSelected: false},{Name: "pagode", IsSelected: false},{Name: "korean pop", IsSelected: false},{Name: "grime", IsSelected: false},{Name: "deep australian indie", IsSelected: false},{Name: "deep groove house", IsSelected: false},{Name: "britpop", IsSelected: false},{Name: "anthem worship", IsSelected: false},{Name: "moombahton", IsSelected: false},{Name: "dream pop", IsSelected: false},{Name: "deep house", IsSelected: false},{Name: "chicago soul", IsSelected: false},{Name: "deep pop edm", IsSelected: false},{Name: "glam rock", IsSelected: false},{Name: "alternative hip hop", IsSelected: false},{Name: "underground pop rap", IsSelected: false},{Name: "tracestep", IsSelected: false},{Name: "scorecore", IsSelected: false},{Name: "funk metal", IsSelected: false},{Name: "italian pop", IsSelected: false},{Name: "traditional country", IsSelected: false},{Name: "trip hop", IsSelected: false},{Name: "lift kit", IsSelected: false},{Name: "classical", IsSelected: false},{Name: "classify", IsSelected: false},{Name: "vapor twitch", IsSelected: false},{Name: "speed metal", IsSelected: false},{Name: "sertanejo", IsSelected: false},{Name: "mariachi", IsSelected: false},{Name: "channel pop", IsSelected: false},{Name: "chillhop", IsSelected: false},{Name: "british invasion", IsSelected: false},{Name: "lilith", IsSelected: false},{Name: "samba", IsSelected: false},{Name: "symphonic rock", IsSelected: false},{Name: "melancholia", IsSelected: false},{Name: "downtempo", IsSelected: false},{Name: "disco house", IsSelected: false},{Name: "catstep", IsSelected: false},{Name: "traditional folk", IsSelected: false},{Name: "grunge", IsSelected: false},{Name: "video game music", IsSelected: false},{Name: "romantic", IsSelected: false},{Name: "bossa nova", IsSelected: false},{Name: "rockabilly", IsSelected: false},{Name: "swedish folk pop", IsSelected: false},{Name: "skate punk", IsSelected: false},{Name: "bubblegum pop", IsSelected: false},{Name: "hoerspiel", IsSelected: false},{Name: "pop emo", IsSelected: false},{Name: "lounge", IsSelected: false},{Name: "australian dance", IsSelected: false},{Name: "otacore", IsSelected: false},{Name: "comic", IsSelected: false},{Name: "cumbia", IsSelected: false},{Name: "progressive metal", IsSelected: false},{Name: "slow core", IsSelected: false},{Name: "complextro", IsSelected: false},{Name: "spanish rock", IsSelected: false},{Name: "alt-indie rock", IsSelected: false},{Name: "progressive rock", IsSelected: false},{Name: "australian alternative rock", IsSelected: false},{Name: "la indie", IsSelected: false},{Name: "deep trap", IsSelected: false},{Name: "duranguense", IsSelected: false},{Name: "nu jazz", IsSelected: false},{Name: "nu gaze", IsSelected: false},{Name: "anti-folk", IsSelected: false},{Name: "bachata", IsSelected: false},{Name: "texas country", IsSelected: false},{Name: "deep southern trap", IsSelected: false},{Name: "power metal", IsSelected: false},{Name: "reggae fusion", IsSelected: false},{Name: "madchester", IsSelected: false},{Name: "french pop", IsSelected: false},{Name: "space rock", IsSelected: false},{Name: "deep latin hip hop", IsSelected: false},{Name: "mandopop", IsSelected: false},{Name: "post-punk", IsSelected: false},{Name: "forro", IsSelected: false},{Name: "chamber psych", IsSelected: false},{Name: "alternative country", IsSelected: false},{Name: "roots reggae", IsSelected: false},{Name: "minimal dub", IsSelected: false},{Name: "indie garage rock", IsSelected: false},{Name: "trance", IsSelected: false},{Name: "deep danish pop", IsSelected: false},{Name: "cool jazz", IsSelected: false},{Name: "bolero", IsSelected: false},{Name: "industrial metal", IsSelected: false},{Name: "danish pop", IsSelected: false},{Name: "taiwanese pop", IsSelected: false},{Name: "turkish pop", IsSelected: false},{Name: "brazilian hip hop", IsSelected: false},{Name: "opm", IsSelected: false},{Name: "nashville sound", IsSelected: false},{Name: "dancehall", IsSelected: false},{Name: "merseybeat", IsSelected: false},{Name: "preverb", IsSelected: false},{Name: "cabaret", IsSelected: false},{Name: "thrash metal", IsSelected: false},{Name: "deep taiwanese pop", IsSelected: false},{Name: "italian hip hop", IsSelected: false},{Name: "minimal", IsSelected: false},{Name: "reggae", IsSelected: false},{Name: "nueva cancion", IsSelected: false},{Name: "c-pop", IsSelected: false},{Name: "jazz funk", IsSelected: false},{Name: "jazz", IsSelected: false},{Name: "bow pop", IsSelected: false},{Name: "finnish dance pop", IsSelected: false},{Name: "post-screamo", IsSelected: false},{Name: "eurodance", IsSelected: false},{Name: "jam band", IsSelected: false},{Name: "axe", IsSelected: false},{Name: "swedish alternative rock", IsSelected: false},{Name: "easy listening", IsSelected: false},{Name: "etherpop", IsSelected: false},{Name: "french hip hop", IsSelected: false},{Name: "power pop", IsSelected: false},{Name: "world worship", IsSelected: false},{Name: "salsa", IsSelected: false},{Name: "industrial rock", IsSelected: false},{Name: "alternative emo", IsSelected: false},{Name: "uk post-punk", IsSelected: false},{Name: "modern classical", IsSelected: false},{Name: "deep cumbia sonidera", IsSelected: false},{Name: "candy pop", IsSelected: false},{Name: "pixie", IsSelected: false},{Name: "chanson", IsSelected: false},{Name: "deep new americana", IsSelected: false},{Name: "bebop", IsSelected: false},{Name: "brooklyn indie", IsSelected: false},{Name: "progressive trance", IsSelected: false},{Name: "sky room", IsSelected: false},{Name: "turkish rock", IsSelected: false},{Name: "merengue", IsSelected: false},{Name: "punk blues", IsSelected: false},{Name: "jazz fusion", IsSelected: false},{Name: "filter house", IsSelected: false},{Name: "chilean rock", IsSelected: false},{Name: "melodic death metal", IsSelected: false},{Name: "finnish pop", IsSelected: false},{Name: "contemporary post-bop", IsSelected: false},{Name: "deep euro house", IsSelected: false},{Name: "swedish indie rock", IsSelected: false},{Name: "show tunes", IsSelected: false},{Name: "vocal house", IsSelected: false},{Name: "post-disco", IsSelected: false},{Name: "post rock", IsSelected: false},{Name: "bubblegum dance", IsSelected: false},{Name: "cantopop", IsSelected: false},{Name: "vallenato", IsSelected: false},{Name: "german techno", IsSelected: false},{Name: "tech house", IsSelected: false},{Name: "country dawn", IsSelected: false},{Name: "big beat", IsSelected: false},{Name: "deep regional mexican", IsSelected: false},{Name: "deep swedish hip hop", IsSelected: false},{Name: "cumbia villera", IsSelected: false},{Name: "spanish pop rock", IsSelected: false},{Name: "dutch pop", IsSelected: false},{Name: "movie tunes", IsSelected: false},{Name: "indonesian pop", IsSelected: false},{Name: "australian pop", IsSelected: false},{Name: "ninja", IsSelected: false},{Name: "wrestling", IsSelected: false},{Name: "irish rock", IsSelected: false},{Name: "anthem emo", IsSelected: false},{Name: "classic swedish pop", IsSelected: false},{Name: "canadian indie", IsSelected: false},{Name: "garage psych", IsSelected: false},{Name: "microhouse", IsSelected: false},{Name: "fourth world", IsSelected: false},{Name: "shiver pop", IsSelected: false},{Name: "french indietronica", IsSelected: false},{Name: "texas blues", IsSelected: false},{Name: "experimental rock", IsSelected: false},{Name: "pinoy alternative", IsSelected: false},{Name: "danspunk", IsSelected: false},{Name: "norwegian indie", IsSelected: false},{Name: "dutch house", IsSelected: false},{Name: "acid jazz", IsSelected: false},{Name: "swing", IsSelected: false},{Name: "rock gaucho", IsSelected: false},{Name: "minimal techno", IsSelected: false},{Name: "hip house", IsSelected: false},{Name: "norwegian pop", IsSelected: false},{Name: "soul jazz", IsSelected: false},{Name: "swedish hip hop", IsSelected: false},{Name: "swedish eurodance", IsSelected: false},{Name: "dutch hip hop", IsSelected: false},{Name: "broadway", IsSelected: false},{Name: "chillstep", IsSelected: false},{Name: "blues", IsSelected: false},{Name: "indie jazz", IsSelected: false},{Name: "traditional blues", IsSelected: false},{Name: "progressive bluegrass", IsSelected: false},{Name: "celtic rock", IsSelected: false},{Name: "latin christian", IsSelected: false},{Name: "progressive post-hardcore", IsSelected: false},{Name: "french rock", IsSelected: false},{Name: "anime", IsSelected: false},{Name: "hard bop", IsSelected: false},{Name: "melodic hardcore", IsSelected: false},{Name: "dreamo", IsSelected: false},{Name: "stride", IsSelected: false},{Name: "uk funky", IsSelected: false},{Name: "new age", IsSelected: false},{Name: "west coast trap", IsSelected: false},{Name: "epicore", IsSelected: false},{Name: "country blues", IsSelected: false},{Name: "deep chiptune", IsSelected: false},{Name: "indie rockism", IsSelected: false},{Name: "j-pop", IsSelected: false},{Name: "post-hardcore", IsSelected: false},{Name: "electro", IsSelected: false},{Name: "indie punk", IsSelected: false},{Name: "antiviral pop", IsSelected: false},{Name: "deep funk", IsSelected: false},{Name: "azontobeats", IsSelected: false},{Name: "turkish jazz", IsSelected: false},{Name: "zapstep", IsSelected: false},{Name: "sheffield indie", IsSelected: false},{Name: "future funk", IsSelected: false},{Name: "stoner rock", IsSelected: false},{Name: "noise rock", IsSelected: false},{Name: "death metal", IsSelected: false},{Name: "neo classical metal", IsSelected: false},{Name: "industrial", IsSelected: false},{Name: "ambient", IsSelected: false},{Name: "uplifting trance", IsSelected: false},{Name: "french indie pop", IsSelected: false},{Name: "turntablism", IsSelected: false},{Name: "country gospel", IsSelected: false},{Name: "big band", IsSelected: false},{Name: "deep melodic euro house", IsSelected: false},{Name: "electro swing", IsSelected: false},{Name: "drill", IsSelected: false},{Name: "canadian metal", IsSelected: false},{Name: "french reggae", IsSelected: false},{Name: "reggae rock", IsSelected: false},{Name: "mexican indie", IsSelected: false},{Name: "aussietronica", IsSelected: false},{Name: "brazilian gospel", IsSelected: false},{Name: "christian hip hop", IsSelected: false},{Name: "death core", IsSelected: false},{Name: "louvor", IsSelected: false},{Name: "ska", IsSelected: false},{Name: "deep ccm", IsSelected: false},{Name: "indonesian indie", IsSelected: false},{Name: "vaporwave", IsSelected: false},{Name: "relaxative", IsSelected: false},{Name: "german metal", IsSelected: false},{Name: "electro latino", IsSelected: false},{Name: "classic norwegian pop", IsSelected: false},{Name: "uk garage", IsSelected: false},{Name: "lovers rock", IsSelected: false},{Name: "nu disco", IsSelected: false},{Name: "gothic metal", IsSelected: false},{Name: "swedish indie pop", IsSelected: false},{Name: "baroque", IsSelected: false},{Name: "suomi rock", IsSelected: false},{Name: "deep swedish indie pop", IsSelected: false},{Name: "j-rock", IsSelected: false},{Name: "christian uplift", IsSelected: false},{Name: "drum and bass", IsSelected: false},{Name: "gauze pop", IsSelected: false},{Name: "smooth jazz", IsSelected: false},{Name: "groove room", IsSelected: false},{Name: "latin jazz", IsSelected: false},{Name: "world", IsSelected: false},{Name: "new orleans blues", IsSelected: false},{Name: "trova", IsSelected: false},{Name: "merengue urbano", IsSelected: false},{Name: "experimental", IsSelected: false},{Name: "memphis blues", IsSelected: false},{Name: "japanese r&b", IsSelected: false},{Name: "flamenco", IsSelected: false},{Name: "memphis hip hop", IsSelected: false},{Name: "swedish synthpop", IsSelected: false},{Name: "latin metal", IsSelected: false},{Name: "chicago blues", IsSelected: false},{Name: "stoner metal", IsSelected: false},{Name: "hyphy", IsSelected: false},{Name: "russelater", IsSelected: false},{Name: "uk drill", IsSelected: false},{Name: "pub rock", IsSelected: false},{Name: "neue deutsche harte", IsSelected: false},{Name: "old school hip hop", IsSelected: false},{Name: "stomp pop", IsSelected: false},{Name: "hardcore punk", IsSelected: false},{Name: "ska punk", IsSelected: false},{Name: "dub", IsSelected: false},{Name: "spanish indie pop", IsSelected: false},{Name: "christian relaxative", IsSelected: false},{Name: "afrobeats", IsSelected: false},{Name: "classical period", IsSelected: false},{Name: "liquid funk", IsSelected: false},{Name: "danish pop rock", IsSelected: false},{Name: "mambo", IsSelected: false},{Name: "new weird america", IsSelected: false},{Name: "german pop rock", IsSelected: false},{Name: "comedy", IsSelected: false},{Name: "operatic pop", IsSelected: false},{Name: "doo-wop", IsSelected: false},{Name: "dangdut", IsSelected: false},{Name: "delta blues", IsSelected: false},{Name: "shoegaze", IsSelected: false},{Name: "djent", IsSelected: false},{Name: "norwegian rock", IsSelected: false},{Name: "cowboy western", IsSelected: false},{Name: "turkish folk", IsSelected: false},{Name: "bass music", IsSelected: false},{Name: "acoustic blues", IsSelected: false},{Name: "desi", IsSelected: false},{Name: "gospel", IsSelected: false},{Name: "cumbia sonidera", IsSelected: false},{Name: "wonky", IsSelected: false},{Name: "icelandic pop", IsSelected: false},{Name: "deep texas country", IsSelected: false},{Name: "contemporary jazz", IsSelected: false},{Name: "finnish hip hop", IsSelected: false},{Name: "hardstyle", IsSelected: false},{Name: "meditation", IsSelected: false},{Name: "a cappella", IsSelected: false},{Name: "celtic", IsSelected: false},{Name: "argentine reggae", IsSelected: false},{Name: "swedish metal", IsSelected: false},{Name: "indian pop", IsSelected: false},{Name: "drone", IsSelected: false},{Name: "gothic symphonic metal", IsSelected: false},{Name: "minimal tech house", IsSelected: false},{Name: "j-rap", IsSelected: false},{Name: "nwobhm", IsSelected: false},{Name: "healing", IsSelected: false},{Name: "symphonic metal", IsSelected: false},{Name: "opera", IsSelected: false},{Name: "viking metal", IsSelected: false},{Name: "polish pop", IsSelected: false},{Name: "boogaloo", IsSelected: false},{Name: "tejano", IsSelected: false},{Name: "retro electro", IsSelected: false},{Name: "deep hardstyle", IsSelected: false},{Name: "schlager", IsSelected: false},{Name: "desi hip hop", IsSelected: false},{Name: "electroclash", IsSelected: false},{Name: "piedmont blues", IsSelected: false},{Name: "dansband", IsSelected: false},{Name: "folk punk", IsSelected: false},{Name: "filthstep", IsSelected: false},{Name: "melbourne bounce", IsSelected: false},{Name: "spanish punk", IsSelected: false},{Name: "strut", IsSelected: false},{Name: "intelligent dance music", IsSelected: false},{Name: "deep disco house", IsSelected: false},{Name: "german indie", IsSelected: false},{Name: "louisiana blues", IsSelected: false},{Name: "classic danish pop", IsSelected: false},{Name: "pop house", IsSelected: false},{Name: "brazilian indie", IsSelected: false},{Name: "children's music", IsSelected: false},{Name: "british folk", IsSelected: false},{Name: "sleep", IsSelected: false},{Name: "jangle pop", IsSelected: false},{Name: "arabesk", IsSelected: false},{Name: "afrobeat", IsSelected: false},{Name: "fluxwork", IsSelected: false},{Name: "hands up", IsSelected: false},{Name: "chicano rap", IsSelected: false},{Name: "boston rock", IsSelected: false},{Name: "alternative r&b", IsSelected: false},{Name: "future garage", IsSelected: false},{Name: "spanish hip hop", IsSelected: false},{Name: "k-hop", IsSelected: false},{Name: "northern soul", IsSelected: false},{Name: "levenslied", IsSelected: false},{Name: "zolo", IsSelected: false},{Name: "nu-cumbia", IsSelected: false},{Name: "glitch", IsSelected: false},{Name: "electropowerpop", IsSelected: false},{Name: "crossover thrash", IsSelected: false},{Name: "spanish new wave", IsSelected: false},{Name: "norwegian hip hop", IsSelected: false},{Name: "velha guarda", IsSelected: false},{Name: "melodipop", IsSelected: false},{Name: "danseband", IsSelected: false},{Name: "coverchill", IsSelected: false},{Name: "alternative pop", IsSelected: false},{Name: "j-dance", IsSelected: false},{Name: "piano blues", IsSelected: false},{Name: "jazz metal", IsSelected: false},{Name: "liedermacher", IsSelected: false},{Name: "reading", IsSelected: false},{Name: "filmi", IsSelected: false},{Name: "neoclassical", IsSelected: false},{Name: "float house", IsSelected: false},{Name: "mathcore", IsSelected: false},{Name: "rumba", IsSelected: false},{Name: "brazilian punk", IsSelected: false},{Name: "environmental", IsSelected: false},{Name: "folk metal", IsSelected: false},{Name: "polynesian pop", IsSelected: false},{Name: "cubaton", IsSelected: false},{Name: "alternative pop rock", IsSelected: false},{Name: "sludge metal", IsSelected: false},{Name: "discofox", IsSelected: false},{Name: "azonto", IsSelected: false},{Name: "glitch hop", IsSelected: false},{Name: "abstract hip hop", IsSelected: false},{Name: "hardcore techno", IsSelected: false},{Name: "australian hip hop", IsSelected: false},{Name: "bluegrass", IsSelected: false},{Name: "grave wave", IsSelected: false},{Name: "technical death metal", IsSelected: false},{Name: "canadian country", IsSelected: false},{Name: "neo-singer-songwriter", IsSelected: false},{Name: "swamp blues", IsSelected: false},{Name: "fingerstyle", IsSelected: false},{Name: "russian pop", IsSelected: false},{Name: "vapor pop", IsSelected: false},{Name: "slow game", IsSelected: false},{Name: "kiwi rock", IsSelected: false},{Name: "welsh rock", IsSelected: false},{Name: "underground rap", IsSelected: false},{Name: "finnish metal", IsSelected: false},{Name: "breakbeat", IsSelected: false},{Name: "folklore argentino", IsSelected: false},{Name: "christian metal", IsSelected: false},{Name: "german punk", IsSelected: false},{Name: "pop flamenco", IsSelected: false},{Name: "new tribe", IsSelected: false},{Name: "sleaze rock", IsSelected: false},{Name: "j-metal", IsSelected: false},{Name: "jump blues", IsSelected: false},{Name: "deep turkish pop", IsSelected: false},{Name: "post-metal", IsSelected: false},{Name: "stomp and flutter", IsSelected: false},{Name: "black metal", IsSelected: false},{Name: "australian country", IsSelected: false},{Name: "rock steady", IsSelected: false},{Name: "christian dance", IsSelected: false},{Name: "portland indie", IsSelected: false},{Name: "drift", IsSelected: false},{Name: "no wave", IsSelected: false},{Name: "turkish hip hop", IsSelected: false},{Name: "neurofunk", IsSelected: false},{Name: "kirtan", IsSelected: false},{Name: "italo dance", IsSelected: false},{Name: "doom metal", IsSelected: false},{Name: "symphonic black metal", IsSelected: false},{Name: "peruvian rock", IsSelected: false},{Name: "electro jazz", IsSelected: false},{Name: "japanese city pop", IsSelected: false},{Name: "jump up", IsSelected: false},{Name: "dark jazz", IsSelected: false},{Name: "pagan black metal", IsSelected: false},{Name: "techno", IsSelected: false},{Name: "zouk riddim", IsSelected: false},{Name: "alternative ccm", IsSelected: false},{Name: "western swing", IsSelected: false},{Name: "carnaval", IsSelected: false},{Name: "happy hardcore", IsSelected: false},{Name: "brega", IsSelected: false},{Name: "post-doom metal", IsSelected: false},{Name: "sertanejo tradicional", IsSelected: false},{Name: "polish hip hop", IsSelected: false},{Name: "hard alternative", IsSelected: false},{Name: "italian indie pop", IsSelected: false},{Name: "classic italian pop", IsSelected: false},{Name: "avant-garde jazz", IsSelected: false},{Name: "irish folk", IsSelected: false},{Name: "jungle", IsSelected: false},{Name: "russian rock", IsSelected: false},{Name: "deep uplifting trance", IsSelected: false},{Name: "belgian rock", IsSelected: false},{Name: "rap chileno", IsSelected: false},{Name: "dark wave", IsSelected: false},{Name: "cuban rumba", IsSelected: false},{Name: "new orleans jazz", IsSelected: false},{Name: "medieval", IsSelected: false},{Name: "modern performance", IsSelected: false},{Name: "chamame", IsSelected: false},{Name: "ectofolk", IsSelected: false},{Name: "idol", IsSelected: false},{Name: "chicago indie", IsSelected: false},{Name: "italian disco", IsSelected: false},{Name: "romantico", IsSelected: false},{Name: "dutch rock", IsSelected: false},{Name: "medieval rock", IsSelected: false},{Name: "austindie", IsSelected: false},{Name: "scottish rock", IsSelected: false},{Name: "deep norteno", IsSelected: false},{Name: "bay area indie", IsSelected: false},{Name: "classic finnish pop", IsSelected: false},{Name: "swedish jazz", IsSelected: false},{Name: "christelijk", IsSelected: false},{Name: "progressive uplifting trance", IsSelected: false},{Name: "harmonica blues", IsSelected: false},{Name: "deathgrind", IsSelected: false},{Name: "orgcore", IsSelected: false},{Name: "chicago house", IsSelected: false},{Name: "brutal death metal", IsSelected: false},{Name: "j-idol", IsSelected: false},{Name: "mexican rock-and-roll", IsSelected: false},{Name: "malaysian pop", IsSelected: false},{Name: "outsider house", IsSelected: false},{Name: "kindermusik", IsSelected: false},{Name: "psychedelic doom", IsSelected: false},{Name: "british alternative rock", IsSelected: false},{Name: "spanish noise pop", IsSelected: false},{Name: "hardcore", IsSelected: false},{Name: "world meditation", IsSelected: false},{Name: "free jazz", IsSelected: false},{Name: "eurovision", IsSelected: false},{Name: "k-indie", IsSelected: false},{Name: "salsa international", IsSelected: false},{Name: "puerto rican rock", IsSelected: false},{Name: "gbvfi", IsSelected: false},{Name: "classic russian rock", IsSelected: false},{Name: "classic finnish rock", IsSelected: false},{Name: "classic chinese pop", IsSelected: false},{Name: "avantgarde metal", IsSelected: false},{Name: "arab pop", IsSelected: false},{Name: "austropop", IsSelected: false},{Name: "uk hip hop", IsSelected: false},{Name: "nursery", IsSelected: false},{Name: "seattle indie", IsSelected: false},{Name: "portuguese rock", IsSelected: false},{Name: "soul flow", IsSelected: false},{Name: "gothic rock", IsSelected: false},{Name: "quebecois", IsSelected: false},{Name: "colombian rock", IsSelected: false},{Name: "dubstep", IsSelected: false},{Name: "brazilian ccm", IsSelected: false},{Name: "polish punk", IsSelected: false},{Name: "italian pop rock", IsSelected: false},{Name: "riddim", IsSelected: false},{Name: "progressive deathcore", IsSelected: false},{Name: "j-poprock", IsSelected: false},{Name: "baile funk", IsSelected: false},{Name: "celtic punk", IsSelected: false},{Name: "psychedelic trance", IsSelected: false},{Name: "nasheed", IsSelected: false},{Name: "ethereal wave", IsSelected: false},{Name: "barnmusik", IsSelected: false},{Name: "nintendocore", IsSelected: false},{Name: "warm drone", IsSelected: false},{Name: "ebm", IsSelected: false},{Name: "musica para ninos", IsSelected: false},{Name: "argentine indie", IsSelected: false},{Name: "world fusion", IsSelected: false},{Name: "grindcore", IsSelected: false},{Name: "freestyle", IsSelected: false},{Name: "math rock", IsSelected: false},{Name: "deep latin christian", IsSelected: false},{Name: "acid house", IsSelected: false},{Name: "twee pop", IsSelected: false},{Name: "ambeat", IsSelected: false},{Name: "substep", IsSelected: false},{Name: "steampunk", IsSelected: false},{Name: "albuquerque indie", IsSelected: false},{Name: "indie dream pop", IsSelected: false},{Name: "deep minimal techno", IsSelected: false},{Name: "bassline", IsSelected: false},{Name: "math pop", IsSelected: false},{Name: "electrofox", IsSelected: false},{Name: "mande pop", IsSelected: false},{Name: "laiko", IsSelected: false},{Name: "garage pop", IsSelected: false},{Name: "bhangra", IsSelected: false},{Name: "soca", IsSelected: false},{Name: "thai idol", IsSelected: false},{Name: "rock catala", IsSelected: false},{Name: "singaporean pop", IsSelected: false},{Name: "turbo folk", IsSelected: false},{Name: "choro", IsSelected: false},{Name: "chaotic hardcore", IsSelected: false},{Name: "funky tech house", IsSelected: false},{Name: "electro-industrial", IsSelected: false},{Name: "slovak pop", IsSelected: false},{Name: "entehno", IsSelected: false},{Name: "kabarett", IsSelected: false},{Name: "volksmusik", IsSelected: false},{Name: "classic garage rock", IsSelected: false},{Name: "emo punk", IsSelected: false},{Name: "chill lounge", IsSelected: false},{Name: "romanian pop", IsSelected: false},{Name: "british indie rock", IsSelected: false},{Name: "kraut rock", IsSelected: false},{Name: "electro bailando", IsSelected: false},{Name: "african gospel", IsSelected: false},{Name: "canterbury scene", IsSelected: false},{Name: "swedish hard rock", IsSelected: false},{Name: "deep comedy", IsSelected: false},{Name: "ska revival", IsSelected: false},{Name: "drill and bass", IsSelected: false},{Name: "thai pop", IsSelected: false},{Name: "gabba", IsSelected: false},{Name: "dansktop", IsSelected: false},{Name: "jazz trio", IsSelected: false},{Name: "ballroom", IsSelected: false},{Name: "oi", IsSelected: false},{Name: "russiavision", IsSelected: false},{Name: "mandible", IsSelected: false},{Name: "deep talent show", IsSelected: false},{Name: "deep tech house", IsSelected: false},{Name: "christian hardcore", IsSelected: false},{Name: "balearic", IsSelected: false},{Name: "ye ye", IsSelected: false},{Name: "bmore", IsSelected: false},{Name: "russian hip hop", IsSelected: false},{Name: "horror punk", IsSelected: false},{Name: "nu age", IsSelected: false},{Name: "canzone napoletana", IsSelected: false},{Name: "straight edge", IsSelected: false},{Name: "dixieland", IsSelected: false},{Name: "post-post-hardcore", IsSelected: false},{Name: "surf music", IsSelected: false},{Name: "latin electronica", IsSelected: false},{Name: "retro metal", IsSelected: false},{Name: "gypsy jazz", IsSelected: false},{Name: "psychobilly", IsSelected: false},{Name: "freakbeat", IsSelected: false},{Name: "atmospheric black metal", IsSelected: false},{Name: "vancouver indie", IsSelected: false},{Name: "speed garage", IsSelected: false},{Name: "old-time", IsSelected: false},{Name: "tango", IsSelected: false},{Name: "punjabi", IsSelected: false},{Name: "progressive trance house", IsSelected: false},{Name: "early music", IsSelected: false},{Name: "laboratorio", IsSelected: false},{Name: "e6fi", IsSelected: false},{Name: "psychill", IsSelected: false},{Name: "futurepop", IsSelected: false},{Name: "mashup", IsSelected: false},{Name: "orchestral", IsSelected: false},{Name: "cello", IsSelected: false},{Name: "voidgaze", IsSelected: false},{Name: "dub techno", IsSelected: false},{Name: "alternative roots rock", IsSelected: false},{Name: "choral", IsSelected: false},{Name: "drone metal", IsSelected: false},{Name: "christian punk", IsSelected: false},{Name: "detroit techno", IsSelected: false},{Name: "czech rock", IsSelected: false},{Name: "avant-garde", IsSelected: false},{Name: "turkish alternative", IsSelected: false},{Name: "progressive psytrance", IsSelected: false},{Name: "hawaiian", IsSelected: false},{Name: "classic colombian pop", IsSelected: false},{Name: "indian folk", IsSelected: false},{Name: "deep indian pop", IsSelected: false},{Name: "classical piano", IsSelected: false},{Name: "comedy rock", IsSelected: false},{Name: "abstract beats", IsSelected: false},{Name: "african rock", IsSelected: false},{Name: "israeli rock", IsSelected: false},{Name: "neo-trad metal", IsSelected: false},{Name: "fado", IsSelected: false},{Name: "norwegian metal", IsSelected: false},{Name: "danish hip hop", IsSelected: false},{Name: "neo-progressive", IsSelected: false},{Name: "classical performance", IsSelected: false},{Name: "praise", IsSelected: false},{Name: "persian pop", IsSelected: false},{Name: "j-indie", IsSelected: false},{Name: "czech folk", IsSelected: false},{Name: "nordic house", IsSelected: false},{Name: "hungarian rock", IsSelected: false},{Name: "exotica", IsSelected: false},{Name: "athens indie", IsSelected: false},{Name: "tribal house", IsSelected: false},{Name: "venezuelan rock", IsSelected: false},{Name: "theme", IsSelected: false},{Name: "aggrotech", IsSelected: false},{Name: "andean", IsSelected: false},{Name: "barnemusikk", IsSelected: false},{Name: "bubble trance", IsSelected: false},{Name: "visual kei", IsSelected: false},{Name: "acid techno", IsSelected: false},{Name: "swedish punk", IsSelected: false},{Name: "hungarian pop", IsSelected: false},{Name: "italian metal", IsSelected: false},{Name: "mizrahi", IsSelected: false},{Name: "anime score", IsSelected: false},{Name: "kizomba", IsSelected: false},{Name: "melodic hard rock", IsSelected: false},{Name: "popgaze", IsSelected: false},{Name: "russian punk", IsSelected: false},{Name: "classic turkish pop", IsSelected: false},{Name: "halloween", IsSelected: false},{Name: "vintage italian soundtrack", IsSelected: false},{Name: "rai", IsSelected: false},{Name: "power-pop punk", IsSelected: false},{Name: "columbus ohio indie", IsSelected: false},{Name: "shibuya-kei", IsSelected: false},{Name: "swedish reggae", IsSelected: false},{Name: "french movie tunes", IsSelected: false},{Name: "deep latin alternative", IsSelected: false},{Name: "albanian pop", IsSelected: false},{Name: "dark cabaret", IsSelected: false},{Name: "fidget house", IsSelected: false},{Name: "classic peruvian pop", IsSelected: false},{Name: "deep chill", IsSelected: false},{Name: "p funk", IsSelected: false},{Name: "turkish classical", IsSelected: false},{Name: "ok indie", IsSelected: false},{Name: "instrumental post rock", IsSelected: false},{Name: "violin", IsSelected: false},{Name: "power blues-rock", IsSelected: false},{Name: "shimmer psych", IsSelected: false},{Name: "renaissance", IsSelected: false},{Name: "brass band", IsSelected: false},{Name: "basque rock", IsSelected: false},{Name: "classic belgian pop", IsSelected: false},{Name: "karneval", IsSelected: false},{Name: "norwegian gospel", IsSelected: false},{Name: "goregrind", IsSelected: false},{Name: "folkmusik", IsSelected: false},{Name: "girl group", IsSelected: false},{Name: "classic polish pop", IsSelected: false},{Name: "classic icelandic pop", IsSelected: false},{Name: "horrorcore", IsSelected: false},{Name: "vienna indie", IsSelected: false},{Name: "black thrash", IsSelected: false},{Name: "chiptune", IsSelected: false},{Name: "highlife", IsSelected: false},{Name: "string quartet", IsSelected: false},{Name: "rio de la plata", IsSelected: false},{Name: "bouncy house", IsSelected: false},{Name: "vintage swedish pop", IsSelected: false},{Name: "belly dance", IsSelected: false},{Name: "nu skool breaks", IsSelected: false},{Name: "yugoslav rock", IsSelected: false},{Name: "timba", IsSelected: false},{Name: "dominican pop", IsSelected: false},{Name: "deep melodic metalcore", IsSelected: false},{Name: "musica nativista", IsSelected: false},{Name: "southern gospel", IsSelected: false},{Name: "perth indie", IsSelected: false},{Name: "indie psych-pop", IsSelected: false},{Name: "irish country", IsSelected: false},{Name: "sega", IsSelected: false},{Name: "zouk", IsSelected: false},{Name: "pakistani pop", IsSelected: false},{Name: "italian jazz", IsSelected: false},{Name: "neue deutsche welle", IsSelected: false},{Name: "hauntology", IsSelected: false},{Name: "soukous", IsSelected: false},{Name: "lds", IsSelected: false},{Name: "french folk pop", IsSelected: false},{Name: "swiss rock", IsSelected: false},{Name: "mod revival", IsSelected: false},{Name: "arab folk", IsSelected: false},{Name: "deep pop punk", IsSelected: false},{Name: "spanish reggae", IsSelected: false},{Name: "native american", IsSelected: false},{Name: "jazz bass", IsSelected: false},{Name: "melodic power metal", IsSelected: false},{Name: "polish reggae", IsSelected: false},{Name: "southern soul blues", IsSelected: false},{Name: "digital hardcore", IsSelected: false},{Name: "chanson quebecois", IsSelected: false},{Name: "catalan folk", IsSelected: false},{Name: "deep christian rock", IsSelected: false},{Name: "nordic folk", IsSelected: false},{Name: "free improvisation", IsSelected: false},{Name: "college a cappella", IsSelected: false},{Name: "uk dub", IsSelected: false},{Name: "hip hop quebecois", IsSelected: false},{Name: "hip hop tuga", IsSelected: false},{Name: "vintage french electronic", IsSelected: false},{Name: "hard minimal techno", IsSelected: false},{Name: "miami bass", IsSelected: false},{Name: "c86", IsSelected: false},{Name: "appalachian folk", IsSelected: false},{Name: "ambient idm", IsSelected: false},{Name: "vintage tango", IsSelected: false},{Name: "drumfunk", IsSelected: false},{Name: "serialism", IsSelected: false},{Name: "german oi", IsSelected: false},{Name: "new age piano", IsSelected: false},{Name: "vietnamese pop", IsSelected: false},{Name: "classical guitar", IsSelected: false},{Name: "bounce", IsSelected: false},{Name: "vocaloid", IsSelected: false},{Name: "samba-enredo", IsSelected: false},{Name: "tin pan alley", IsSelected: false},{Name: "harpsichord", IsSelected: false},{Name: "balkan brass", IsSelected: false},{Name: "boogie-woogie", IsSelected: false},{Name: "desert blues", IsSelected: false},{Name: "qawwali", IsSelected: false},{Name: "croatian pop", IsSelected: false},{Name: "brazilian composition", IsSelected: false},{Name: "spanish folk", IsSelected: false},{Name: "underground latin hip hop", IsSelected: false},{Name: "garage punk", IsSelected: false},{Name: "modern uplift", IsSelected: false},{Name: "tico", IsSelected: false},{Name: "riot grrrl", IsSelected: false},{Name: "rosary", IsSelected: false},{Name: "morna", IsSelected: false},{Name: "deep soundtrack", IsSelected: false},{Name: "ecuadoria", IsSelected: false},{Name: "outsider", IsSelected: false},{Name: "czech hip hop", IsSelected: false},{Name: "polish indie", IsSelected: false},{Name: "cante flamenco", IsSelected: false},{Name: "traditional rock 'n roll", IsSelected: false},{Name: "hiplife", IsSelected: false},{Name: "deep soul house", IsSelected: false},{Name: "classic venezuelan pop", IsSelected: false},{Name: "kids dance party", IsSelected: false},{Name: "electronica", IsSelected: false},{Name: "classic czech pop", IsSelected: false},{Name: "jumpstyle", IsSelected: false},{Name: "thrash core", IsSelected: false},{Name: "disco polo", IsSelected: false},{Name: "metal guitar", IsSelected: false},{Name: "atmospheric post rock", IsSelected: false},{Name: "german show tunes", IsSelected: false},{Name: "portuguese pop", IsSelected: false},{Name: "full on", IsSelected: false},{Name: "heavy alternative", IsSelected: false},{Name: "mbalax", IsSelected: false},{Name: "kwaito house", IsSelected: false},{Name: "kompa", IsSelected: false},{Name: "deep gothic post-punk", IsSelected: false},{Name: "stomp and whittle", IsSelected: false},{Name: "finnish indie", IsSelected: false},{Name: "deep liquid", IsSelected: false},{Name: "cyber metal", IsSelected: false},{Name: "k-rock", IsSelected: false},{Name: "electropunk", IsSelected: false},{Name: "beats", IsSelected: false},{Name: "j-ambient", IsSelected: false},{Name: "latvian pop", IsSelected: false},{Name: "composition d", IsSelected: false},{Name: "makossa", IsSelected: false},{Name: "slovak hip hop", IsSelected: false},{Name: "estonian pop", IsSelected: false},{Name: "deep neofolk", IsSelected: false},{Name: "swamp pop", IsSelected: false},{Name: "blackgaze", IsSelected: false},{Name: "gothic alternative", IsSelected: false},{Name: "brutal deathcore", IsSelected: false},{Name: "ghazal", IsSelected: false},{Name: "denver indie", IsSelected: false},{Name: "japanese psychedelic", IsSelected: false},{Name: "psych gaze", IsSelected: false},{Name: "austrian hip hop", IsSelected: false},{Name: "rva indie", IsSelected: false},{Name: "deep rai", IsSelected: false},{Name: "oshare kei", IsSelected: false},{Name: "mexican son", IsSelected: false},{Name: "witch house", IsSelected: false},{Name: "calypso", IsSelected: false},{Name: "irish indie", IsSelected: false},{Name: "electro dub", IsSelected: false},{Name: "hungarian hip hop", IsSelected: false},{Name: "zillertal", IsSelected: false},{Name: "neo-rockabilly", IsSelected: false},{Name: "kayokyoku", IsSelected: false},{Name: "orquesta tropical", IsSelected: false},{Name: "grunge pop", IsSelected: false},{Name: "crust punk", IsSelected: false},{Name: "ethiopian pop", IsSelected: false},{Name: "deep adult standards", IsSelected: false},{Name: "beatdown", IsSelected: false},{Name: "louisville indie", IsSelected: false},{Name: "dark black metal", IsSelected: false},{Name: "world chill", IsSelected: false},{Name: "nwothm", IsSelected: false},{Name: "neofolk", IsSelected: false},{Name: "deep acoustic pop", IsSelected: false},{Name: "fake", IsSelected: false},{Name: "traditional ska", IsSelected: false},{Name: "traditional british folk", IsSelected: false},{Name: "geek rock", IsSelected: false},{Name: "destroy techno", IsSelected: false},{Name: "deep smooth jazz", IsSelected: false},{Name: "funk carioca", IsSelected: false},{Name: "ragtime", IsSelected: false},{Name: "drone folk", IsSelected: false},{Name: "judaica", IsSelected: false},{Name: "canadian hip hop", IsSelected: false},{Name: "dirty texas rap", IsSelected: false},{Name: "anarcho-punk", IsSelected: false},{Name: "deep flow", IsSelected: false},{Name: "hebrew pop", IsSelected: false},{Name: "concert piano", IsSelected: false},{Name: "kurdish folk", IsSelected: false},{Name: "swiss hip hop", IsSelected: false},{Name: "orquesta tipica", IsSelected: false},{Name: "neo-synthpop", IsSelected: false},{Name: "deep dance pop", IsSelected: false},{Name: "acousmatic", IsSelected: false},{Name: "workout", IsSelected: false},{Name: "classic french pop", IsSelected: false},{Name: "tone", IsSelected: false},{Name: "musiikkia lapsille", IsSelected: false},{Name: "abstract", IsSelected: false},{Name: "psychedelic blues-rock", IsSelected: false},{Name: "guidance", IsSelected: false},{Name: "blaskapelle", IsSelected: false},{Name: "broken beat", IsSelected: false},{Name: "classic soundtrack", IsSelected: false},{Name: "dark hardcore", IsSelected: false},{Name: "ukrainian rock", IsSelected: false},{Name: "new beat", IsSelected: false},{Name: "schranz", IsSelected: false},{Name: "atmospheric post-metal", IsSelected: false},{Name: "marching band", IsSelected: false},{Name: "nerdcore", IsSelected: false},{Name: "modern southern rock", IsSelected: false},{Name: "minimal wave", IsSelected: false},{Name: "zouglou", IsSelected: false},{Name: "indian classical", IsSelected: false},{Name: "lithumania", IsSelected: false},{Name: "swedish prog", IsSelected: false},{Name: "australian indie", IsSelected: false},{Name: "lo star", IsSelected: false},{Name: "nl folk", IsSelected: false},{Name: "underground power pop", IsSelected: false},{Name: "danish indie", IsSelected: false},{Name: "semba", IsSelected: false},{Name: "vegan straight edge", IsSelected: false},{Name: "ukulele", IsSelected: false},{Name: "leeds indie", IsSelected: false},{Name: "footwork", IsSelected: false},{Name: "deep contemporary country", IsSelected: false},{Name: "yoik", IsSelected: false},{Name: "belgian indie", IsSelected: false},{Name: "chalga", IsSelected: false},{Name: "motivation", IsSelected: false},{Name: "didgeridoo", IsSelected: false},{Name: "spanish invasion", IsSelected: false},{Name: "jazz brass", IsSelected: false},{Name: "alternative americana", IsSelected: false},{Name: "breakcore", IsSelected: false},{Name: "string folk", IsSelected: false},{Name: "euroska", IsSelected: false},{Name: "solipsynthm", IsSelected: false},{Name: "tribute", IsSelected: false},{Name: "deep brazilian pop", IsSelected: false},{Name: "classic dutch pop", IsSelected: false},{Name: "lounge house", IsSelected: false},{Name: "indie emo", IsSelected: false},{Name: "traditional swing", IsSelected: false},{Name: "slc indie", IsSelected: false},{Name: "black death", IsSelected: false},{Name: "electro trash", IsSelected: false},{Name: "crack rock steady", IsSelected: false},{Name: "classic afrobeat", IsSelected: false},{Name: "deep orchestral", IsSelected: false},{Name: "slavic metal", IsSelected: false},{Name: "darkstep", IsSelected: false},{Name: "deep disco", IsSelected: false},{Name: "japanese jazztronica", IsSelected: false},{Name: "traditional scottish folk", IsSelected: false},{Name: "enka", IsSelected: false},{Name: "indie singer-songwriter", IsSelected: false},{Name: "corrosion", IsSelected: false},{Name: "russian folk", IsSelected: false},{Name: "funky breaks", IsSelected: false},{Name: "romanian rock", IsSelected: false},{Name: "hindustani classical", IsSelected: false},{Name: "luk thung", IsSelected: false},{Name: "gothic americana", IsSelected: false},{Name: "martial industrial", IsSelected: false},{Name: "usbm", IsSelected: false},{Name: "russian alternative", IsSelected: false},{Name: "deep discofox", IsSelected: false},{Name: "scratch", IsSelected: false},{Name: "zydeco", IsSelected: false},{Name: "electronicore", IsSelected: false},{Name: "deep german punk", IsSelected: false},{Name: "musica per bambini", IsSelected: false},{Name: "bass trip", IsSelected: false},{Name: "beach music", IsSelected: false},{Name: "dark ambient", IsSelected: false},{Name: "ostrock", IsSelected: false},{Name: "afrikaans", IsSelected: false},{Name: "porro", IsSelected: false},{Name: "classic russian pop", IsSelected: false},{Name: "monastic", IsSelected: false},{Name: "south african jazz", IsSelected: false},{Name: "islamic recitation", IsSelected: false},{Name: "mallet", IsSelected: false},{Name: "liturgical", IsSelected: false},{Name: "progressive alternative", IsSelected: false},{Name: "musique pour enfants", IsSelected: false},{Name: "michigan indie", IsSelected: false},{Name: "minimal melodic techno", IsSelected: false},{Name: "kwaito", IsSelected: false},{Name: "fast melodic punk", IsSelected: false},{Name: "norwegian jazz", IsSelected: false},{Name: "german ccm", IsSelected: false},{Name: "deep ambient", IsSelected: false},{Name: "rebetiko", IsSelected: false},{Name: "neo metal", IsSelected: false},{Name: "garage punk blues", IsSelected: false},{Name: "deep jazz guitar", IsSelected: false},{Name: "power violence", IsSelected: false},{Name: "gamecore", IsSelected: false},{Name: "abstract idm", IsSelected: false},{Name: "ambient psychill", IsSelected: false},{Name: "italian progressive rock", IsSelected: false},{Name: "finnish hardcore", IsSelected: false},{Name: "faroese pop", IsSelected: false},{Name: "deep psychobilly", IsSelected: false},{Name: "polyphony", IsSelected: false},{Name: "hard house", IsSelected: false},{Name: "ragga jungle", IsSelected: false},{Name: "downtempo fusion", IsSelected: false},{Name: "french punk", IsSelected: false},{Name: "spanish classical", IsSelected: false},{Name: "vapor house", IsSelected: false},{Name: "panpipe", IsSelected: false},{Name: "bossa nova jazz", IsSelected: false},{Name: "neurostep", IsSelected: false},{Name: "wind ensemble", IsSelected: false},{Name: "string band", IsSelected: false},{Name: "coupe decale", IsSelected: false},{Name: "deep liquid bass", IsSelected: false},{Name: "ugandan pop", IsSelected: false},{Name: "library music", IsSelected: false},{Name: "classic schlager", IsSelected: false},{Name: "danish jazz", IsSelected: false},{Name: "chaotic black metal", IsSelected: false},{Name: "j-reggae", IsSelected: false},{Name: "deep opera", IsSelected: false},{Name: "power electronics", IsSelected: false},{Name: "bay area hip hop", IsSelected: false},{Name: "magyar", IsSelected: false},{Name: "deep melodic hard rock", IsSelected: false},{Name: "melodic progressive metal", IsSelected: false},{Name: "greek indie", IsSelected: false},{Name: "deep progressive trance", IsSelected: false},{Name: "slam death metal", IsSelected: false},{Name: "galego", IsSelected: false},{Name: "rap metalcore", IsSelected: false},{Name: "manele", IsSelected: false},{Name: "gospel reggae", IsSelected: false},{Name: "deep soft rock", IsSelected: false},{Name: "military band", IsSelected: false},{Name: "deep canadian indie", IsSelected: false},{Name: "trash rock", IsSelected: false},{Name: "consort", IsSelected: false},{Name: "nz indie", IsSelected: false},{Name: "tekno", IsSelected: false},{Name: "japanoise", IsSelected: false},{Name: "traditional soul", IsSelected: false},{Name: "dark psytrance", IsSelected: false},{Name: "tzadik", IsSelected: false},{Name: "breton folk", IsSelected: false},{Name: "technical brutal death metal", IsSelected: false},{Name: "neo-pagan", IsSelected: false},{Name: "bulgarian rock", IsSelected: false},{Name: "deep folk metal", IsSelected: false},{Name: "armenian folk", IsSelected: false},{Name: "experimental psych", IsSelected: false},{Name: "speedcore", IsSelected: false},{Name: "guitar case", IsSelected: false},{Name: "shanty", IsSelected: false},{Name: "italian folk", IsSelected: false},{Name: "contemporary composition", IsSelected: false},{Name: "depressive black metal", IsSelected: false},{Name: "indie fuzzpop", IsSelected: false},{Name: "deep german indie", IsSelected: false},{Name: "spoken word", IsSelected: false},{Name: "j-core", IsSelected: false},{Name: "klezmer", IsSelected: false},{Name: "kuduro", IsSelected: false},{Name: "future ambient", IsSelected: false},{Name: "remix", IsSelected: false},{Name: "harp", IsSelected: false},{Name: "brass ensemble", IsSelected: false},{Name: "funeral doom", IsSelected: false},{Name: "minimal dubstep", IsSelected: false},{Name: "ambient fusion", IsSelected: false},{Name: "skinhead reggae", IsSelected: false},{Name: "pipe band", IsSelected: false},{Name: "iskelma", IsSelected: false},{Name: "barbershop", IsSelected: false},{Name: "vintage chanson", IsSelected: false},{Name: "blues-rock guitar", IsSelected: false},{Name: "persian traditional", IsSelected: false},{Name: "nepali", IsSelected: false},{Name: "jig and reel", IsSelected: false},{Name: "jazz orchestra", IsSelected: false},{Name: "mantra", IsSelected: false},{Name: "go-go", IsSelected: false},{Name: "british dance band", IsSelected: false},{Name: "doujin", IsSelected: false},{Name: "accordion", IsSelected: false},{Name: "indorock", IsSelected: false},{Name: "flick hop", IsSelected: false},{Name: "deep sunset lounge", IsSelected: false},{Name: "prank", IsSelected: false},{Name: "corsican folk", IsSelected: false},{Name: "greek house", IsSelected: false},{Name: "triangle indie", IsSelected: false},{Name: "punta", IsSelected: false},{Name: "screamo punk", IsSelected: false},{Name: "screamocore", IsSelected: false},{Name: "cornetas y tambores", IsSelected: false},{Name: "stl indie", IsSelected: false},{Name: "demoscene", IsSelected: false},{Name: "throat singing", IsSelected: false},{Name: "indie pop rock", IsSelected: false},{Name: "deep happy hardcore", IsSelected: false},{Name: "indie shoegaze", IsSelected: false},{Name: "ghettotech", IsSelected: false},{Name: "college marching band", IsSelected: false},{Name: "west african jazz", IsSelected: false},{Name: "greek hip hop", IsSelected: false},{Name: "carnatic", IsSelected: false},{Name: "benga", IsSelected: false},{Name: "neo-industrial rock", IsSelected: false},{Name: "geek folk", IsSelected: false},{Name: "deep vocal jazz", IsSelected: false},{Name: "hard glam", IsSelected: false},{Name: "chamber choir", IsSelected: false},{Name: "post-disco soul", IsSelected: false},{Name: "outer hip hop", IsSelected: false},{Name: "bemani", IsSelected: false},{Name: "african percussion", IsSelected: false},{Name: "sinhala", IsSelected: false},{Name: "contemporary folk", IsSelected: false},{Name: "byzantine", IsSelected: false},{Name: "drama", IsSelected: false},{Name: "italian punk", IsSelected: false},{Name: "chinese indie rock", IsSelected: false},{Name: "swedish pop punk", IsSelected: false},{Name: "deep darkpsy", IsSelected: false},{Name: "cumbia funk", IsSelected: false},{Name: "chinese traditional", IsSelected: false},{Name: "capoeira", IsSelected: false},{Name: "villancicos", IsSelected: false},{Name: "black sludge", IsSelected: false},{Name: "unblack metal", IsSelected: false},{Name: "vintage jazz", IsSelected: false},{Name: "spanish indie rock", IsSelected: false},{Name: "power noise", IsSelected: false},{Name: "deep deep house", IsSelected: false},{Name: "commons", IsSelected: false},{Name: "dark minimal techno", IsSelected: false},{Name: "british brass band", IsSelected: false},{Name: "light music", IsSelected: false},{Name: "baroque ensemble", IsSelected: false},{Name: "gospel blues", IsSelected: false},{Name: "muziek voor kinderen", IsSelected: false},{Name: "deep psytrance", IsSelected: false},{Name: "abstractro", IsSelected: false},{Name: "dubsteppe", IsSelected: false},{Name: "zim", IsSelected: false},{Name: "heavy gothic rock", IsSelected: false},{Name: "deep indie singer-songwriter", IsSelected: false},{Name: "jug band", IsSelected: false},{Name: "mexican traditional", IsSelected: false},{Name: "northern irish indie", IsSelected: false},{Name: "poetry", IsSelected: false},{Name: "traditional funk", IsSelected: false},{Name: "covertrance", IsSelected: false},{Name: "thrash-groove metal", IsSelected: false},{Name: "finnish jazz", IsSelected: false},{Name: "musique concrete", IsSelected: false},{Name: "bangla", IsSelected: false},{Name: "deep new wave", IsSelected: false},{Name: "polka", IsSelected: false},{Name: "makina", IsSelected: false},{Name: "gothic post-punk", IsSelected: false},{Name: "classic eurovision", IsSelected: false},{Name: "c64", IsSelected: false},{Name: "polish jazz", IsSelected: false},{Name: "noise punk", IsSelected: false},{Name: "contemporary classical", IsSelected: false},{Name: "classical organ", IsSelected: false},{Name: "deep vocal house", IsSelected: false},{Name: "japanese traditional", IsSelected: false},{Name: "street punk", IsSelected: false},{Name: "deep indie rock", IsSelected: false},{Name: "belorush", IsSelected: false},{Name: "deep southern soul", IsSelected: false},{Name: "skiffle", IsSelected: false},{Name: "deep freestyle", IsSelected: false},{Name: "spytrack", IsSelected: false},{Name: "deep jazz piano", IsSelected: false},{Name: "cajun", IsSelected: false},{Name: "thai indie", IsSelected: false},{Name: "early music ensemble", IsSelected: false},{Name: "slash punk", IsSelected: false},{Name: "deep full on", IsSelected: false},{Name: "deep jazz fusion", IsSelected: false},{Name: "fallen angel", IsSelected: false},{Name: "deep downtempo fusion", IsSelected: false},{Name: "fussball", IsSelected: false},{Name: "clarinet", IsSelected: false},{Name: "deep funk house", IsSelected: false},{Name: "hardcore breaks", IsSelected: false},{Name: "sunset lounge", IsSelected: false},{Name: "deep indie pop", IsSelected: false},{Name: "deep melodic death metal", IsSelected: false},{Name: "microtonal", IsSelected: false},{Name: "deep progressive house", IsSelected: false},{Name: "electroacoustic improvisation", IsSelected: false},{Name: "deep east coast hip hop", IsSelected: false},{Name: "oratory", IsSelected: false},{Name: "grisly death metal", IsSelected: false},{Name: "indian rock", IsSelected: false},{Name: "deep hardcore", IsSelected: false},{Name: "traditional rockabilly", IsSelected: false},{Name: "deep ragga", IsSelected: false},{Name: "deep nordic folk", IsSelected: false},{Name: "neo soul-jazz", IsSelected: false},{Name: "deep filthstep", IsSelected: false},{Name: "deep pop emo", IsSelected: false},{Name: "steelpan", IsSelected: false},{Name: "classical flute", IsSelected: false},{Name: "hatecore", IsSelected: false},{Name: "deep classic garage rock", IsSelected: false},{Name: "vintage swing", IsSelected: false},{Name: "glitch beats", IsSelected: false},{Name: "skinhead oi", IsSelected: false},{Name: "deep swedish rock", IsSelected: false},{Name: "crossover prog", IsSelected: false},{Name: "punk ska", IsSelected: false},{Name: "traditional reggae", IsSelected: false},{Name: "organic ambient", IsSelected: false},{Name: "klapa", IsSelected: false},{Name: "lowercase", IsSelected: false},{Name: "experimental dubstep", IsSelected: false},{Name: "wrock", IsSelected: false},{Name: "football", IsSelected: false},{Name: "norwegian punk", IsSelected: false},{Name: "slovenian rock", IsSelected: false},{Name: "goa trance", IsSelected: false},{Name: "deep northern soul", IsSelected: false},{Name: "maghreb", IsSelected: false},{Name: "deep free jazz", IsSelected: false},{Name: "deep surf music", IsSelected: false},{Name: "re:techno", IsSelected: false},{Name: "deep chill-out", IsSelected: false},{Name: "tanzlmusi", IsSelected: false},{Name: "classic psychedelic rock", IsSelected: false},{Name: "raw black metal", IsSelected: false},{Name: "accordeon", IsSelected: false},{Name: "grim death metal", IsSelected: false},{Name: "gamelan", IsSelected: false},{Name: "dubstep product", IsSelected: false},{Name: "dallas indie", IsSelected: false},{Name: "deep italo disco", IsSelected: false},{Name: "ambient dub techno", IsSelected: false},{Name: "breaks", IsSelected: false},{Name: "dark progressive house", IsSelected: false},{Name: "hard stoner rock", IsSelected: false},{Name: "deep thrash metal", IsSelected: false},{Name: "zeuhl", IsSelected: false},{Name: "j-poppunk", IsSelected: false},{Name: "deep cello", IsSelected: false},{Name: "chill-out trance", IsSelected: false},{Name: "deep dub techno", IsSelected: false},{Name: "tibetan", IsSelected: false},{Name: "deep punk rock", IsSelected: false},{Name: "deep power-pop punk", IsSelected: false},{Name: "bulgarian folk", IsSelected: false},{Name: "kc indie", IsSelected: false},{Name: "noise", IsSelected: false},{Name: "chinese opera", IsSelected: false},{Name: "chill groove", IsSelected: false},{Name: "charred death", IsSelected: false},{Name: "neo honky tonk", IsSelected: false},{Name: "j-punk", IsSelected: false},{Name: "deep g funk", IsSelected: false},{Name: "glitter trance", IsSelected: false},{Name: "new jack smooth", IsSelected: false},{Name: "deep motown", IsSelected: false},{Name: "german street punk", IsSelected: false},{Name: "deep eurodance", IsSelected: false},{Name: "italo beats", IsSelected: false},{Name: "twin cities indie", IsSelected: false},{Name: "deep nz indie", IsSelected: false},{Name: "terrorcore", IsSelected: false},{Name: "saxophone", IsSelected: false},{Name: "malagasy folk", IsSelected: false},{Name: "doomcore", IsSelected: false},{Name: "deep space rock", IsSelected: false},{Name: "vintage rockabilly", IsSelected: false},{Name: "alternative hardcore", IsSelected: false},{Name: "alternative metalcore", IsSelected: false},{Name: "jangle rock", IsSelected: false},{Name: "modern downshift", IsSelected: false},{Name: "deep classical piano", IsSelected: false},{Name: "french folk", IsSelected: false},{Name: "anime cv", IsSelected: false},{Name: "jazz composition", IsSelected: false},{Name: "ceilidh", IsSelected: false},{Name: "nu electro", IsSelected: false},{Name: "skweee", IsSelected: false},{Name: "deep hardcore punk", IsSelected: false},{Name: "soda pop", IsSelected: false},{Name: "swedish jazz orkester", IsSelected: false},{Name: "indie emo rock", IsSelected: false},{Name: "chinese experimental", IsSelected: false},{Name: "modern free jazz", IsSelected: false},{Name: "rhythm and boogie", IsSelected: false},{Name: "vintage schlager", IsSelected: false},{Name: "deep neo-synthpop", IsSelected: false},{Name: "ghoststep", IsSelected: false},{Name: "cryptic black metal", IsSelected: false},{Name: "ethereal gothic", IsSelected: false},{Name: "deep german jazz", IsSelected: false},{Name: "song poem", IsSelected: false},{Name: "drone psych", IsSelected: false},{Name: "neo-traditional country", IsSelected: false},{Name: "cinematic dubstep", IsSelected: false},{Name: "vintage gospel", IsSelected: false},{Name: "vintage country folk", IsSelected: false},{Name: "deep orgcore", IsSelected: false},{Name: "gothic doom", IsSelected: false},{Name: "chip hop", IsSelected: false},{Name: "deep delta blues", IsSelected: false},{Name: "dark electro-industrial", IsSelected: false},{Name: "caucasian folk", IsSelected: false},{Name: "deep symphonic black metal", IsSelected: false},{Name: "deep breakcore", IsSelected: false},{Name: "twee indie pop", IsSelected: false},{Name: "necrogrind", IsSelected: false},{Name: "deep latin jazz", IsSelected: false},{Name: "vintage reggae", IsSelected: false},{Name: "vintage swoon", IsSelected: false},{Name: "smooth urban r&b", IsSelected: false},{Name: "rock noise", IsSelected: false},{Name: "central asian folk", IsSelected: false},{Name: "vintage western", IsSelected: false},{Name: "deep string quartet", IsSelected: false},{Name: "deep deep tech house", IsSelected: false}
  ]

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: Http,
    public dialog: MatDialog,
    public snackBar: MatSnackBar, 
    public playlistParameters: PlaylistParametersService,
    public accessTokenService: AccessTokenService,
    private httpService: HttpServiceService,
    private playlistTrackService: PlaylistTracksService,
    private changeDetectorRefs: ChangeDetectorRef
    ) {
      
      this.parameters = this.playlistParameters.getParameterList();
      this.searchTermChanged
        .debounceTime(1000) // wait 1s after the last event before emitting last event
        .distinctUntilChanged() // only emit if value is different from previous value
        .subscribe(searchTerm => {
          var url = "https://api.spotify.com/v1/search?q=" + searchTerm.replace(" ", "%20") + "&type=artist";
          this.searchResults = [];
          this.searchActive = true;
          this.httpService.HttpGet(url)
          .subscribe(
            (data) => {
              //This way I control the way the items get ordered
              var responseObject = {
                Artists: data.json().artists,
                // Genres: this.completeGenreList,
                // Albums: data.json().albums,
                // Tracks: data.json().tracks
              };
              for (var property in responseObject) {
                if (property == "Genres"){
                  var filteredGenreResults = responseObject[property].filter(item => item.Name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1).slice(0, 21);
                  filteredGenreResults.forEach(result => {
                    var newResult = new playlistParameter();
                    newResult.name = result.Name;
                    newResult.image = "";
                    newResult.type = "genre";
                    newResult.id = "";
                    newResult.strength = 5;
                    newResult.items = [];
                    this.searchResults.push(newResult);
                  })
                }else{
                 responseObject[property].items.forEach(result => {
                   var newResult = new playlistParameter();
                    newResult.name = result.name;
                    if (result.images != undefined && result.images.length > 0 && result.images[0].url != null){
                      newResult.image = result.images[0].url;
                    }
                    newResult.genres =  result.genres;
                    newResult.type = result.type;
                    newResult.id = result.id;
                    newResult.strength = 5;
                    newResult.relatedTracks = [];
                    newResult.relatedArtistStrength = 5;
                    this.searchResults.push(newResult);
                    // console.log(newResult);
                });
                }
              }
              this.searchLoading = false;
            },
            (error) => {
              this.httpService.ErrorHander(url, "", error);
            });
        });
    }

  ngOnInit() {
    //TODO: Make this into a service
    this.accessTokenService.setTokens(this.activatedRoute.snapshot.queryParams["access_token"], this.activatedRoute.snapshot.queryParams["refresh_token"]);
    this.access_token = this.accessTokenService.getAccessToken();
    this.refresh_token = this.accessTokenService.getRefreshToken();
    let url = 'https://api.spotify.com/v1/me';
    this.httpService.HttpGet(url).subscribe(
      (data) => {
        this.userData = data.json();
      },
      (error) => {
        
      }
    )
    
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  activateSearch(){
    this.searchActive = true;
  }

  getIndex(object){
    let index = this.trackList.tracks.map(function(e) { return e.id; }).indexOf(object.id);
    return index;
  }

  clickedInside($event: Event){
    $event.preventDefault();
    $event.stopPropagation();
    this.searchActive = true;
  }

  @HostListener('document:click', ['$event']) clickedOutside($event){
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

  generateSelectedParameters(obj){
    return Object.keys(obj).map((key)=>{ 
      return {key:key, value:obj[key]}
    });
  }

  getTitle(string){
    string = string + "s"
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  alreadyExists(object){
    return this.playlistParameters.checkItemAlreadyInPlaylist(object);
  }

  removeFromPlaylist(object, type){
    let successMessage = "Removed from Playlist";
    this.playlistParameters.removeFromPlaylist(object);
    this.httpService.NotificationHandler(true,successMessage, object);
    this.parameters = this.playlistParameters.getParameterList();
    this.updateSongParameterCount();
  }

  addToAdditions(object){
    this.playlistTrackService.addToAdditions(object);
  }

  addToExclusions(object){
    this.playlistTrackService.addToExclusions(object);
  }

  openAdvancedoptions(object){
    let dialogRef = this.dialog.open(DialogComponent, {
      width: '75%',
      height:'80%',
      data: { object, "token": this.access_token }
      // data: {"token": this.access_token}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.updateSongParameterCount();
    });
  }

  updateSongParameterCount(){
    let songsPerParameter = 0;
    let parameterCount = 0;
    this.generateSelectedParameters(this.parameters.additions).forEach(item => {
      if (item.value.items.length > 0){
        parameterCount += item.value.items.length;
      }
    })
    songsPerParameter = this.playlistSongCount / parameterCount;

    this.generateSelectedParameters(this.parameters.additions).forEach(item => {
      item.value.items.forEach(parameter => {
        parameter.trackCountToAdd = songsPerParameter * (parameter.strength / 5) ;
        if (parameter.type == 'artist'){
          parameter.mainArtistTracksToAdd = parameter.trackCountToAdd * 1;
          // parameter.mainArtistTracksToAdd = parameter.trackCountToAdd * .4;
          // parameter.relatedArtistTracksToAdd = (parameter.trackCountToAdd * .6) * (parameter.relatedArtistStrength / 5)
        }
      })
    })
  }

  generatePlaylist(){
    this.loading = true;
    this.trackList.tracks = [];
    this.generateSelectedParameters(this.parameters.additions).forEach(item => {
      item.value.items.forEach(parameter => {
        this.generateTracks(parameter);
      })
    })
    this.removeTracklistDuplicates();
    if (this.trackList.tracks.length > this.playlistSongCount){
      this.shuffleArray(this.trackList.tracks);
      this.trackList.tracks = this.trackList.tracks.splice(0, this.playlistSongCount);
    }
    this.dataSource.data = this.trackList.tracks;
    this.completed = true;
    this.loading = false;
  }

  shuffleArray(array){
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }

  generateTracks(object){
    this.updateSongParameterCount();
    if (this.trackList.tracks == undefined){
      this.trackList.tracks = [];
    }
    if (object.type == 'artist'){
      let artistTrackList = [];
      let relatedArtistTrackList = [];
      let songCountRemaining = object.trackCountToAdd;
      if (object.items != undefined){
        object.items.forEach(album => {
          if (album.selected){
            album.items.forEach(track => {
              if (track.selected && !this.itemAlreadyExists(track)){
                let trackToAdd = new playlistTrack();
                trackToAdd.id = track.id;
                trackToAdd.name = track.name;
                trackToAdd.artist = object.name;
                trackToAdd.album = album.name;
                trackToAdd.source = object.name + " | " + object.type;
                trackToAdd.type = track.type;
                artistTrackList.push(trackToAdd);
              }
            })
          }
        })
      }else{
        
      }
      this.shuffleArray(artistTrackList);
      artistTrackList = artistTrackList.slice(0, object.mainArtistTracksToAdd);
      this.combineArray(artistTrackList, this.trackList.tracks);
      this.shuffleArray(this.trackList.tracks);
      songCountRemaining = songCountRemaining - this.trackList.tracks.length;
      this.combineArray(object.relatedTracks.slice(0, songCountRemaining), this.trackList.tracks)
    }
  }

  itemAlreadyExists(track){
    let index = this.trackList.tracks.map(function(e) { return e.id; }).indexOf(track.id);
    if (index == -1){
      return false;
    }else{
      return true;
    }
  }

  combineArray(a,b) {
    var len = a.length;
    for (var i=0; i < len; i=i+5000) {
        b.unshift.apply( b, a.slice( i, i+5000 ) );
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }  

  finalizePlaylist(){
    var url = "https://api.spotify.com/v1/users/" + this.userData.id + "/playlists"
    var data = {
      "name": this.playlistName
    }
    this.httpService.HttpPost(url, data)
    .subscribe(
      (data) => {
        let url2 = "https://api.spotify.com/v1/users/" + this.userData.id + "/playlists/" + data.json().id + "/tracks";
        this.newPlaylistUrl = data.json().external_urls.spotify;
        let uriList = [];
        this.trackList.tracks.forEach(track => {
          uriList.push("spotify:track:" + track.id);
        })
        this.addTracksToPlaylist(url2, this.userData.id, data.json().id,uriList);
      },
      (error) => {

      },
      () => {
        
      }
    )
    
  }

  removeTracklistDuplicates(){
    this.trackList.tracks = this.trackList.tracks.filter((thing, index, self) => self.findIndex(t => t.id === thing.id && t.name === thing.name) === index);
  }

  addTracksToPlaylist(url, userId, playlistId, data){
    var trackCount = data.length;
    var allTracks = data;
    var tracksAdded = 0;
    if (trackCount > 100){
      var tracksToAdd = data.slice(0, 100);
      data = {
        "uris": tracksToAdd
      }
      this.httpService.HttpPost(url, JSON.stringify(data))
        .subscribe(response => {
      })
      tracksAdded += tracksToAdd.length;
      if (tracksAdded != trackCount){
        var tracksToAddCount = trackCount - tracksAdded;
        data = allTracks.slice(100, allTracks.length);
        this.addTracksToPlaylist(url, userId, playlistId, data)
      }
    }else{
      let data2 = {
        "uris": data
      }
      this.httpService.HttpPost(url, JSON.stringify(data2))
        .subscribe(response => {
          
          this.playlistGenerated = true;
        })
    }
  }

  removeFromTracklist(index){
    let track = this.trackList.tracks[index];
    this.trackList.tracks.splice(index, 1);
    this.refreshTrackList();
  }

  removeAllFromTracklist(id, type, name){
    if (type == 'artist'){
      this.trackList.tracks = this.trackList.tracks.filter(x => x.artist != name);
    }else if (type == 'album'){
      this.trackList.tracks = this.trackList.tracks.filter(x => x.album != name);
    }
    let message = name + " has been removed from your playlist";
    this.httpService.NotificationHandler('success', message);
    this.refreshTrackList();
  }

  refreshTrackList(){
    this.dataSource.data = this.trackList.tracks;
  }

}