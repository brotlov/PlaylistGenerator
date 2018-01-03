import { TestBed, inject } from '@angular/core/testing';

import { PlaylistTracksService } from '../services/playlist-tracks.service';

describe('PlaylistTracksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlaylistTracksService]
    });
  });

  it('should be created', inject([PlaylistTracksService], (service: PlaylistTracksService) => {
    expect(service).toBeTruthy();
  }));
});
