import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grafico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico.html',
  styleUrls: ['./grafico.css']
})
export class GraficoComponent implements OnChanges {

  @Input() prestamos: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prestamos']) {
      this.prestamos = this.prestamos || [];
    }
  }

  totalPorEstado(estado: string): number {
    return this.prestamos
      .filter((p: any) => p.estado === estado)
      .reduce((sum: number, p: any) => sum + Number(p.monto || 0), 0);
  }

  totalGeneral(): number {
    return this.prestamos.reduce(
      (sum: number, p: any) => sum + Number(p.monto || 0),
      0
    );
  }

  porcentajeEstado(estado: string): number {
    const total = this.totalGeneral();

    if (total <= 0) {
      return 0;
    }

    return Math.round((this.totalPorEstado(estado) / total) * 100);
  }

  abonosMensuales(): any[] {
    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    const totales = new Array(12).fill(0);

    this.prestamos.forEach((p: any) => {
      const fecha = new Date(p.fechaCreacion || p.fecha || new Date());
      const mes = fecha.getMonth();

      const monto = Number(p.monto || 0);
      const saldo = Number(p.saldoPendiente || 0);
      const abonado = Math.max(monto - saldo, 0);

      if (!isNaN(mes)) {
        totales[mes] += abonado;
      }
    });

    const maximo = Math.max(...totales, 1);

    return meses.map((mes, index) => ({
      mes,
      total: totales[index],
      porcentaje: Math.round((totales[index] / maximo) * 100)
    }));
  }

  formatearDinero(valor: number): string {
    if (valor === null || valor === undefined || isNaN(Number(valor))) {
      return '$ 0';
    }

    return '$ ' + Number(valor).toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}
