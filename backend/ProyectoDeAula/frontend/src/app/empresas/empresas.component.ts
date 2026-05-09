import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent {

  constructor(private router: Router) {}

  irAIngresarEmpresa(): void {
    const usuarioGuardado = localStorage.getItem('usuarioLogueado');

    if (usuarioGuardado) {
      this.router.navigate(['/empresa-panel/empresas']);
      return;
    }

    localStorage.setItem('destinoLogin', 'empresa');
    this.router.navigate(['/ingresar']);
  }

  solicitarDemo(): void {
    alert('Solicitud de demo empresarial recibida. Próximamente se conectará con backend.');
  }

  verProductos(): void {
    alert('Productos empresariales: préstamos a empleados, cupos empresariales, pagos y reportes.');
  }

  irAPersonas(): void {
    this.router.navigate(['/personas']);
  }

  irAPagos(): void {
    alert('Pagos empresariales: próximamente podrás consultar pagos, abonos y comprobantes.');
  }

  irAtencion(): void {
    alert('Atención empresarial: soporte para empresas, empleados y administradores.');
  }
}
