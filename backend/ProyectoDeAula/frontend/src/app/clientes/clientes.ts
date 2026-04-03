import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../services/cliente';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];

  nuevoCliente: Cliente = {
    nombre: '',
    cedula: '',
    telefono: '',
    direccion: ''
  };

  clienteSeleccionado: Cliente | null = null;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.clienteService.listarClientes().subscribe({
      next: (data: Cliente[]) => {
        this.clientes = data;
      },
      error: (err: any) => {
        console.error('Error al obtener clientes', err);
      }
    });
  }

  crearCliente(): void {
    this.clienteService.crearCliente(this.nuevoCliente).subscribe({
      next: () => {
        this.obtenerClientes();
        this.nuevoCliente = {
          nombre: '',
          cedula: '',
          telefono: '',
          direccion: ''
        };
      },
      error: (err: any) => {
        console.error('Error al crear cliente', err);
      }
    });
  }

  seleccionarCliente(cliente: Cliente): void {
    this.clienteSeleccionado = { ...cliente };
  }

  actualizarCliente(): void {
    if (!this.clienteSeleccionado || this.clienteSeleccionado.id == null) {
      return;
    }

    this.clienteService.actualizarCliente(this.clienteSeleccionado.id, this.clienteSeleccionado).subscribe({
      next: () => {
        this.obtenerClientes();
        this.clienteSeleccionado = null;
      },
      error: (err: any) => {
        console.error('Error al actualizar cliente', err);
      }
    });
  }

  eliminarCliente(id: number): void {
    this.clienteService.eliminarCliente(id).subscribe({
      next: () => {
        this.obtenerClientes();
      },
      error: (err: any) => {
        console.error('Error al eliminar cliente', err);
      }
    });
  }

  cancelarEdicionCliente(): void {
    this.clienteSeleccionado = null;
  }
}
