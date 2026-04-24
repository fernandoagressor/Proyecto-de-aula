// Importa el decorador Component y el ciclo de vida OnInit
// Component → define el componente de Angular
// OnInit → permite ejecutar código al iniciar el componente
import { Component, OnInit } from '@angular/core';

// Importa CommonModule (necesario para usar *ngIf, *ngFor en componentes standalone)
import { CommonModule } from '@angular/common';

// Importa el servicio de abonos (conecta con backend)
import { AbonoService } from '../services/abono.service';

// Importa el servicio de préstamos (para aprobar/rechazar abonos)
import { PrestamoService } from '../services/prestamo.service';

// Importa el modelo Abono (estructura de datos)
import { Abono } from '../services/abono';


// Decorador del componente
@Component({

  // Nombre del componente en HTML
  // Se usa como <app-abonos-pendientes>
  selector: 'app-abonos-pendientes',

  // Indica que este componente es standalone (no necesita módulo)
  standalone: true,

  // Módulos que puede usar (ngIf, ngFor, etc.)
  imports: [CommonModule],

  // Archivo HTML asociado
  templateUrl: './abonos-pendientes.html',

  // Archivo CSS asociado
  styleUrls: ['./abonos-pendientes.css']
})

// Clase del componente
export class AbonosPendientesComponent implements OnInit {

  // Lista donde se guardan los abonos pendientes
  abonosPendientes: Abono[] = [];

  // Variable para mostrar mensajes en pantalla
  mensaje: string = '';

  // Constructor (inyección de dependencias)
  constructor(

    // Servicio para consultar abonos
    private abonoService: AbonoService,

    // Servicio para aprobar/rechazar abonos
    private prestamoService: PrestamoService
  ) {}

  // Método que se ejecuta automáticamente al iniciar el componente
  ngOnInit(): void {

    // Llama a la función para cargar abonos pendientes
    this.cargarPendientes();
  }

  // Método para obtener abonos pendientes desde el backend
  cargarPendientes(): void {

    // Llama al servicio (HTTP GET al backend)
    this.abonoService.listarPendientes().subscribe({

      // Si la respuesta es exitosa
      next: (data: Abono[]) => {

        // Guarda los datos en la variable
        this.abonosPendientes = data;
      },

      // Si ocurre un error
      error: (err: any) => {

        // Muestra el error en consola
        console.error('Error al cargar abonos pendientes', err);
      }
    });
  }

  // Método para aprobar un abono
  aprobarAbono(abonoId: number): void {

    // Llama al backend (HTTP PUT)
    this.prestamoService.aprobarAbono(abonoId).subscribe({

      // Si todo sale bien
      next: () => {

        // Muestra mensaje de éxito
        this.mensaje = 'Abono aprobado correctamente';

        // Recarga la lista para actualizar la tabla
        this.cargarPendientes();
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al aprobar abono', err);
      }
    });
  }

  // Método para rechazar un abono
  rechazarAbono(abonoId: number): void {

    // Llama al backend (HTTP PUT)
    this.prestamoService.rechazarAbono(abonoId).subscribe({

      // Si todo sale bien
      next: () => {

        // Muestra mensaje
        this.mensaje = 'Abono rechazado correctamente';

        // Recarga la lista
        this.cargarPendientes();
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al rechazar abono', err);
      }
    });
  }

  // Método para formatear números como dinero
  formatearDinero(valor: number): string {

    // Convierte número a formato colombiano
    return '$ ' + valor.toLocaleString('es-CO', {

      // No mostrar decimales mínimos
      minimumFractionDigits: 0,

      // Máximo 2 decimales
      maximumFractionDigits: 2
    });
  }
}
