// Importa Component, OnInit, Inject y PLATFORM_ID
// Inject → permite inyectar valores especiales de Angular
// PLATFORM_ID → indica si estamos en navegador o servidor
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

// Importa CommonModule y función para validar si estamos en navegador
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Servicio que conecta con el backend
import { PrestamoService } from '../services/prestamo.service';

// Modelo de datos
import { Prestamo } from '../services/prestamo';

// Componente del gráfico
import { GraficoComponent } from '../grafico/grafico';


// Decorador del componente
@Component({
  selector: 'app-dashboard', // Nombre del componente

  standalone: true, // No necesita módulo

  imports: [CommonModule, GraficoComponent], // Módulos y componentes usados

  templateUrl: './dashboard.html', // HTML asociado
  styleUrls: ['./dashboard.css']   // CSS asociado
})

// Clase del componente
export class DashboardComponent implements OnInit {

  // Lista de préstamos
  prestamos: Prestamo[] = [];

  // Variables para mostrar en el dashboard
  totalPrestamos: number = 0;
  totalPrestado: number = 0;
  saldoPendiente: number = 0;
  totalAbonado: number = 0;

  // Constructor con inyección de dependencias
  constructor(

    // Servicio para obtener préstamos
    private prestamoService: PrestamoService,

    // Detecta si estamos en navegador
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {

    // Carga los datos
    this.cargarDatos();
  }

  // Función para formatear dinero
  formatearDinero(valor: number): string {

    // Convierte número a formato colombiano
    return '$ ' + valor.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  // Método para cargar datos
  cargarDatos(): void {

    // Verifica que esté en navegador (evita errores con localStorage)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Obtiene el usuario guardado en el navegador
    const usuario = localStorage.getItem('usuarioLogueado');

    // Si no hay usuario, no hace nada
    if (!usuario) {
      return;
    }

    // Convierte el JSON a objeto
    const usuarioObj = JSON.parse(usuario);

    // Si el usuario es cliente
    if (usuarioObj.rol === 'cliente' && usuarioObj.clienteId) {

      // Consulta solo sus préstamos
      this.prestamoService.listarPorCliente(usuarioObj.clienteId).subscribe({

        // Si llega la data
        next: (data: Prestamo[]) => {

          // Calcula resumen
          this.calcularResumen(data);
        },

        // Error
        error: (err: any) => {
          console.error('Error cargando dashboard cliente', err);
        }
      });

    } else {

      // Si es admin o empleado, carga todos los préstamos
      this.prestamoService.listarPrestamos().subscribe({

        next: (data: Prestamo[]) => {
          this.calcularResumen(data);
        },

        error: (err: any) => {
          console.error('Error cargando dashboard general', err);
        }
      });
    }
  }

  // Método para calcular estadísticas
  calcularResumen(data: Prestamo[]): void {

    // Guarda la lista
    this.prestamos = data;

    // Total de préstamos
    this.totalPrestamos = data.length;

    // Suma total prestado
    this.totalPrestado = data.reduce((sum, p) => sum + p.monto, 0);

    // Suma de saldos pendientes
    this.saldoPendiente = data.reduce((sum, p) => sum + p.saldoPendiente, 0);

    // Calcula lo abonado
    this.totalAbonado = data.reduce((sum, p) => {

      // Total con interés
      const totalConInteres = p.monto + (p.monto * p.interes);

      // Lo abonado = total - saldo pendiente
      return sum + (totalConInteres - p.saldoPendiente);

    }, 0);
  }
}
