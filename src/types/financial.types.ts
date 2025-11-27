/**
 * Tipos TypeScript para cálculos financieros
 * Basado en el método de cálculo Procesador
 */

/**
 * Parámetros de entrada para realizar cálculos financieros
 */
export interface CalculoFinancieroInput {
  /** Monto financiado en pesos */
  importe: number;
  /** Número de cuotas (meses) */
  cuotas: number;
  /** Tasa Nominal Anual publicada en porcentaje (ej: 120 para 120%) */
  tna: number;
  /** Arancel de Procesador en porcentaje */
  arancelProcesador?: number;
  /** Fee de riesgo de Procesador en porcentaje */
  feeRiesgoProcesador?: number;
  /** Adicional de Cobrador en porcentaje */
  adicionalCobrador?: number;
  /** Impuestos en porcentaje */
  impuestos?: number;
  /** TNA Cobrador resultante (calculada automáticamente) */
  tnaCobrador?: number;
}

/**
 * Detalle de cálculos para una cuota específica
 */
export interface DetalleCuota {
  /** Número de cuota (1, 2, 3, etc.) */
  numeroCuota: number;
  /** Importe financiado (mismo para todas las cuotas) */
  importe: number;
  /** TNA resultante utilizada en el cálculo */
  tnaResultante: number;
  /** Valor de la cuota */
  cuota: number;
  /** Coeficiente específico de esta cuota según la fórmula del método Procesador */
  coeficiente: number;
  /** Coeficiente con IVA */
  coeficienteConIVA: number;
  /** Tasa Efectiva Anual (%) */
  tea: number;
  /** Costo Financiero Total (%) */
  cft: number;
  /** Tasa Directa (%) */
  tasaDirecta: number;
}

/**
 * Resultado completo de los cálculos financieros
 */
export interface ResultadoCalculos {
  /** Factor multiplicador del monto para calcular la cuota mensual */
  coeficiente: number;
  /** Tasa de interés aplicada directamente sobre el monto (%) */
  tasaDirecta: number;
  /** Coeficiente ajustado con IVA (21%) */
  coeficienteConIVA: number;
  /** Tasa Efectiva Anual considerando capitalización mensual (%) */
  tea: number;
  /** Costo Financiero Total incluyendo todos los costos (%) */
  cft: number;
  /** Valor de cada cuota mensual sin IVA */
  cuota: number;
  /** Valor de cada cuota mensual con IVA incluido */
  cuotaConIVA: number;
  /** Monto total a pagar al finalizar el préstamo sin IVA */
  montoTotal: number;
  /** Monto total a pagar al finalizar el préstamo con IVA */
  montoTotalConIVA: number;
  /** Interés total pagado sin IVA */
  interesTotal: number;
  /** Interés total pagado con IVA */
  interesTotalConIVA: number;
  /** Detalles de cálculos por cada cuota */
  detallesPorCuota: DetalleCuota[];
}

/**
 * Resultado de validación de datos de entrada
 */
export interface ValidationResult {
  /** Indica si los datos son válidos */
  isValid: boolean;
  /** Mensaje de error si la validación falla */
  errorMessage?: string;
}
