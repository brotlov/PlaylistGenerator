import { TestBed, inject } from '@angular/core/testing';

import { PlaylistParametersService } from './playlist-parameters.service';

describe('PlaylistParametersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlaylistParametersService]
    });
  });

  it('should be created', inject([PlaylistParametersService], (service: PlaylistParametersService) => {
    expect(service).toBeTruthy();
  }));
});
