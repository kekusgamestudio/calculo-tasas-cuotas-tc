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

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convertir strings a números
    const input: CalculoFinancieroInput = {
      importe: parseFloat(importe) || 0,
      cuotas: parseInt(cuotas) || 0,
      tna: parseFloat(tna) || 0
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
   * Valida que solo se ingresen números enteros en el campo de cuotas
   */
  const handleCuotasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo números enteros
    if (value === '' || /^\d+$/.test(value)) {
      setCuotas(value);
    }
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

  return (
    <Box className={styles.formContainer}>
      <Typography variant="h5" className={styles.formTitle}>
        Calculadora de Cuotas Fiserv
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
          <div className={styles.inputWrapper}>
            <input
              id="cuotas"
              type="text"
              inputMode="numeric"
              value={cuotas}
              onChange={handleCuotasChange}
              required
              className={styles.input}
              placeholder="12"
            />
          </div>
          <span className={styles.helperText}>Número de cuotas mensuales</span>
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
          <span className={styles.helperText}>Tasa nominal anual en porcentaje</span>
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
