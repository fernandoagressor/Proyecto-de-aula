import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrls: ['./clientes.css']
})
export class ClientesComponent implements OnInit {

  clientes: any[] = [];

  nuevoCliente = {
    nombre: '',
    cedula: '',
    telefono: '',
    direccion: ''
  };

  clienteEditando: any = null;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.listarClientes().subscribe({
      next: (data: any[]) => {
        this.clientes = data;
      },
      error: (err: any) => {
        console.error('Error al cargar clientes', err);
      }
    });
  }

  crearCliente(): void {
    if (
      !this.nuevoCliente.nombre ||
      !this.nuevoCliente.cedula ||
      !this.nuevoCliente.telefono ||
      !this.nuevoCliente.direccion
    ) {
      return;
    }

    this.clienteService.crearCliente(this.nuevoCliente).subscribe({
      next: () => {
        this.cargarClientes();
        this.limpiarFormulario();
      },
      error: (err: any) => {
        console.error('Error al crear cliente', err);
      }
    });
  }

  editarCliente(cliente: any): void {
    this.clienteEditando = cliente;

    this.nuevoCliente = {
      nombre: cliente.nombre,
      cedula: cliente.cedula,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    };
  }

  actualizarCliente(): void {
    if (!this.clienteEditando) {
      return;
    }

    const clienteActualizado = {
      id: this.clienteEditando.id,
      nombre: this.nuevoCliente.nombre,
      cedula: this.nuevoCliente.cedula,
      telefono: this.nuevoCliente.telefono,
      direccion: this.nuevoCliente.direccion
    };

    this.clienteService.actualizarCliente(clienteActualizado.id, clienteActualizado).subscribe({
      next: () => {
        this.cargarClientes();
        this.cancelarEdicion();
      },
      error: (err: any) => {
        console.error('Error al actualizar cliente', err);
      }
    });
  }

  eliminarCliente(id: number): void {
    this.clienteService.eliminarCliente(id).subscribe({
      next: () => {
        this.cargarClientes();
      },
      error: (err: any) => {
        console.error('Error al eliminar cliente', err);
      }
    });
  }

  cancelarEdicion(): void {
    this.clienteEditando = null;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevoCliente = {
      nombre: '',
      cedula: '',
      telefono: '',
      direccion: ''
    };
  }
}
