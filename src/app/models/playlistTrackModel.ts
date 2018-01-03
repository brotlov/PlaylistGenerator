export class playlistTrack {
    name: string;
    type: string;
    album: string;
    source: string;
    id: string;
    artist: string;
}

export class playlistTrackList {
    tracks: playlistTrack[];
}