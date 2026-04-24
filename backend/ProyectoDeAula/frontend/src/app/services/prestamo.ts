// Define la estructura de un préstamo en Angular
export interface Prestamo {

  // id del préstamo (opcional)
  // Se genera en la base de datos (MySQL)
  id?: number;

  // Objeto cliente asociado al préstamo
  cliente: {

    // id del cliente
    id: number;

    // nombre del cliente
    nombre: string;

    // cédula del cliente
    cedula: string;

    // teléfono del cliente
    telefono: string;

    // dirección del cliente
    direccion: string;
  };

  // monto del préstamo (ej: 1.000.000)
  monto: number;

  // cantidad de meses para pagar
  plazoMeses: number;

  // tasa de interés (ej: 0.02 = 2%)
  interes: number;

  // saldo que aún falta por pagar
  saldoPendiente: number;

  // valor de cada cuota mensual
  cuotaMensual: number;

  // estado del préstamo
  // Ej: "PENDIENTE", "APROBADO", "RECHAZADO", "PAGADO"
  estado: string;

  // número de cuotas restantes (opcional)
  cuotasRestantes?: number;
}
