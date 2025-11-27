/**
 * Componente para mostrar los resultados de los cálculos financieros
 *
 * Este componente presenta todos los valores calculados de forma clara y organizada,
 * utilizando tarjetas de Material UI con diferentes estilos y colores.
 */

import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Calculate as CalculateIcon,
  MonetizationOn as MoneyIcon,
  Percent as PercentIcon
} from '@mui/icons-material';
import type { ResultadoCalculos, CalculoFinancieroInput } from '../types/financial.types';
import styles from './ResultsDisplay.module.css';

interface ResultsDisplayProps {
  /** Resultados de los cálculos financieros */
  resultados: ResultadoCalculos;
  /** Datos de entrada utilizados para el cálculo */
  input: CalculoFinancieroInput;
}

/**
 * Formatea un número como moneda argentina
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formatea un número como porcentaje con 2 decimales
 */
function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Formatea un coeficiente con 6 decimales
 */
function formatCoeficiente(value: number): string {
  return value.toFixed(6);
}

/**
 * Componente de visualización de resultados financieros
 */
export function ResultsDisplay({ resultados, input }: ResultsDisplayProps) {
  return (
    <Box className={styles.resultsContainer}>
      <Typography variant="h5" className={styles.resultsTitle}>
        Resultados del Cálculo
      </Typography>

      {/* Grid de tarjetas con resultados principales */}
      <div className={styles.cardsGrid}>

        {/* Tarjeta: Coeficiente */}
        <Card className={`${styles.resultCard} ${styles.cardInfo}`} elevation={2}>
          <Box className={styles.cardHeader}>
            <Typography className={styles.cardTitle}>
              <CalculateIcon fontSize="small" />
              Coeficiente
            </Typography>
          </Box>
          <CardContent className={styles.cardContent}>
            <Typography className={styles.mainValue}>
              {formatCoeficiente(resultados.coeficiente)}
            </Typography>
            <Typography className={styles.secondaryValue}>
              Con IVA: {formatCoeficiente(resultados.coeficienteConIVA)}
            </Typography>
            <Typography className={styles.description}>
              Factor que multiplica el importe para obtener la cuota
            </Typography>
          </CardContent>
        </Card>



        {/* Tarjeta: Cuota Mensual */}
        <Card className={`${styles.resultCard} ${styles.cardPrimary}`} elevation={2}>
          <Box className={styles.cardHeader}>
            <Typography className={styles.cardTitle}>
              <MoneyIcon fontSize="small" />
              Cuota Mensual
            </Typography>
          </Box>
          <CardContent className={styles.cardContent}>
            <Typography className={styles.mainValue}>
              {formatCurrency(resultados.cuota)}
            </Typography>
            <Typography className={styles.secondaryValue}>
              Con IVA: {formatCurrency(resultados.cuotaConIVA)}
            </Typography>
            <Typography className={styles.description}>
              Valor de cada una de las {input.cuotas} cuotas mensuales
            </Typography>
          </CardContent>
        </Card>

        {/* Tarjeta: Monto Total */}
        <Card className={`${styles.resultCard} ${styles.cardSuccess}`} elevation={2}>
          <Box className={styles.cardHeader}>
            <Typography className={styles.cardTitle}>
              <AccountBalanceIcon fontSize="small" />
              Monto Total a Pagar
            </Typography>
          </Box>
          <CardContent className={styles.cardContent}>
            <Typography className={styles.mainValue}>
              {formatCurrency(resultados.montoTotal)}
            </Typography>
            <Typography className={styles.secondaryValue}>
              Con IVA: {formatCurrency(resultados.montoTotalConIVA)}
            </Typography>
            <Typography className={styles.description}>
              Suma total de todas las cuotas al finalizar el préstamo
            </Typography>
          </CardContent>
        </Card>

        {/* Tarjeta: Interés Total */}
        <Card className={`${styles.resultCard} ${styles.cardWarning}`} elevation={2}>
          <Box className={styles.cardHeader}>
            <Typography className={styles.cardTitle}>
              <TrendingUpIcon fontSize="small" />
              Interés Total
            </Typography>
          </Box>
          <CardContent className={styles.cardContent}>
            <Typography className={styles.mainValue}>
              {formatCurrency(resultados.interesTotal)}
            </Typography>
            <Typography className={styles.secondaryValue}>
              Con IVA: {formatCurrency(resultados.interesTotalConIVA)}
            </Typography>
            <Typography className={styles.description}>
              Diferencia entre lo que pagas y lo que solicitaste
            </Typography>
          </CardContent>
        </Card>

        {/* Tarjeta: Tasa Directa */}
        <Card className={`${styles.resultCard} ${styles.cardError}`} elevation={2}>
          <Box className={styles.cardHeader}>
            <Typography className={styles.cardTitle}>
              <PercentIcon fontSize="small" />
              Tasa Directa
            </Typography>
          </Box>
          <CardContent className={styles.cardContent}>
            <Typography className={styles.mainValue}>
              {formatPercentage(resultados.tasaDirecta)}
            </Typography>
            <Typography className={styles.description}>
              Costo total del financiamiento como porcentaje del capital
            </Typography>
          </CardContent>
        </Card>

        {/* Tarjeta: TEA */}
        <Card className={`${styles.resultCard} ${styles.cardInfo}`} elevation={2}>
          <Box className={styles.cardHeader}>
            <Typography className={styles.cardTitle}>
              <PercentIcon fontSize="small" />
              TEA
            </Typography>
          </Box>
          <CardContent className={styles.cardContent}>
            <Typography className={styles.mainValue}>
              {formatPercentage(resultados.tea)}
            </Typography>
            <Typography className={styles.description}>
              Tasa Efectiva Anual con capitalización mensual
            </Typography>
          </CardContent>
        </Card>

        {/* Tarjeta: CFT */}
        <Card className={`${styles.resultCard} ${styles.cardError}`} elevation={2}>
          <Box className={styles.cardHeader}>
            <Typography className={styles.cardTitle}>
              <PercentIcon fontSize="small" />
              CFT
            </Typography>
          </Box>
          <CardContent className={styles.cardContent}>
            <Typography className={styles.mainValue}>
              {formatPercentage(resultados.cft)}
            </Typography>
            <Typography className={styles.description}>
              Costo Financiero Total anualizado (incluye todos los costos)
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Sección de Resumen */}
      <Box className={styles.summarySection}>
        <Typography className={styles.summaryTitle}>
          Resumen del Financiamiento
        </Typography>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', marginBottom: '20px' }} />
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <Typography className={styles.summaryLabel}>
              Monto Solicitado
            </Typography>
            <Typography className={styles.summaryValue}>
              {formatCurrency(input.importe)}
            </Typography>
          </div>
          <div className={styles.summaryItem}>
            <Typography className={styles.summaryLabel}>
              Cantidad de Cuotas
            </Typography>
            <Typography className={styles.summaryValue}>
              {input.cuotas}
            </Typography>
          </div>
          <div className={styles.summaryItem}>
            <Typography className={styles.summaryLabel}>
              TNA Publicada
            </Typography>
            <Typography className={styles.summaryValue}>
              {formatPercentage(input.tna)}
            </Typography>
          </div>
          {input.tnaCobrador !== undefined && input.tnaCobrador !== input.tna && (
            <>
              {(input.arancelProcesador && input.arancelProcesador > 0) ||
               (input.feeRiesgoProcesador && input.feeRiesgoProcesador > 0) ||
               (input.adicionalCobrador && input.adicionalCobrador > 0) ||
               (input.impuestos && input.impuestos > 0) ? (
                <>
                  {input.arancelProcesador && input.arancelProcesador > 0 && (
                    <div className={styles.summaryItem}>
                      <Typography className={styles.summaryLabel}>
                        + Arancel de Procesador
                      </Typography>
                      <Typography className={styles.summaryValue}>
                        {formatPercentage(input.arancelProcesador)}
                      </Typography>
                    </div>
                  )}
                  {input.feeRiesgoProcesador && input.feeRiesgoProcesador > 0 && (
                    <div className={styles.summaryItem}>
                      <Typography className={styles.summaryLabel}>
                        + Fee de Riesgo de Procesador
                      </Typography>
                      <Typography className={styles.summaryValue}>
                        {formatPercentage(input.feeRiesgoProcesador)}
                      </Typography>
                    </div>
                  )}
                  {input.adicionalCobrador && input.adicionalCobrador > 0 && (
                    <div className={styles.summaryItem}>
                      <Typography className={styles.summaryLabel}>
                        + Adicional de Cobrador
                      </Typography>
                      <Typography className={styles.summaryValue}>
                        {formatPercentage(input.adicionalCobrador)}
                      </Typography>
                    </div>
                  )}
                  {input.impuestos && input.impuestos > 0 && (
                    <div className={styles.summaryItem}>
                      <Typography className={styles.summaryLabel}>
                        + Impuestos
                      </Typography>
                      <Typography className={styles.summaryValue}>
                        {formatPercentage(input.impuestos)}
                      </Typography>
                    </div>
                  )}
                </>
              ) : null}
              <div className={styles.summaryItem}>
                <Typography className={styles.summaryLabel} sx={{ fontWeight: 600 }}>
                  TNA Cobrador Resultante
                </Typography>
                <Typography className={styles.summaryValue} sx={{ fontWeight: 600 }}>
                  {formatPercentage(input.tnaCobrador)}
                </Typography>
              </div>
            </>
          )}
          <div className={styles.summaryItem}>
            <Typography className={styles.summaryLabel}>
              Cuota Mensual (c/IVA)
            </Typography>
            <Typography className={styles.summaryValue}>
              {formatCurrency(resultados.cuotaConIVA)}
            </Typography>
          </div>
        </div>
      </Box>

      {/* Tabla de Detalles por Cuota */}
      {resultados.detallesPorCuota && resultados.detallesPorCuota.length > 0 && (
        <Box className={styles.summarySection} sx={{ marginTop: '32px' }}>
          <Typography className={styles.summaryTitle}>
            Detalles por Cuota
          </Typography>
          <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', marginBottom: '20px' }} />
          <TableContainer 
            component={Paper} 
            sx={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              maxHeight: '600px',
              overflowX: 'auto'
            }}
            className={styles.tableContainer}
          >
            <Table sx={{ minWidth: 800 }} size="small" stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'rgba(102, 126, 234, 0.1)' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Cuota</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Importe</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>TNA Resultante</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Cuota</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Coeficiente</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Coef. c/IVA</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>TEA</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>CFT</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Tasa Directa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultados.detallesPorCuota.map((detalle) => (
                  <TableRow
                    key={detalle.numeroCuota}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                      '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.05)' }
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                      {detalle.numeroCuota}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(detalle.importe)}</TableCell>
                    <TableCell align="right">{formatPercentage(detalle.tnaResultante)}</TableCell>
                    <TableCell align="right">{formatCurrency(detalle.cuota)}</TableCell>
                    <TableCell align="right">{formatCoeficiente(detalle.coeficiente)}</TableCell>
                    <TableCell align="right">{formatCoeficiente(detalle.coeficienteConIVA)}</TableCell>
                    <TableCell align="right">{formatPercentage(detalle.tea)}</TableCell>
                    <TableCell align="right">{formatPercentage(detalle.cft)}</TableCell>
                    <TableCell align="right">{formatPercentage(detalle.tasaDirecta)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}
