// Define la estructura de un objeto Abono en Angular
export interface Abono {

  // id es opcional (puede venir o no del backend)
  // Se usa para identificar el abono en la base de datos
  id?: number;

  // monto del abono (ej: 50000)
  monto: number;

  // fecha en la que se realizó el abono
  // Viene como texto (string) desde el backend
  // Ejemplo: "2026-04-20T10:30:00"
  fecha: string;

  // estado del abono (opcional)
  // Ej: "PENDIENTE", "APROBADO", "RECHAZADO"
  estado?: string;

  // Relación con el préstamo (opcional)
  prestamo?: {

    // id del préstamo al que pertenece el abono
    id: number;

    // Relación con el cliente (opcional)
    cliente?: {

      // id del cliente
      id: number;

      // nombre del cliente
      nombre: string;

      // cédula del cliente
      cedula: string;
    };
  };
}
