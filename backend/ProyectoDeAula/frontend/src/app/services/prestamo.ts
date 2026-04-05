export interface Prestamo {
  id?: number;
  cliente: {
    id: number;
    nombre: string;
    cedula: string;
    telefono: string;
    direccion: string;
  };
  monto: number;
  plazoMeses: number;
  interes: number;
  saldoPendiente: number;
  cuotaMensual: number;
  estado: string;
  cuotasRestantes?: number;
}
