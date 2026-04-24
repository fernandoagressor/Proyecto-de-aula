// Importa Component y OnInit
// Component → define el componente
// OnInit → ejecuta código al iniciar
import { Component, OnInit } from '@angular/core';

// Permite usar *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Permite usar [(ngModel)]
import { FormsModule } from '@angular/forms';

// Servicio que conecta con el backend
import { ConfiguracionService } from '../services/configuracion.service';


// Decorador del componente
@Component({

  // Nombre del componente en HTML
  selector: 'app-configuracion',

  // Componente standalone
  standalone: true,

  // Módulos que puede usar
  imports: [CommonModule, FormsModule],

  // HTML asociado
  templateUrl: './configuracion.html',

  // CSS asociado
  styleUrl: './configuracion.css'
})

// Clase del componente
export class ConfiguracionComponent implements OnInit {

  // Variable donde se guarda la tasa de interés
  // Se usa string porque viene del input HTML
  tasaInteres: string = '';

  // Constructor con inyección del servicio
  constructor(private configuracionService: ConfiguracionService) {}

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {

    // Carga la configuración desde el backend
    this.cargarConfiguracion();
  }

  // Método para obtener la tasa actual
  cargarConfiguracion(): void {

    // Llama al backend (HTTP GET)
    this.configuracionService.obtenerConfiguracion().subscribe({

      // Si la respuesta es exitosa
      next: (data) => {

        // Convierte la tasa a string y la guarda
        this.tasaInteres = String(data.tasaInteres);
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al cargar configuración', err);
      }
    });
  }

  // Método para guardar nueva tasa
  guardarTasa(): void {

    // Llama al backend (HTTP PUT)
    this.configuracionService.actualizarTasa(this.tasaInteres).subscribe({

      // Si se actualiza correctamente
      next: (data) => {

        // Actualiza la variable con la nueva tasa
        this.tasaInteres = String(data.tasaInteres);

        // Muestra mensaje al usuario
        alert('Tasa actualizada correctamente');
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al actualizar tasa', err);
      }
    });
  }
}
