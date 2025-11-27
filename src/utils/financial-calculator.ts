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
  ValidationResult,
  DetalleCuota
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
 * Calcula el coeficiente de descuento para una cuota específica según la fórmula del método Procesador
 *
 * Esta función implementa la fórmula de la imagen:
 * - Primera cuota (i=1): Coeficiente = 1 / (1 + (TNA × 28 / 360))
 * - Siguientes cuotas (i>1): Coeficiente = 1 / ((1 + (TNA × 28 / 360)) × (1 + (TNA × 30 / 360))^(i-1))
 *
 * @param tna - Tasa Nominal Anual en porcentaje (ej: 50 para 50%)
 * @param numeroCuota - Número de cuota (1 para primera, 2, 3, etc. para siguientes)
 * @returns Coeficiente de descuento para la cuota específica
 *
 * @example
 * calcularCoeficienteCuota(50, 1) // Primera cuota (28 días)
 * calcularCoeficienteCuota(50, 2) // Segunda cuota (30 días)
 */
export function calcularCoeficienteCuota(tna: number, numeroCuota: number): number {
  // Convertir TNA de porcentaje a decimal
  const tnaDecimal = tna / 100;
  
  // Factor para 28 días (primera cuota)
  const factor28Dias = 1 + (tnaDecimal * 28 / 360);
  
  // Si es la primera cuota (i=1)
  if (numeroCuota === 1) {
    return 1 / factor28Dias;
  }
  
  // Para siguientes cuotas (i>1)
  // Factor para 30 días
  const factor30Dias = 1 + (tnaDecimal * 30 / 360);
  
  // Calcular: 1 / ((1 + (TNA × 28 / 360)) × (1 + (TNA × 30 / 360))^(i-1))
  const exponente = numeroCuota - 1;
  const factor30Elevado = Math.pow(factor30Dias, exponente);
  
  return 1 / (factor28Dias * factor30Elevado);
}

/**
 * Calcula el Costo Financiero según la fórmula del método Procesador
 *
 * Fórmula: Costo Financiero = Valor Neto del Arancel × (1 - (1 / Cuotas Plan) × Σ[from i=1 to cuotas plan] (1 / ((1 + (TNA × 28 / 360)) × (1 + (TNA × 30 / 360))^(i-1))))
 *
 * @param valorNetoArancel - Valor Neto del Arancel (importe financiado)
 * @param cuotasPlan - Número de cuotas del plan
 * @param tna - Tasa Nominal Anual en porcentaje (debe ser la TNA resultante con todos los fees)
 * @returns Costo Financiero calculado
 *
 * @example
 * calcularCostoFinanciero(10000, 3, 50) // Calcula el costo financiero para 3 cuotas con TNA 50%
 */
export function calcularCostoFinanciero(valorNetoArancel: number, cuotasPlan: number, tna: number): number {
  // Calcular la suma de coeficientes (Σ)
  let sumaCoeficientes = 0;
  
  for (let i = 1; i <= cuotasPlan; i++) {
    const coeficiente = calcularCoeficienteCuota(tna, i);
    sumaCoeficientes += coeficiente;
  }
  
  // Calcular el factor: (1 / Cuotas Plan) × Σ[coeficientes]
  const factorDescuento = (1 / cuotasPlan) * sumaCoeficientes;
  
  // Calcular Costo Financiero
  const costoFinanciero = valorNetoArancel * (1 - factorDescuento);
  
  return costoFinanciero;
}

/**
 * Calcula el coeficiente promedio de financiamiento basado en la fórmula del método Procesador
 *
 * Este coeficiente se calcula como el promedio de los coeficientes de descuento de todas las cuotas,
 * y se usa para calcular el valor de cada cuota.
 *
 * @param tna - Tasa Nominal Anual en porcentaje (debe ser la TNA resultante con todos los fees)
 * @param cuotas - Número de cuotas
 * @returns Coeficiente promedio redondeado a 6 decimales
 *
 * @example
 * calcularCoeficientePromedio(50, 3) // Calcula el coeficiente promedio para 3 cuotas
 */
export function calcularCoeficientePromedio(tna: number, cuotas: number): number {
  // Calcular la suma de coeficientes
  let sumaCoeficientes = 0;
  
  for (let i = 1; i <= cuotas; i++) {
    sumaCoeficientes += calcularCoeficienteCuota(tna, i);
  }
  
  // El coeficiente promedio es la inversa del promedio de coeficientes de descuento
  // Para obtener el coeficiente de financiamiento, necesitamos calcular:
  // Coeficiente = 1 / (promedio de coeficientes de descuento)
  const promedioCoeficientesDescuento = sumaCoeficientes / cuotas;
  const coeficiente = 1 / promedioCoeficientesDescuento;
  
  // Redondear a 6 decimales
  return Math.round(coeficiente * 1000000) / 1000000;
}

