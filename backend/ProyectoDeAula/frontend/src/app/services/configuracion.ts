// Define la estructura de la configuración del sistema en Angular
export interface ConfiguracionSistema {

  // id opcional
  // Representa el identificador en la base de datos
  // Generalmente siempre será 1 porque solo hay una configuración global
  id?: number;

  // Tasa de interés del sistema
  // Es un número decimal (ej: 0.02 = 2%)
  tasaInteres: number;
}
