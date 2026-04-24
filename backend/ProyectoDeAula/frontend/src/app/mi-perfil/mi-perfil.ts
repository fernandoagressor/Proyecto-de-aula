// Importa decoradores y herramientas
// Component → define el componente
// OnInit → ejecuta código al iniciar
// ChangeDetectorRef → fuerza actualización de la vista
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

// Permite usar *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Permite usar [(ngModel)]
import { FormsModule } from '@angular/forms';

// Servicio para comunicación con backend
import { ClienteService } from '../services/cliente.service';

// Modelo Cliente
import { Cliente } from '../services/cliente';


// Decorador del componente
@Component({
  selector: 'app-mi-perfil', // Nombre en HTML

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './mi-perfil.html',

  styleUrls: ['./mi-perfil.css']
})

// Clase del componente
export class MiPerfilComponent implements OnInit {

  // Variable donde se guarda el cliente
  cliente: Cliente | null = null;

  // Mensaje de estado (éxito o error)
  mensaje: string = '';

  // Constructor con servicios
  constructor(
    private clienteService: ClienteService,
    private cd: ChangeDetectorRef // Permite actualizar la vista manualmente
  ) {}

  // Se ejecuta al iniciar el componente
  ngOnInit(): void {

    // Obtiene usuario guardado
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {

      // Convierte a objeto
      const usuario = JSON.parse(usuarioGuardado);

      // Si tiene clienteId
      if (usuario.clienteId) {

        // Carga el perfil
        this.cargarPerfil(usuario.clienteId);
      }
    }
  }

  // Método para cargar perfil desde backend
  cargarPerfil(clienteId: number): void {

    // Llama al backend (GET)
    this.clienteService.obtenerClientePorId(clienteId).subscribe({

      // Si llega la data
      next: (data: Cliente) => {

        // Guarda datos
        this.cliente = data;

        // Fuerza actualización de la vista
        this.cd.detectChanges();
      },

      // Error
      error: (err: any) => {
        console.error('Error al cargar perfil', err);
      }
    });
  }

  // Método para guardar cambios
  guardarCambios(): void {

    // Validación
    if (!this.cliente || this.cliente.id == null) {
      return;
    }

    // Crea objeto actualizado
    const clienteActualizado: Cliente = {

      id: this.cliente.id,

      nombre: this.cliente.nombre,

      cedula: this.cliente.cedula,

      telefono: this.cliente.telefono,

      direccion: this.cliente.direccion
    };

    // Llama al backend (PUT)
    this.clienteService.actualizarCliente(this.cliente.id, clienteActualizado).subscribe({

      // Si todo sale bien
      next: (data: Cliente) => {

        // Actualiza el cliente en pantalla
        this.cliente = data;

        // Mensaje de éxito
        this.mensaje = 'Perfil actualizado correctamente';

        // Refresca la vista
        this.cd.detectChanges();
      },

      // Error
      error: (err: any) => {

        console.error('Error al actualizar perfil', err);

        this.mensaje = 'Error al actualizar perfil';
      }
    });
  }
}
