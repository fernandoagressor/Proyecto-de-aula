import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface EmpresaAliada {
  id: number;
  nombre: string;
  nit: string;
  responsable: string;
  telefono: string;
  correo: string;
  cupoAprobado: number;
  estado: 'ACTIVA' | 'INACTIVA';
}

@Component({
  selector: 'app-empresas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresas-admin.component.html',
  styleUrls: ['./empresas-admin.component.css']
})
export class EmpresasAdminComponent {

  empresas: EmpresaAliada[] = [
    {
      id: 1,
      nombre: 'Constructora Andina S.A.S',
      nit: '901234567-8',
      responsable: 'Laura Gómez',
      telefono: '3001234567',
      correo: 'contacto@constructoraandina.com',
      cupoAprobado: 50000000,
      estado: 'ACTIVA'
    },
    {
      id: 2,
      nombre: 'Servicios Integrales del Caribe',
      nit: '900456789-1',
      responsable: 'Carlos Méndez',
      telefono: '3109876543',
      correo: 'admin@servicioscaribe.com',
      cupoAprobado: 28000000,
      estado: 'ACTIVA'
    }
  ];

  empresaEditando: EmpresaAliada | null = null;

  nuevaEmpresa: EmpresaAliada = {
    id: 0,
    nombre: '',
    nit: '',
    responsable: '',
    telefono: '',
    correo: '',
    cupoAprobado: 0,
    estado: 'ACTIVA'
  };

  mensaje: string = '';

  crearEmpresa(): void {
    this.mensaje = '';

    if (
      !this.nuevaEmpresa.nombre ||
      !this.nuevaEmpresa.nit ||
      !this.nuevaEmpresa.responsable ||
      !this.nuevaEmpresa.telefono ||
      !this.nuevaEmpresa.correo ||
      !this.nuevaEmpresa.cupoAprobado
    ) {
      this.mensaje = 'Completa todos los campos antes de registrar la empresa.';
      return;
    }

    const nueva: EmpresaAliada = {
      ...this.nuevaEmpresa,
      id: this.generarId()
    };

    this.empresas.unshift(nueva);
    this.limpiarFormulario();

    this.mensaje = 'Empresa registrada correctamente.';
  }

  editarEmpresa(empresa: EmpresaAliada): void {
    this.empresaEditando = empresa;

    this.nuevaEmpresa = {
      ...empresa
    };

    this.mensaje = '';
  }

  actualizarEmpresa(): void {
    if (!this.empresaEditando) {
      return;
    }

    const index = this.empresas.findIndex(e => e.id === this.empresaEditando?.id);

    if (index !== -1) {
      this.empresas[index] = {
        ...this.nuevaEmpresa,
        id: this.empresaEditando.id
      };
    }

    this.cancelarEdicion();
    this.mensaje = 'Empresa actualizada correctamente.';
  }

  cambiarEstado(empresa: EmpresaAliada): void {
    empresa.estado = empresa.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';
  }

  eliminarEmpresa(id: number): void {
    this.empresas = this.empresas.filter(e => e.id !== id);
    this.mensaje = 'Empresa eliminada correctamente.';
  }

  cancelarEdicion(): void {
    this.empresaEditando = null;
    this.limpiarFormulario();
  }

  limpiarFormulario(): void {
    this.nuevaEmpresa = {
      id: 0,
      nombre: '',
      nit: '',
      responsable: '',
      telefono: '',
      correo: '',
      cupoAprobado: 0,
      estado: 'ACTIVA'
    };
  }

  generarId(): number {
    if (this.empresas.length === 0) {
      return 1;
    }

    return Math.max(...this.empresas.map(e => e.id)) + 1;
  }

  formatearDinero(valor: number): string {
    if (!valor) {
      return '$ 0';
    }

    return '$ ' + valor.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  totalCupoAprobado(): number {
    return this.empresas.reduce((total, empresa) => total + empresa.cupoAprobado, 0);
  }

  totalEmpresasActivas(): number {
    return this.empresas.filter(e => e.estado === 'ACTIVA').length;
  }
}
