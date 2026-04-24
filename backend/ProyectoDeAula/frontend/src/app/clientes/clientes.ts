// Importa decorador Component y ciclo de vida OnInit
// Component → define el componente
// OnInit → permite ejecutar código al iniciar
import { Component, OnInit } from '@angular/core';

// Importa CommonModule (para usar *ngIf, *ngFor)
import { CommonModule } from '@angular/common';

// Importa FormsModule (para usar [(ngModel)])
import { FormsModule } from '@angular/forms';

// Importa el servicio que conecta con el backend
import { ClienteService } from '../services/cliente.service';


// Decorador del componente
@Component({

  // Nombre del componente en HTML
  selector: 'app-clientes',

  // Componente standalone
  standalone: true,

  // Módulos que puede usar
  imports: [CommonModule, FormsModule],

  // HTML asociado
  templateUrl: './clientes.html',

  // CSS asociado
  styleUrls: ['./clientes.css']
})

// Clase principal del componente
export class ClientesComponent implements OnInit {

  // Lista donde se guardan los clientes
  clientes: any[] = [];

  // Objeto para crear o editar cliente
  nuevoCliente = {
    nombre: '',
    cedula: '',
    telefono: '',
    direccion: ''
  };

  // Variable para saber si se está editando un cliente
  clienteEditando: any = null;

  // Constructor con inyección del servicio
  constructor(private clienteService: ClienteService) {}

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {

    // Carga los clientes desde el backend
    this.cargarClientes();
  }

  // Método para obtener clientes
  cargarClientes(): void {

    // Llama al backend (HTTP GET)
    this.clienteService.listarClientes().subscribe({

      // Si la respuesta es exitosa
      next: (data: any[]) => {

        // Guarda los clientes en la variable
        this.clientes = data;
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al cargar clientes', err);
      }
    });
  }

  // Método para crear cliente
  crearCliente(): void {

    // Validación: todos los campos deben tener datos
    if (
      !this.nuevoCliente.nombre ||
      !this.nuevoCliente.cedula ||
      !this.nuevoCliente.telefono ||
      !this.nuevoCliente.direccion
    ) {
      return; // Detiene la ejecución si falta algo
    }

    // Llama al backend (HTTP POST)
    this.clienteService.crearCliente(this.nuevoCliente).subscribe({

      // Si se crea correctamente
      next: () => {

        // Recarga la lista de clientes
        this.cargarClientes();

        // Limpia el formulario
        this.limpiarFormulario();
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al crear cliente', err);
      }
    });
  }

  // Método para seleccionar cliente a editar
  editarCliente(cliente: any): void {

    // Guarda el cliente seleccionado
    this.clienteEditando = cliente;

    // Copia los datos al formulario
    this.nuevoCliente = {
      nombre: cliente.nombre,
      cedula: cliente.cedula,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    };
  }

  // Método para actualizar cliente
  actualizarCliente(): void {

    // Si no hay cliente seleccionado, no hace nada
    if (!this.clienteEditando) {
      return;
    }

    // Crea objeto con datos actualizados
    const clienteActualizado = {
      id: this.clienteEditando.id,
      nombre: this.nuevoCliente.nombre,
      cedula: this.nuevoCliente.cedula,
      telefono: this.nuevoCliente.telefono,
      direccion: this.nuevoCliente.direccion
    };

    // Llama al backend (HTTP PUT)
    this.clienteService.actualizarCliente(clienteActualizado.id, clienteActualizado).subscribe({

      // Si todo sale bien
      next: () => {

        // Recarga la lista
        this.cargarClientes();

        // Cancela modo edición
        this.cancelarEdicion();
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al actualizar cliente', err);
      }
    });
  }

  // Método para eliminar cliente
  eliminarCliente(id: number): void {

    // Llama al backend (HTTP DELETE)
    this.clienteService.eliminarCliente(id).subscribe({

      // Si se elimina correctamente
      next: () => {

        // Recarga la lista
        this.cargarClientes();
      },

      // Si ocurre error
      error: (err: any) => {
        console.error('Error al eliminar cliente', err);
      }
    });
  }

  // Cancela la edición
  cancelarEdicion(): void {

    // Quita el cliente seleccionado
    this.clienteEditando = null;

    // Limpia formulario
    this.limpiarFormulario();
  }

  // Limpia el formulario
  limpiarFormulario(): void {

    // Reinicia los campos
    this.nuevoCliente = {
      nombre: '',
      cedula: '',
      telefono: '',
      direccion: ''
    };
  }
}
