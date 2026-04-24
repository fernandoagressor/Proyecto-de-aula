// Importa herramientas de testing de Angular
// ComponentFixture → permite manipular el componente en pruebas
// TestBed → crea un entorno de pruebas simulado
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente que se va a probar
import { Grafico } from './grafico';


// Describe el grupo de pruebas para el componente Grafico
describe('Grafico', () => {

  // Variable que representa el componente
  let component: Grafico;

  // Variable que representa el entorno de prueba del componente
  let fixture: ComponentFixture<Grafico>;

  // beforeEach → se ejecuta antes de cada prueba
  beforeEach(async () => {

    // Configura el entorno de pruebas
    await TestBed.configureTestingModule({

      // Importa el componente (porque es standalone)
      imports: [Grafico],

    }).compileComponents(); // Compila el componente

    // Crea una instancia del componente
    fixture = TestBed.createComponent(Grafico);

    // Obtiene la instancia real del componente
    component = fixture.componentInstance;

    // Espera a que Angular termine de inicializar
    await fixture.whenStable();
  });

  // Prueba básica
  it('should create', () => {

    // Verifica que el componente se haya creado correctamente
    expect(component).toBeTruthy();
  });
});
