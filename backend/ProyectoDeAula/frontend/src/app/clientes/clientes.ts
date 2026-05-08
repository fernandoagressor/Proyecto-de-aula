import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  busqueda: string = '';

  toastVisible: boolean = false;
  toastMensaje: string = '';
  toastTipo: 'success' | 'error' | 'warning' | 'info' = 'info';

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.clienteService.listarClientes().subscribe({
      next: (data: any[]) => {
        this.clientes = data || [];
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error al cargar clientes', err);

        this.clientes = [];
        this.mostrarToast('No fue posible cargar los clientes.', 'error');

        this.cdr.detectChanges();
      }
    });
  }

  crearCliente(): void {
    if (!this.formularioValido()) {
      this.mostrarToast('Debes completar nombre, cédula, teléfono y dirección.', 'warning');
      return;
    }

    this.clienteService.crearCliente(this.nuevoCliente).subscribe({
      next: () => {
        this.limpiarFormulario();
        this.cargarClientes();

        this.mostrarToast('Cliente creado correctamente.', 'success');
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error al crear cliente', err);

        const mensaje = err?.error?.mensaje || 'No fue posible crear el cliente.';
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  editarCliente(cliente: any): void {
    this.clienteEditando = cliente;

    this.nuevoCliente = {
      nombre: cliente.nombre || '',
      cedula: cliente.cedula || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || ''
    };

    this.mostrarToast('Modo edición activado para el cliente seleccionado.', 'info');
    this.cdr.detectChanges();

    setTimeout(() => {
      const form = document.getElementById('formCliente');
      if (form) {
        form.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  }

  actualizarCliente(): void {
    if (!this.clienteEditando) {
      this.mostrarToast('No hay ningún cliente seleccionado para actualizar.', 'warning');
      return;
    }

    if (!this.formularioValido()) {
      this.mostrarToast('Debes completar todos los campos antes de actualizar.', 'warning');
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
        this.cancelarEdicion();
        this.cargarClientes();

        this.mostrarToast('Cliente actualizado correctamente.', 'success');
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error al actualizar cliente', err);

        const mensaje = err?.error?.mensaje || 'No fue posible actualizar el cliente.';
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  eliminarCliente(id: number): void {
    const confirmar = confirm('¿Seguro que deseas eliminar este cliente?');

    if (!confirmar) {
      return;
    }

    this.clienteService.eliminarCliente(id).subscribe({
      next: () => {
        this.cargarClientes();

        this.mostrarToast('Cliente eliminado correctamente.', 'success');
        this.cdr.detectChanges();
      },

      error: (err: any) => {
        console.error('Error al eliminar cliente', err);

        const mensaje = err?.error?.mensaje || 'No fue posible eliminar el cliente.';
        this.mostrarToast(mensaje, 'error');

        this.cdr.detectChanges();
      }
    });
  }

  cancelarEdicion(): void {
    this.clienteEditando = null;
    this.limpiarFormulario();
    this.cdr.detectChanges();
  }

  limpiarFormulario(): void {
    this.nuevoCliente = {
      nombre: '',
      cedula: '',
      telefono: '',
      direccion: ''
    };
  }

  formularioValido(): boolean {
    return !!(
      this.nuevoCliente.nombre?.trim() &&
      this.nuevoCliente.cedula?.trim() &&
      this.nuevoCliente.telefono?.trim() &&
      this.nuevoCliente.direccion?.trim()
    );
  }

  obtenerClientesFiltrados(): any[] {
    const texto = this.busqueda.trim().toLowerCase();

    if (!texto) {
      return this.clientes;
    }

    return this.clientes.filter((cliente: any) => {
      const nombre = String(cliente.nombre || '').toLowerCase();
      const cedula = String(cliente.cedula || '').toLowerCase();
      const telefono = String(cliente.telefono || '').toLowerCase();
      const direccion = String(cliente.direccion || '').toLowerCase();

      return (
        nombre.includes(texto) ||
        cedula.includes(texto) ||
        telefono.includes(texto) ||
        direccion.includes(texto)
      );
    });
  }

  obtenerInicialCliente(cliente: any): string {
    const nombre = cliente?.nombre || 'C';
    return nombre.charAt(0).toUpperCase();
  }

  contarConTelefono(): number {
    return this.clientes.filter((cliente: any) => !!cliente.telefono).length;
  }

  contarConDireccion(): number {
    return this.clientes.filter((cliente: any) => !!cliente.direccion).length;
  }

  mostrarToast(
    mensaje: string,
    tipo: 'success' | 'error' | 'warning' | 'info' = 'info'
  ): void {
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
      this.cdr.detectChanges();
    }, 4200);
  }
}
