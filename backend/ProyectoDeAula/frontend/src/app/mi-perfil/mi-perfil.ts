import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../services/cliente';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css']
})
export class MiPerfilComponent implements OnInit {

  cliente: Cliente | null = null;
  mensaje: string = '';

  constructor(
    private clienteService: ClienteService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);

      if (usuario.clienteId) {
        this.cargarPerfil(usuario.clienteId);
      }
    }
  }

  cargarPerfil(clienteId: number): void {
    this.clienteService.obtenerClientePorId(clienteId).subscribe({
      next: (data: Cliente) => {
        this.cliente = data;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar perfil', err);
      }
    });
  }

  guardarCambios(): void {
    if (!this.cliente || this.cliente.id == null) {
      return;
    }

    const clienteActualizado: Cliente = {
      id: this.cliente.id,
      nombre: this.cliente.nombre,
      cedula: this.cliente.cedula,
      telefono: this.cliente.telefono,
      direccion: this.cliente.direccion
    };

    this.clienteService.actualizarCliente(this.cliente.id, clienteActualizado).subscribe({
      next: (data: Cliente) => {
        this.cliente = data;
        this.mensaje = 'Perfil actualizado correctamente';
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al actualizar perfil', err);
        this.mensaje = 'Error al actualizar perfil';
      }
    });
  }
}
