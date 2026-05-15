import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClienteService } from '../services/cliente.service';
import { Cliente } from '../services/cliente';

import { EmpleadoEmpresaService } from '../services/empleado-empresa.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mi-perfil.html',
  styleUrls: ['./mi-perfil.css']
})
export class MiPerfilComponent implements OnInit {

  cliente: Cliente | null = null;
  empleadoEmpresa: any = null;

  usuarioLogueado: any = null;
  tipoPerfil: 'cliente' | 'empleado_empresa' | '' = '';

  mensaje: string = '';

  constructor(
    private clienteService: ClienteService,
    private empleadoEmpresaService: EmpleadoEmpresaService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (!usuarioGuardado) {
      return;
    }

    this.usuarioLogueado = JSON.parse(usuarioGuardado);

    const rol = this.usuarioLogueado?.rol;

    if (rol === 'cliente') {
      this.tipoPerfil = 'cliente';

      if (this.usuarioLogueado?.clienteId) {
        this.cargarPerfilCliente(this.usuarioLogueado.clienteId);
      }

      return;
    }

    if (rol === 'empleado_empresa') {
      this.tipoPerfil = 'empleado_empresa';
      this.cargarPerfilEmpleadoEmpresa();
      return;
    }
  }

  cargarPerfilCliente(clienteId: number): void {
    this.clienteService.obtenerClientePorId(clienteId).subscribe({
      next: (data: Cliente) => {
        this.cliente = data;
        this.empleadoEmpresa = null;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar perfil cliente', err);
        this.mensaje = 'No fue posible cargar el perfil del cliente.';
      }
    });
  }

  cargarPerfilEmpleadoEmpresa(): void {
    const empresaId = this.usuarioLogueado?.empresaId;
    const usuarioAcceso = this.usuarioLogueado?.nombre;

    if (!empresaId || !usuarioAcceso) {
      this.mensaje = 'No se encontró la información del empleado.';
      return;
    }

    this.empleadoEmpresaService.listarPorEmpresa(empresaId).subscribe({
      next: (empleados: any[]) => {
        this.empleadoEmpresa =
          empleados.find(e => e.usuarioAcceso === usuarioAcceso) || null;

        this.cliente = null;

        if (!this.empleadoEmpresa) {
          this.mensaje = 'No se encontró el perfil del empleado.';
        }

        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar perfil empleado empresa', err);
        this.mensaje = 'No fue posible cargar el perfil del empleado.';
      }
    });
  }

  guardarCambios(): void {
    if (this.tipoPerfil === 'cliente') {
      this.guardarCambiosCliente();
      return;
    }

    if (this.tipoPerfil === 'empleado_empresa') {
      this.guardarCambiosEmpleadoEmpresa();
      return;
    }
  }

  guardarCambiosCliente(): void {
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

    this.clienteService.actualizarCliente(
      this.cliente.id,
      clienteActualizado
    ).subscribe({
      next: (data: Cliente) => {
        this.cliente = data;
        this.mensaje = 'Perfil actualizado correctamente';
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al actualizar perfil cliente', err);
        this.mensaje = 'Error al actualizar perfil';
      }
    });
  }

  guardarCambiosEmpleadoEmpresa(): void {
    if (!this.empleadoEmpresa || !this.empleadoEmpresa.id) {
      return;
    }

    const empleadoActualizado = {
      ...this.empleadoEmpresa,
      empresaId: this.usuarioLogueado?.empresaId
    };

    this.empleadoEmpresaService.actualizarEmpleado(
      this.empleadoEmpresa.id,
      empleadoActualizado
    ).subscribe({
      next: (data: any) => {
        this.empleadoEmpresa = data;
        this.mensaje = 'Perfil del empleado actualizado correctamente';
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al actualizar perfil empleado', err);
        this.mensaje = 'Error al actualizar perfil del empleado';
      }
    });
  }

  esCliente(): boolean {
    return this.tipoPerfil === 'cliente';
  }

  esEmpleadoEmpresa(): boolean {
    return this.tipoPerfil === 'empleado_empresa';
  }
}
