// Importa el decorador Component de Angular
import { Component } from '@angular/core';

// Importa funcionalidades comunes (ngIf, ngFor, etc.)
import { CommonModule } from '@angular/common';

// Permite usar ngModel (formularios)
import { FormsModule } from '@angular/forms';

// Servicio para manejar préstamos (conexión al backend)
import { PrestamoService } from '../services/prestamo.service';


// Decorador del componente
@Component({

  // Nombre de la etiqueta HTML que representa este componente
  selector: 'app-solicitar-prestamo',

  // Indica que es un componente standalone (no necesita módulo)
  standalone: true,

  // Módulos que utiliza este componente
  imports: [CommonModule, FormsModule],

  // Archivo HTML asociado
  templateUrl: './solicitar-prestamo.html',

  // Archivo CSS asociado
  styleUrls: ['./solicitar-prestamo.css']
})
export class SolicitarPrestamoComponent {

  // Variable para almacenar el monto ingresado
  monto: string = '';

  // Variable para almacenar el plazo en meses
  plazoMeses: string = '';

  // Variable para mostrar mensajes al usuario
  mensaje: string = '';

  // Constructor: inyecta el servicio de préstamos
  constructor(private prestamoService: PrestamoService) {}

  // Método que se ejecuta al presionar el botón "Enviar solicitud"
  solicitarPrestamo(): void {

    // Obtiene el usuario guardado en el navegador
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    // Si no hay sesión activa
    if (!usuarioGuardado) {
      this.mensaje = 'No hay sesión activa';
      return;
    }

    // Convierte el string JSON a objeto
    const usuario = JSON.parse(usuarioGuardado);

    // Verifica que el usuario tenga un cliente asociado
    if (!usuario.clienteId) {
      this.mensaje = 'No se encontró el cliente asociado';
      return;
    }

    // Valida que los campos no estén vacíos
    if (!this.monto || !this.plazoMeses) {
      this.mensaje = 'Completa todos los campos';
      return;
    }

    // Valida que los valores sean mayores a 0
    if (Number(this.monto) <= 0 || Number(this.plazoMeses) <= 0) {
      this.mensaje = 'El monto y el plazo deben ser mayores a 0';
      return;
    }

    // Llama al servicio para enviar la solicitud al backend
    this.prestamoService.solicitarPrestamo({

      // Envía el id del cliente como string
      clienteId: String(usuario.clienteId),

      // Envía el monto ingresado
      monto: this.monto,

      // Envía el plazo ingresado
      plazoMeses: this.plazoMeses
    }).subscribe({

      // Si la petición fue exitosa
      next: () => {

        // Mensaje de éxito
        this.mensaje = 'Solicitud enviada correctamente';

        // Limpia los campos del formulario
        this.monto = '';
        this.plazoMeses = '';
      },

      // Si ocurre un error
      error: (err: any) => {

        // Muestra error en consola
        console.error('Error al solicitar préstamo', err);

        // Muestra mensaje personalizado o genérico
        this.mensaje = err?.error?.message || 'No se pudo enviar la solicitud';
      }
    });
  }
}
