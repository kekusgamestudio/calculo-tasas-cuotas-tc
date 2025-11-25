/**
 * Componente principal de la aplicación
 * Calculadora de Cuotas Fiserv
 */

import { useState } from 'react';
import { Container, Box, Typography, Divider } from '@mui/material';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { calcularFinanciamiento } from './utils/financial-calculator';
import type { CalculoFinancieroInput, ResultadoCalculos } from './types/financial.types';
import './App.css';

function App() {
  // Estado para almacenar los resultados del cálculo
  const [resultados, setResultados] = useState<ResultadoCalculos | null>(null);

  // Estado para almacenar el input del usuario (para mostrarlo en resultados)
  const [inputUsuario, setInputUsuario] = useState<CalculoFinancieroInput | null>(null);

  // Estado para manejar errores
  const [error, setError] = useState<string>('');

  /**
   * Maneja el cálculo del financiamiento
   * Se ejecuta cuando el usuario envía el formulario
   */
  const handleCalcular = (input: CalculoFinancieroInput) => {
    try {
      // Limpiar error previo
      setError('');

      // Realizar el cálculo
      const resultado = calcularFinanciamiento(input);

      // Guardar resultados y input
      setResultados(resultado);
      setInputUsuario(input);
    } catch (err) {
      // Manejar errores de validación o cálculo
      setError(err instanceof Error ? err.message : 'Error al calcular');
      setResultados(null);
      setInputUsuario(null);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px 0',
          marginBottom: '32px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 700,
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            Calculadora de Cuotas
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              marginTop: '8px'
            }}
          >
            Método Fiserv - Cálculo preciso de financiamiento
          </Typography>
        </Container>
      </Box>

      {/* Contenido principal */}
      <Container maxWidth="lg">
        <Box sx={{ marginBottom: '40px' }}>
          {/* Formulario de entrada */}
          <CalculatorForm
            onCalculate={handleCalcular}
            errorMessage={error}
          />

          {/* Resultados (solo se muestran cuando hay datos) */}
          {resultados && inputUsuario && (
            <>
              <Divider sx={{ margin: '40px 0' }} />
              <ResultsDisplay
                resultados={resultados}
                input={inputUsuario}
              />
            </>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            textAlign: 'center',
            padding: '24px 0',
            marginTop: '48px',
            borderTop: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Calculadora de Cuotas - Método Fiserv
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', marginTop: '4px' }}>
            Desarrollado con React + TypeScript + Material UI
          </Typography>
        </Box>
      </Container>
    </div>
  );
}

export default App;
