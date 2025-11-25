/**
 * Componente de formulario para entrada de datos financieros
 *
 * Este componente maneja la entrada de los tres parámetros necesarios
 * para calcular el financiamiento: importe, cuotas y TNA.
 */

import { useState } from 'react';
import { Button, Alert, Box, Typography } from '@mui/material';
import { Calculate as CalculateIcon } from '@mui/icons-material';
import type { CalculoFinancieroInput } from '../types/financial.types';
import styles from './CalculatorForm.module.css';

interface CalculatorFormProps {
  /** Callback que se ejecuta cuando se calcula el financiamiento */
  onCalculate: (input: CalculoFinancieroInput) => void;
  /** Mensaje de error a mostrar, si existe */
  errorMessage?: string;
}

/**
 * Formulario de entrada de datos para la calculadora financiera
 */
export function CalculatorForm({ onCalculate, errorMessage }: CalculatorFormProps) {
  // Estados para los campos del formulario
  const [importe, setImporte] = useState<string>('10000');
  const [cuotas, setCuotas] = useState<string>('12');
  const [tna, setTna] = useState<string>('120');
  const [arancelProcesador, setArancelProcesador] = useState<string>('0');
  const [feeRiesgoProcesador, setFeeRiesgoProcesador] = useState<string>('0');
  const [adicionalCobrador, setAdicionalCobrador] = useState<string>('0');
  const [impuestos, setImpuestos] = useState<string>('0');

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convertir strings a números
    const input: CalculoFinancieroInput = {
      importe: parseFloat(importe) || 0,
      cuotas: parseInt(cuotas) || 0,
      tna: parseFloat(tna) || 0,
      arancelProcesador: parseFloat(arancelProcesador) || 0,
      feeRiesgoProcesador: parseFloat(feeRiesgoProcesador) || 0,
      adicionalCobrador: parseFloat(adicionalCobrador) || 0,
      impuestos: parseFloat(impuestos) || 0
    };

    onCalculate(input);
  };

  /**
   * Valida que solo se ingresen números en el campo de importe
   */
  const handleImporteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir números decimales
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setImporte(value);
    }
  };

  /**
   * Maneja la selección de cuotas desde la botonera
   */
  const handleCuotasSelect = (cuotasValue: number) => {
    setCuotas(cuotasValue.toString());
  };

  /**
   * Valida que solo se ingresen números en el campo de TNA
   */
  const handleTnaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir números decimales
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTna(value);
    }
  };

  /**
   * Valida que solo se ingresen números en los campos porcentuales
   */
  const handlePorcentualChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    const value = e.target.value;
    // Permitir números decimales
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  /**
   * Calcula la TNA resultante en tiempo real
   */
  const calcularTnaResultante = (): number => {
    const tnaValue = parseFloat(tna) || 0;
    const arancelValue = parseFloat(arancelProcesador) || 0;
    const feeRiesgoValue = parseFloat(feeRiesgoProcesador) || 0;
    const adicionalValue = parseFloat(adicionalCobrador) || 0;
    const impuestosValue = parseFloat(impuestos) || 0;
    return tnaValue + arancelValue + feeRiesgoValue + adicionalValue + impuestosValue;
  };

  return (
    <Box className={styles.formContainer}>
      <Typography variant="h5" className={styles.formTitle}>
        Calculadora de Cuotas Procesador
      </Typography>

      <form onSubmit={handleSubmit} className={styles.formContent}>
        {/* Campo de Importe */}
        <div className={styles.inputGroup}>
          <label htmlFor="importe" className={styles.label}>
            Importe:
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputPrefix}>$</span>
            <input
              id="importe"
              type="text"
              inputMode="decimal"
              value={importe}
              onChange={handleImporteChange}
              required
              className={styles.input}
              placeholder="10000"
            />
          </div>
          <span className={styles.helperText}>Monto a financiar en pesos</span>
        </div>

        {/* Campo de Cuotas */}
        <div className={styles.inputGroup}>
          <label htmlFor="cuotas" className={styles.label}>
            Cantidad de Cuotas:
          </label>
          <div className={styles.cuotasButtonGroup}>
            {[1, 2, 3, 6, 9, 12, 18, 24].map((cuotasValue) => (
              <button
                key={cuotasValue}
                type="button"
                onClick={() => handleCuotasSelect(cuotasValue)}
                className={`${styles.cuotasButton} ${
                  cuotas === cuotasValue.toString() ? styles.cuotasButtonActive : ''
                }`}
              >
                {cuotasValue}
              </button>
            ))}
            <input
              id="cuotas"
              type="hidden"
              value={cuotas}
              required
            />
          </div>
          <span className={styles.helperText}>Seleccione el número de cuotas mensuales</span>
        </div>

        {/* Campo de TNA */}
        <div className={styles.inputGroup}>
          <label htmlFor="tna" className={styles.label}>
            TNA (Tasa Nominal Anual):
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="tna"
              type="text"
              inputMode="decimal"
              value={tna}
              onChange={handleTnaChange}
              required
              className={styles.input}
              placeholder="120"
            />
            <span className={styles.inputSuffix}>%</span>
          </div>
          <span className={styles.helperText}>Tasa nominal anual publicada en porcentaje</span>
        </div>

        {/* Campo de Arancel de Procesador */}
        <div className={styles.inputGroup}>
          <label htmlFor="arancelProcesador" className={styles.label}>
            Arancel de Procesador:
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="arancelProcesador"
              type="text"
              inputMode="decimal"
              value={arancelProcesador}
              onChange={(e) => handlePorcentualChange(e, setArancelProcesador)}
              className={styles.input}
              placeholder="0"
            />
            <span className={styles.inputSuffix}>%</span>
          </div>
          <span className={styles.helperText}>Arancel de Procesador en porcentaje</span>
        </div>

        {/* Campo de Fee de Riesgo de Procesador */}
        <div className={styles.inputGroup}>
          <label htmlFor="feeRiesgoProcesador" className={styles.label}>
            Fee de Riesgo de Procesador:
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="feeRiesgoProcesador"
              type="text"
              inputMode="decimal"
              value={feeRiesgoProcesador}
              onChange={(e) => handlePorcentualChange(e, setFeeRiesgoProcesador)}
              className={styles.input}
              placeholder="0"
            />
            <span className={styles.inputSuffix}>%</span>
          </div>
          <span className={styles.helperText}>Fee de riesgo de Procesador en porcentaje</span>
        </div>

        {/* Campo de Adicional de Cobrador */}
        <div className={styles.inputGroup}>
          <label htmlFor="adicionalCobrador" className={styles.label}>
            Adicional de Cobrador:
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="adicionalCobrador"
              type="text"
              inputMode="decimal"
              value={adicionalCobrador}
              onChange={(e) => handlePorcentualChange(e, setAdicionalCobrador)}
              className={styles.input}
              placeholder="0"
            />
            <span className={styles.inputSuffix}>%</span>
          </div>
          <span className={styles.helperText}>Adicional de Cobrador en porcentaje</span>
        </div>

        {/* Campo de Impuestos */}
        <div className={styles.inputGroup}>
          <label htmlFor="impuestos" className={styles.label}>
            Impuestos:
          </label>
          <div className={styles.inputWrapper}>
            <input
              id="impuestos"
              type="text"
              inputMode="decimal"
              value={impuestos}
              onChange={(e) => handlePorcentualChange(e, setImpuestos)}
              className={styles.input}
              placeholder="0"
            />
            <span className={styles.inputSuffix}>%</span>
          </div>
          <span className={styles.helperText}>Impuestos en porcentaje</span>
        </div>

        {/* Cuadro de TNA Resultante */}
        <div className={styles.tnaResultanteBox}>
          <div className={styles.tnaResultanteContent}>
            <Typography className={styles.tnaResultanteLabel}>
              TNA Resultante:
            </Typography>
            <Typography className={styles.tnaResultanteValue}>
              {calcularTnaResultante().toFixed(2)}%
            </Typography>
          </div>
        </div>

        {/* Botón de Calcular */}
        <Button
          type="submit"
          variant="contained"
          color="success"
          size="large"
          startIcon={<CalculateIcon />}
          className={styles.calculateButton}
          fullWidth
        >
          Calcular Financiamiento
        </Button>

        {/* Mensaje de Error */}
        {errorMessage && (
          <Alert severity="error" className={styles.errorAlert}>
            {errorMessage}
          </Alert>
        )}
      </form>
    </Box>
  );
}
