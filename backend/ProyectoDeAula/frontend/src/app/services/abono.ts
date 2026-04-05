export interface Abono {
  id?: number;
  monto: number;
  fecha: string;
  prestamo?: {
    id: number;
    cliente?: {
      id: number;
      nombre: string;
      cedula: string;
    };
  };
}
