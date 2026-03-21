import { TestBed } from '@angular/core/testing';

import { Hola } from './hola';

describe('Hola', () => {
  let service: Hola;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hola);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