/**
 * Calcula la Tasa Efectiva Mensual (TEM) a partir de la TNA
 *
 * NOTA: Esta función se mantiene para compatibilidad, pero el método Procesador
 * utiliza cálculos basados en días (28 y 30 días) en lugar de meses.
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
 * Calcula el coeficiente de financiamiento según el método Procesador
 *
 * El coeficiente es el factor que se multiplica por el monto financiado
 * para obtener el valor de cada cuota. Se calcula usando la fórmula del método Procesador
 * basada en períodos de 28 y 30 días.
 *
 * IMPORTANTE: El coeficiente se redondea a 6 decimales.
 *
 * @param tna - Tasa Nominal Anual en porcentaje (debe ser la TNA resultante con todos los fees)
 * @param cuotas - Número de cuotas
 * @returns Coeficiente de financiamiento redondeado a 6 decimales
 *
 * @example
 * calcularCoeficiente(50, 3) // Calcula el coeficiente para 3 cuotas con TNA 50%
 */
export function calcularCoeficiente(tna: number, cuotas: number): number {
  // Caso especial: si la tasa es 0, el coeficiente es simplemente 1/cuotas
  if (tna === 0) {
    return Math.round((1 / cuotas) * 1000000) / 1000000;
  }

  // Usar el método Procesador basado en días (28 y 30 días)
  return calcularCoeficientePromedio(tna, cuotas);
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
 * Calcula la Tasa Efectiva Anual (TEA) según el método Procesador
 *
 * La TEA se calcula basándose en el costo financiero total y el número de cuotas.
 * Para el método Procesador, se anualiza considerando los períodos de 28 y 30 días.
 *
 * @param importe - Monto financiado
 * @param cuotas - Número de cuotas
 * @param tna - Tasa Nominal Anual en porcentaje (debe ser la TNA resultante con todos los fees)
 * @returns Tasa Efectiva Anual en porcentaje
 *
 * @example
 * calcularTEA(10000, 3, 50) // Calcula la TEA para 3 cuotas con TNA 50%
 */
export function calcularTEA(importe: number, cuotas: number, tna: number): number {
  // Calcular el CFT (que ya incluye la anualización implícita)
  const cft = calcularCFT(importe, cuotas, tna);
  
  // Para el método Procesador, la TEA puede aproximarse al CFT
  // o calcularse considerando los períodos de días
  // Aproximación: TEA ≈ CFT para períodos cortos
  // Para mayor precisión, se puede calcular considerando los días exactos
  const costoFinanciero = calcularCostoFinanciero(importe, cuotas, tna);
  const montoTotal = importe + costoFinanciero;
  
  // Calcular días totales: 28 días (primera) + 30 días × (cuotas - 1)
  const diasTotales = 28 + (30 * (cuotas - 1));
  const años = diasTotales / 360;
  
  // TEA = ((Monto Total / Importe)^(1/años) - 1) × 100
  if (años > 0 && importe > 0) {
    const tea = (Math.pow(montoTotal / importe, 1 / años) - 1) * 100;
    return tea;
  }
  
  return cft;
}

/**
 * Calcula el Costo Financiero Total (CFT) según el método Procesador
 *
 * El CFT se calcula como el costo financiero total expresado como porcentaje
 * del importe financiado, basado en la fórmula del método Procesador.
 *
 * @param importe - Monto financiado (Valor Neto del Arancel)
 * @param cuotas - Número de cuotas
 * @param tna - Tasa Nominal Anual en porcentaje (debe ser la TNA resultante con todos los fees)
 * @returns Costo Financiero Total en porcentaje
 *
 * @example
 * calcularCFT(10000, 3, 50) // Calcula el CFT para 3 cuotas con TNA 50%
 */
export function calcularCFT(importe: number, cuotas: number, tna: number): number {
  // Calcular el costo financiero según la fórmula del método Procesador
  const costoFinanciero = calcularCostoFinanciero(importe, cuotas, tna);
  
  // Convertir a porcentaje del importe
  return (costoFinanciero / importe) * 100;
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
 * Calcula los detalles de cálculos para cada cuota individual
 *
 * Esta función genera un array con los detalles de cada cuota, incluyendo
 * el coeficiente específico de cada una según la fórmula del método Procesador.
 *
 * @param importe - Monto financiado
 * @param cuotas - Número de cuotas
 * @param tnaCobrador - TNA resultante (suma de TNA + todos los fees)
 * @param coeficientePromedio - Coeficiente promedio usado para calcular la cuota
 * @param tea - Tasa Efectiva Anual
 * @param cft - Costo Financiero Total
 * @param tasaDirecta - Tasa Directa
 * @returns Array con los detalles de cada cuota
 */
export function calcularDetallesPorCuota(
  importe: number,
  cuotas: number,
  tnaCobrador: number,
  coeficientePromedio: number,
  tea: number,
  cft: number,
  tasaDirecta: number
): DetalleCuota[] {
  const detalles: DetalleCuota[] = [];
  const cuota = calcularCuota(importe, coeficientePromedio);

  for (let i = 1; i <= cuotas; i++) {
    // Calcular el coeficiente específico de esta cuota según la fórmula
    const coeficienteCuota = calcularCoeficienteCuota(tnaCobrador, i);
    const coeficienteCuotaConIVA = calcularCoeficienteConIVA(coeficienteCuota);

    detalles.push({
      numeroCuota: i,
      importe,
      tnaResultante: tnaCobrador,
      cuota, // Todas las cuotas tienen el mismo valor
      coeficiente: Math.round(coeficienteCuota * 1000000) / 1000000, // Redondear a 6 decimales
      coeficienteConIVA: Math.round(coeficienteCuotaConIVA * 1000000) / 1000000,
      tea,
      cft,
      tasaDirecta
    });
  }

  return detalles;
}

/**
 * Función principal que realiza todos los cálculos financieros según el método Procesador
 *
 * Esta función implementa la fórmula del método Procesador basada en períodos de 28 y 30 días.
 * Utiliza la TNA resultante (suma de TNA + todos los fees y aranceles) para los cálculos.
 *
 * @param input - Parámetros de entrada (importe, cuotas, tna, y opcionalmente fees y aranceles)
 * @returns Objeto con todos los resultados calculados
 * @throws Error si los datos de entrada no son válidos
 *
 * @example
 * calcularFinanciamiento({
 *   importe: 10000,
 *   cuotas: 3,
 *   tna: 50,
 *   arancelProcesador: 5
 * })
 * // returns ResultadoCalculos con todos los valores calculados usando el método Procesador
 */
export function calcularFinanciamiento(input: CalculoFinancieroInput): ResultadoCalculos {
  // 1. Validar datos de entrada
  const validacion = validarDatosEntrada(input);
  if (!validacion.isValid) {
    throw new Error(validacion.errorMessage);
  }

  const { importe, cuotas, tna, arancelProcesador = 0, feeRiesgoProcesador = 0, adicionalCobrador = 0, impuestos = 0 } = input;

  // 2. Calcular TNA Cobrador resultante (suma de TNA + todos los porcentajes adicionales)
  // Esta es la TNA que se usa en la fórmula de la imagen
  const tnaCobrador = tna + arancelProcesador + feeRiesgoProcesador + adicionalCobrador + impuestos;

  // 3. Calcular Coeficiente usando el método Procesador (basado en 28 y 30 días)
  const coeficiente = calcularCoeficiente(tnaCobrador, cuotas);

  // 4. Calcular Tasa Directa
  const tasaDirecta = calcularTasaDirecta(coeficiente, cuotas);

  // 5. Calcular Coeficiente con IVA
  const coeficienteConIVA = calcularCoeficienteConIVA(coeficiente);

  // 6. Calcular TEA (Tasa Efectiva Anual) usando el método Procesador
  const tea = calcularTEA(importe, cuotas, tnaCobrador);

  // 7. Calcular CFT (Costo Financiero Total) usando el método Procesador
  const cft = calcularCFT(importe, cuotas, tnaCobrador);

  // 8. Calcular valores de cuotas y montos totales
  const cuota = calcularCuota(importe, coeficiente);
  const cuotaConIVA = calcularCuota(importe, coeficienteConIVA);
  const montoTotal = calcularMontoTotal(cuota, cuotas);
  const montoTotalConIVA = calcularMontoTotal(cuotaConIVA, cuotas);

  // 9. Calcular intereses totales
  const interesTotal = calcularInteresTotal(montoTotal, importe);
  const interesTotalConIVA = calcularInteresTotal(montoTotalConIVA, importe);

  // 10. Calcular detalles por cuota
  const detallesPorCuota = calcularDetallesPorCuota(
    importe,
    cuotas,
    tnaCobrador,
    coeficiente,
    tea,
    cft,
    tasaDirecta
  );

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
    interesTotalConIVA,
    detallesPorCuota
  };
}
