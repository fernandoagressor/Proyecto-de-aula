// Importa herramientas de testing de Angular
// ComponentFixture → controla el componente en pruebas
// TestBed → crea un entorno de pruebas simulado
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente que se va a probar
import { HistorialAbonos } from './historial-abonos';


// describe → agrupa las pruebas relacionadas con este componente
describe('HistorialAbonos', () => {

  // Variable que representa la instancia del componente
  let component: HistorialAbonos;

  // Variable que representa el entorno de prueba del componente
  let fixture: ComponentFixture<HistorialAbonos>;

  // beforeEach → se ejecuta antes de cada prueba
  beforeEach(async () => {

    // Configura el entorno de pruebas
    await TestBed.configureTestingModule({

      // Importa el componente (porque es standalone)
      imports: [HistorialAbonos],

    }).compileComponents(); // Compila el componente

    // Crea una instancia del componente
    fixture = TestBed.createComponent(HistorialAbonos);

    // Obtiene la instancia real del componente
    component = fixture.componentInstance;

    // Espera a que Angular termine de procesar cambios
    await fixture.whenStable();
  });

  // Prueba básica
  it('should create', () => {

    // Verifica que el componente se haya creado correctamente
    expect(component).toBeTruthy();
  });
});
