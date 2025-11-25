/**
 * Utilidades para cálculos financieros
 * Implementación del método Procesador para cálculo de cuotas
 *
 * Este módulo contiene funciones puras para realizar cálculos financieros
 * relacionados con préstamos y financiamiento.
 */

import type {
  CalculoFinancieroInput,
  ResultadoCalculos,
  ValidationResult
} from '../types/financial.types';

/**
 * Constante: IVA vigente en Argentina
 */
const IVA = 0.21; // 21%

/**
 * Valida los datos de entrada para los cálculos financieros
 *
 * @param input - Datos de entrada a validar
 * @returns Objeto con el resultado de la validación y mensaje de error si aplica
 */
export function validarDatosEntrada(input: CalculoFinancieroInput): ValidationResult {
  if (input.importe <= 0) {
    return {
      isValid: false,
      errorMessage: 'El importe debe ser mayor a cero'
    };
  }

  if (input.cuotas <= 0 || !Number.isInteger(input.cuotas)) {
    return {
      isValid: false,
      errorMessage: 'El número de cuotas debe ser un entero mayor a cero'
    };
  }

  if (input.tna < 0) {
    return {
      isValid: false,
      errorMessage: 'La TNA no puede ser negativa'
    };
  }

  return { isValid: true };
}

/**
 * Calcula la Tasa Efectiva Mensual (TEM) a partir de la TNA
 *
 * La TEM es la tasa nominal anual dividida entre 12 meses y convertida a decimal.
 *
 * IMPORTANTE: La TEM se mantiene con alta precisión (sin redondear) para cálculos intermedios.
 *
 * @param tna - Tasa Nominal Anual en porcentaje (ej: 120 para 120%)
 * @returns Tasa Efectiva Mensual en decimal (ej: 0.10 para 10%)
 *
 * @example
 * calcularTEM(120) // returns 0.10 (10% mensual)
 */
export function calcularTEM(tna: number): number {
  // No redondear TEM para mantener precisión en cálculos intermedios
  return (tna / 100) / 12;
}

/**
 * Calcula el coeficiente de financiamiento
 *
 * El coeficiente es el factor que se multiplica por el monto financiado
 * para obtener el valor de cada cuota mensual.
 *
 * Fórmula: Coeficiente = (TEM × (1 + TEM)^cuotas) / ((1 + TEM)^cuotas - 1)
 *
 * IMPORTANTE: El coeficiente se redondea a 6 decimales para coincidir con el método Fiserv.
 *
 * @param tem - Tasa Efectiva Mensual en decimal
 * @param cuotas - Número de cuotas
 * @returns Coeficiente de financiamiento redondeado a 6 decimales
 *
 * @example
 * calcularCoeficiente(0.10, 12) // returns ~0.14676
 */
export function calcularCoeficiente(tem: number, cuotas: number): number {
  // Caso especial: si la tasa es 0, el coeficiente es simplemente 1/cuotas
  if (tem === 0) {
    return Math.round((1 / cuotas) * 1000000) / 1000000;
  }

  const unoMasTEM = 1 + tem;
  const unoMasTEMElevadoCuotas = Math.pow(unoMasTEM, cuotas);
  const coeficiente = (tem * unoMasTEMElevadoCuotas) / (unoMasTEMElevadoCuotas - 1);

  // Redondear a 6 decimales (método Fiserv)
  return Math.round(coeficiente * 1000000) / 1000000;
}

/**
 * Calcula la Tasa Directa
 *
 * La tasa directa representa el costo total del financiamiento
 * expresado como porcentaje del capital prestado.
 *
 * Fórmula: Tasa Directa = ((Coeficiente × cuotas) - 1) × 100
 *
 * @param coeficiente - Coeficiente de financiamiento
 * @param cuotas - Número de cuotas
 * @returns Tasa directa en porcentaje
 *
 * @example
 * calcularTasaDirecta(0.14676, 12) // returns ~76.11%
 */
export function calcularTasaDirecta(coeficiente: number, cuotas: number): number {
  return ((coeficiente * cuotas) - 1) * 100;
}

/**
 * Calcula el coeficiente ajustado con IVA
 *
 * Aplica el IVA vigente (21%) al coeficiente de financiamiento.
 *
 * Fórmula: Coef c/IVA = Coeficiente × (1 + IVA)
 *
 * IMPORTANTE: El coeficiente con IVA se redondea a 6 decimales para coincidir con el método Fiserv.
 *
 * @param coeficiente - Coeficiente de financiamiento sin IVA (ya redondeado a 6 decimales)
 * @returns Coeficiente con IVA incluido redondeado a 6 decimales
 *
 * @example
 * calcularCoeficienteConIVA(0.14676) // returns ~0.17758
 */
export function calcularCoeficienteConIVA(coeficiente: number): number {
  const coeficienteConIVA = coeficiente * (1 + IVA);
  // Redondear a 6 decimales (método Fiserv)
  return Math.round(coeficienteConIVA * 1000000) / 1000000;
}

/**
 * Calcula la Tasa Efectiva Anual (TEA)
 *
 * La TEA es la tasa anual equivalente considerando la capitalización mensual.
 * Representa el verdadero costo anual del crédito.
 *
 * Fórmula: TEA = ((1 + TEM)^12 - 1) × 100
 *
 * @param tem - Tasa Efectiva Mensual en decimal
 * @returns Tasa Efectiva Anual en porcentaje
 *
 * @example
 * calcularTEA(0.10) // returns ~213.84%
 */
export function calcularTEA(tem: number): number {
  return (Math.pow(1 + tem, 12) - 1) * 100;
}

