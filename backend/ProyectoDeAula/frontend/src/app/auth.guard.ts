import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const usuarioGuardado = localStorage.getItem('usuarioLogueado');

  if (!usuarioGuardado) {
    router.navigate(['/']);
    return false;
  }

  const usuario = JSON.parse(usuarioGuardado);
  const rol = usuario?.rol;
  const url = state.url;

  // =============================
  // ROL EMPRESA
  // =============================
  // La empresa administra empleados y préstamos internos.
  if (rol === 'empresa') {
    if (url.startsWith('/empresa-panel')) {
      return true;
    }

    router.navigate(['/empresa-panel/empleados']);
    return false;
  }

  // Vista del empleado de empresa

  if (rol === 'empleado_empresa') {
    const rutasEmpleadoEmpresa = [
      '/empresa-panel/dashboard',
      '/empresa-panel/mi-perfil',
      '/empresa-panel/mis-prestamos',
      '/empresa-panel/mis-prestamos-empleado',
      '/empresa-panel/solicitar-prestamo'
    ];

    if (rutasEmpleadoEmpresa.some(ruta => url.startsWith(ruta))) {
      return true;
    }

    router.navigate(['/empresa-panel/dashboard']);
    return false;
  }

  // =============================
  // ROL ADMINISTRADOR
  // =============================
  // El administrador entra al panel general.
  // También puede entrar al panel empresarial para probar.
  if (rol === 'administrador') {
    if (url.startsWith('/panel')) {
      return true;
    }

    if (url.startsWith('/empresa-panel')) {
      return true;
    }

    router.navigate(['/panel/dashboard']);
    return false;
  }

  // =============================
  // ROL EMPLEADO PRESTAFÁCIL
  // =============================
  if (rol === 'empleado') {
    if (url.startsWith('/panel')) {
      return true;
    }

    router.navigate(['/panel/dashboard']);
    return false;
  }

  // =============================
  // ROL CLIENTE
  // =============================
  if (rol === 'cliente') {
    const rutasCliente = [
      '/panel/dashboard',
      '/panel/mi-perfil',
      '/panel/mis-prestamos',
      '/panel/solicitar-prestamo',
      '/panel/historial-abonos'
    ];

    if (rutasCliente.some(ruta => url.startsWith(ruta))) {
      return true;
    }

    router.navigate(['/panel/mis-prestamos']);
    return false;
  }

  // =============================
  // ROL DESCONOCIDO
  // =============================
  localStorage.removeItem('usuarioLogueado');
  router.navigate(['/']);
  return false;
};
