import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAbonos } from './historial-abonos';

describe('HistorialAbonos', () => {
  let component: HistorialAbonos;
  let fixture: ComponentFixture<HistorialAbonos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialAbonos],
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialAbonos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
