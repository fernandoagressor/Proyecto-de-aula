export interface Abono {
  id?: number;
  monto: number;
  fecha: string;
  prestamo: {
    id: number;
  };
}