/**
 * Calcula el Costo Financiero Total (CFT)
 *
 * El CFT es el costo total del crédito expresado como tasa anual,
 * incluyendo todos los costos (intereses, comisiones, seguros, etc.).
 * Permite comparar diferentes opciones de financiamiento.
 *
 * Fórmula: CFT = ((Coeficiente × cuotas)^(12/cuotas) - 1) × 100
 *
 * @param coeficiente - Coeficiente de financiamiento
 * @param cuotas - Número de cuotas
 * @returns Costo Financiero Total en porcentaje
 *
 * @example
 * calcularCFT(0.14676, 12) // returns ~213.84%
 */
export function calcularCFT(coeficiente: number, cuotas: number): number {
  const coeficientePorCuotas = coeficiente * cuotas;
  const exponenteCFT = 12 / cuotas;

  return (Math.pow(coeficientePorCuotas, exponenteCFT) - 1) * 100;
}

/**
 * Calcula el valor de cada cuota mensual
 *
 * Multiplica el importe financiado por el coeficiente.
 *
 * IMPORTANTE: La cuota se redondea a 2 decimales para coincidir con el método Fiserv.
 *
 * @param importe - Monto financiado
 * @param coeficiente - Coeficiente de financiamiento (ya redondeado a 6 decimales)
 * @returns Valor de la cuota mensual redondeada a 2 decimales
 *
 * @example
 * calcularCuota(10000, 0.14676) // returns 1467.60
 */
export function calcularCuota(importe: number, coeficiente: number): number {
  const cuota = importe * coeficiente;
  // Redondear a 2 decimales (método Fiserv)
  return Math.round(cuota * 100) / 100;
}

/**
 * Calcula el monto total a pagar al finalizar el préstamo
 *
 * IMPORTANTE: El monto total se redondea a 2 decimales para coincidir con el método Fiserv.
 *
 * @param cuota - Valor de cada cuota (ya redondeada a 2 decimales)
 * @param numeroCuotas - Número de cuotas
 * @returns Monto total a pagar redondeado a 2 decimales
 *
 * @example
 * calcularMontoTotal(1467.60, 12) // returns 17611.20
 */
export function calcularMontoTotal(cuota: number, numeroCuotas: number): number {
  const montoTotal = cuota * numeroCuotas;
  // Redondear a 2 decimales (método Fiserv)
  return Math.round(montoTotal * 100) / 100;
}

/**
 * Calcula el interés total pagado
 *
 * IMPORTANTE: El interés total se redondea a 2 decimales para coincidir con el método Fiserv.
 *
 * @param montoTotal - Monto total a pagar (ya redondeado a 2 decimales)
 * @param importe - Monto original financiado
 * @returns Interés total pagado redondeado a 2 decimales
 *
 * @example
 * calcularInteresTotal(17611.20, 10000) // returns 7611.20
 */
export function calcularInteresTotal(montoTotal: number, importe: number): number {
  const interesTotal = montoTotal - importe;
  // Redondear a 2 decimales (método Fiserv)
  return Math.round(interesTotal * 100) / 100;
}

/**
 * Función principal que realiza todos los cálculos financieros
 *
 * Esta función orquesta todas las funciones de cálculo individuales
 * para generar un resultado completo con todos los valores financieros.
 *
 * @param input - Parámetros de entrada (importe, cuotas, tna)
 * @returns Objeto con todos los resultados calculados
 * @throws Error si los datos de entrada no son válidos
 *
 * @example
 * calcularFinanciamiento({
 *   importe: 10000,
 *   cuotas: 12,
 *   tna: 120
 * })
 * // returns ResultadoCalculos con todos los valores calculados
 */
export function calcularFinanciamiento(input: CalculoFinancieroInput): ResultadoCalculos {
  // 1. Validar datos de entrada
  const validacion = validarDatosEntrada(input);
  if (!validacion.isValid) {
    throw new Error(validacion.errorMessage);
  }

  const { importe, cuotas, tna, arancelProcesador = 0, feeRiesgoProcesador = 0, adicionalCobrador = 0, impuestos = 0 } = input;

  // 2. Calcular TNA Cobrador resultante (suma de TNA + todos los porcentajes adicionales)
  const tnaCobrador = tna + arancelProcesador + feeRiesgoProcesador + adicionalCobrador + impuestos;

  // 3. Calcular TEM (Tasa Efectiva Mensual) usando la TNA Cobrador resultante
  const tem = calcularTEM(tnaCobrador);

  // 4. Calcular Coeficiente
  const coeficiente = calcularCoeficiente(tem, cuotas);

  // 5. Calcular Tasa Directa
  const tasaDirecta = calcularTasaDirecta(coeficiente, cuotas);

  // 6. Calcular Coeficiente con IVA
  const coeficienteConIVA = calcularCoeficienteConIVA(coeficiente);

  // 7. Calcular TEA (Tasa Efectiva Anual)
  const tea = calcularTEA(tem);

  // 8. Calcular CFT (Costo Financiero Total)
  const cft = calcularCFT(coeficiente, cuotas);

  // 9. Calcular valores de cuotas y montos totales
  const cuota = calcularCuota(importe, coeficiente);
  const cuotaConIVA = calcularCuota(importe, coeficienteConIVA);
  const montoTotal = calcularMontoTotal(cuota, cuotas);
  const montoTotalConIVA = calcularMontoTotal(cuotaConIVA, cuotas);

  // 10. Calcular intereses totales
  const interesTotal = calcularInteresTotal(montoTotal, importe);
  const interesTotalConIVA = calcularInteresTotal(montoTotalConIVA, importe);

  // 11. Retornar todos los resultados
  return {
    coeficiente,
    tasaDirecta,
    coeficienteConIVA,
    tea,
    cft,
    cuota,
    cuotaConIVA,
    montoTotal,
    montoTotalConIVA,
    interesTotal,
    interesTotalConIVA
  };
}
