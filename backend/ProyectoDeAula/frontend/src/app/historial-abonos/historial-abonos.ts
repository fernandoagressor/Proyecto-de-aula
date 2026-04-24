// Importa decorador Component y ciclo de vida OnInit
// Component → define el componente
// OnInit → ejecuta código al iniciar
import { Component, OnInit } from '@angular/core';

// Permite usar *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Servicio que conecta con el backend
import { AbonoService } from '../services/abono.service';

// Modelo de datos Abono
import { Abono } from '../services/abono';


// Decorador del componente
@Component({

  // Nombre del componente en HTML
  selector: 'app-historial-abonos',

  // Componente standalone
  standalone: true,

  // Módulos que puede usar
  imports: [CommonModule],

  // HTML asociado
  templateUrl: './historial-abonos.html',

  // CSS asociado
  styleUrls: ['./historial-abonos.css']
})

// Clase del componente
export class HistorialAbonosComponent implements OnInit {

  // Lista donde se guardan los abonos
  abonos: Abono[] = [];

  // Variable para controlar el estado de carga
  // true → está cargando
  // false → ya cargó
  cargando: boolean = true;

  // Constructor con inyección del servicio
  constructor(private abonoService: AbonoService) {}

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {

    // Llama a cargar los abonos
    this.cargarAbonos();
  }

  // Método para obtener abonos desde el backend
  cargarAbonos(): void {

    // Llama al backend (HTTP GET)
    this.abonoService.listarAbonos().subscribe({

      // Si la respuesta es exitosa
      next: (data: Abono[]) => {

        // Guarda los datos
        this.abonos = data;

        // Cambia estado a "ya cargado"
        this.cargando = false;
      },

      // Si ocurre error
      error: (err: any) => {

        // Muestra error en consola
        console.error('Error al cargar historial de abonos', err);

        // Igual cambia a false para quitar "cargando"
        this.cargando = false;
      }
    });
  }

  // Función para formatear dinero
  formatearDinero(valor: number): string {

    // Convierte número a formato colombiano
    return '$ ' + valor.toLocaleString('es-CO', {

      // Sin decimales obligatorios
      minimumFractionDigits: 0,

      // Máximo 2 decimales
      maximumFractionDigits: 2
    });
  }
}
