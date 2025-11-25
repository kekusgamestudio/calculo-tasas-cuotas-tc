# Calculadora de Cuotas Fiserv

Aplicación web para calcular financiamientos utilizando el método Fiserv, desarrollada con React, TypeScript y Material UI.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funciones de Cálculo](#funciones-de-cálculo)
- [Componentes](#componentes)
- [Tipos TypeScript](#tipos-typescript)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Fórmulas Matemáticas](#fórmulas-matemáticas)

---

## 📝 Descripción General

Esta calculadora financiera implementa el método Fiserv para calcular todos los parámetros relevantes de un préstamo o financiamiento, incluyendo:

- **Coeficiente**: Factor multiplicador para calcular la cuota
- **Tasa Directa**: Costo total del financiamiento como porcentaje
- **Coeficiente con IVA**: Coeficiente ajustado con IVA (21%)
- **TEA**: Tasa Efectiva Anual
- **CFT**: Costo Financiero Total
- **Cuota Mensual**: Valor de cada cuota (con y sin IVA)
- **Monto Total**: Suma total a pagar
- **Interés Total**: Diferencia entre lo pagado y lo prestado

## ✨ Características

- ✅ Cálculos precisos siguiendo el método Fiserv
- 🎨 Interfaz moderna con Material UI
- 📱 Diseño responsive (mobile-first)
- 🔢 Validación de datos en tiempo real
- 📊 Visualización clara de resultados
- 🧮 Funciones de cálculo separadas y documentadas
- 💼 Código limpio y mantenible
- 🔒 Type-safe con TypeScript
- 📦 CSS Modules para encapsulación de estilos

## 🛠 Tecnologías Utilizadas

- **React 19.2**: Framework de UI
- **TypeScript 5.9**: Tipado estático
- **Vite 7.2**: Build tool y dev server
- **Material UI 7.3**: Biblioteca de componentes
- **CSS Modules**: Estilos encapsulados
- **Emotion**: CSS-in-JS para Material UI

### Dependencias principales

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "@mui/material": "^7.3.5",
  "@mui/icons-material": "^7.3.5",
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.1"
}
```

## 🚀 Instalación y Ejecución

### Requisitos previos

- Node.js 18+
- Yarn o npm

### Pasos de instalación

1. **Clonar el repositorio o navegar a la carpeta del proyecto**

```bash
cd calculadora-cuotas
```

2. **Instalar dependencias**

```bash
yarn install
# o
npm install
```

3. **Ejecutar en modo desarrollo**

```bash
yarn dev
# o
npm run dev
```

4. **Build para producción**

```bash
yarn build
# o
npm run build
```

5. **Previsualizar build de producción**

```bash
yarn preview
# o
npm run preview
```

## 📁 Estructura del Proyecto

```
calculadora-cuotas/
├── src/
│   ├── components/           # Componentes React
│   │   ├── CalculatorForm.tsx           # Formulario de entrada
│   │   ├── CalculatorForm.module.css    # Estilos del formulario
│   │   ├── ResultsDisplay.tsx           # Visualización de resultados
│   │   └── ResultsDisplay.module.css    # Estilos de resultados
│   │
│   ├── types/                # Definiciones TypeScript
│   │   └── financial.types.ts           # Tipos para cálculos financieros
│   │
│   ├── utils/                # Utilidades y funciones puras
│   │   └── financial-calculator.ts      # Funciones de cálculo
│   │
│   ├── App.tsx               # Componente principal
│   ├── App.css               # Estilos globales de la app
│   ├── main.tsx              # Punto de entrada
│   └── index.css             # Estilos base
│
├── public/                   # Archivos estáticos
├── package.json              # Dependencias y scripts
├── tsconfig.json             # Configuración TypeScript
├── vite.config.ts            # Configuración Vite
└── DOCUMENTACION.md          # Este archivo
```

---

## 🔢 Funciones de Cálculo

Todas las funciones de cálculo están ubicadas en `src/utils/financial-calculator.ts` y son **funciones puras** (sin efectos secundarios).

### 1. `validarDatosEntrada(input: CalculoFinancieroInput): ValidationResult`

Valida que los datos de entrada sean correctos.

**Validaciones:**
- Importe debe ser mayor a 0
- Cuotas debe ser un número entero mayor a 0
- TNA no puede ser negativa

**Ejemplo:**

```typescript
const validacion = validarDatosEntrada({
  importe: 10000,
  cuotas: 12,
  tna: 120
});

if (!validacion.isValid) {
  console.error(validacion.errorMessage);
}
```

---

### 2. `calcularTEM(tna: number): number`

Calcula la Tasa Efectiva Mensual a partir de la TNA.

**Fórmula:**

```
TEM = (TNA / 100) / 12
```

**Parámetros:**
- `tna`: Tasa Nominal Anual en porcentaje (ej: 120 para 120%)

**Retorno:** Tasa Efectiva Mensual en decimal (ej: 0.10 para 10%)

**Ejemplo:**

```typescript
const tem = calcularTEM(120);
// Resultado: 0.10 (10% mensual)
```

---

### 3. `calcularCoeficiente(tem: number, cuotas: number): number`

Calcula el coeficiente de financiamiento.

**Fórmula:**

```
Coeficiente = (TEM × (1 + TEM)^cuotas) / ((1 + TEM)^cuotas - 1)
```

**Caso especial:** Si TEM = 0, entonces `Coeficiente = 1 / cuotas`

**Parámetros:**
- `tem`: Tasa Efectiva Mensual en decimal
- `cuotas`: Número de cuotas

**Retorno:** Coeficiente de financiamiento

**Ejemplo:**

```typescript
const coeficiente = calcularCoeficiente(0.10, 12);
// Resultado: ~0.14676
```

---

### 4. `calcularTasaDirecta(coeficiente: number, cuotas: number): number`

Calcula la Tasa Directa (costo total del financiamiento).

**Fórmula:**

```
Tasa Directa = ((Coeficiente × cuotas) - 1) × 100
```

**Parámetros:**
- `coeficiente`: Coeficiente de financiamiento
- `cuotas`: Número de cuotas

**Retorno:** Tasa directa en porcentaje

**Ejemplo:**

```typescript
const tasaDirecta = calcularTasaDirecta(0.14676, 12);
// Resultado: ~76.11%
```

---

### 5. `calcularCoeficienteConIVA(coeficiente: number): number`

Aplica el IVA al coeficiente.

**Fórmula:**

```
Coef c/IVA = Coeficiente × (1 + IVA)
Coef c/IVA = Coeficiente × 1.21
```

**Constante:** IVA = 0.21 (21%)

**Parámetros:**
- `coeficiente`: Coeficiente sin IVA

**Retorno:** Coeficiente con IVA incluido

**Ejemplo:**

```typescript
const coefConIVA = calcularCoeficienteConIVA(0.14676);
// Resultado: ~0.17758
```

---

### 6. `calcularTEA(tem: number): number`

Calcula la Tasa Efectiva Anual.

**Fórmula:**

```
TEA = ((1 + TEM)^12 - 1) × 100
```

**Parámetros:**
- `tem`: Tasa Efectiva Mensual en decimal

**Retorno:** Tasa Efectiva Anual en porcentaje

**Ejemplo:**

```typescript
const tea = calcularTEA(0.10);
// Resultado: ~213.84%
```

---

### 7. `calcularCFT(coeficiente: number, cuotas: number): number`

Calcula el Costo Financiero Total.

**Fórmula:**

```
CFT = ((Coeficiente × cuotas)^(12/cuotas) - 1) × 100
```

**Parámetros:**
- `coeficiente`: Coeficiente de financiamiento
- `cuotas`: Número de cuotas

**Retorno:** CFT en porcentaje

**Ejemplo:**

```typescript
const cft = calcularCFT(0.14676, 12);
// Resultado: ~213.84%
```

---

### 8. `calcularCuota(importe: number, coeficiente: number): number`

Calcula el valor de cada cuota mensual.

**Fórmula:**

```
Cuota = Importe × Coeficiente
```

**Parámetros:**
- `importe`: Monto financiado
- `coeficiente`: Coeficiente de financiamiento

**Retorno:** Valor de la cuota mensual

**Ejemplo:**

```typescript
const cuota = calcularCuota(10000, 0.14676);
// Resultado: 1467.60
```

---

### 9. `calcularMontoTotal(cuota: number, numeroCuotas: number): number`

Calcula el monto total a pagar.

**Fórmula:**

```
Monto Total = Cuota × Número de Cuotas
```

**Parámetros:**
- `cuota`: Valor de cada cuota
- `numeroCuotas`: Número de cuotas

**Retorno:** Monto total a pagar

**Ejemplo:**

```typescript
const montoTotal = calcularMontoTotal(1467.60, 12);
// Resultado: 17611.20
```

---

### 10. `calcularInteresTotal(montoTotal: number, importe: number): number`

Calcula el interés total pagado.

**Fórmula:**

```
Interés Total = Monto Total - Importe
```

**Parámetros:**
- `montoTotal`: Monto total a pagar
- `importe`: Monto original financiado

**Retorno:** Interés total pagado

**Ejemplo:**

```typescript
const interesTotal = calcularInteresTotal(17611.20, 10000);
// Resultado: 7611.20
```

---

### 11. `calcularFinanciamiento(input: CalculoFinancieroInput): ResultadoCalculos`

**Función principal** que orquesta todos los cálculos.

**Parámetros:**
- `input`: Objeto con importe, cuotas y tna

**Retorno:** Objeto `ResultadoCalculos` con todos los valores calculados

**Lanza Error:** Si los datos de entrada no son válidos

**Ejemplo:**

```typescript
try {
  const resultado = calcularFinanciamiento({
    importe: 10000,
    cuotas: 12,
    tna: 120
  });

  console.log('Cuota mensual:', resultado.cuota);
  console.log('TEA:', resultado.tea);
  console.log('CFT:', resultado.cft);
} catch (error) {
  console.error('Error:', error.message);
}
```

---

## 🧩 Componentes

### `CalculatorForm`

Formulario de entrada de datos con validación en tiempo real.

**Props:**

```typescript
interface CalculatorFormProps {
  onCalculate: (input: CalculoFinancieroInput) => void;
  errorMessage?: string;
}
```

**Características:**
- Validación de entrada numérica
- Valores por defecto: importe=10000, cuotas=12, tna=120
- Diseño responsive
- Iconos de Material UI
- Alertas de error

**Ubicación:** `src/components/CalculatorForm.tsx`
**Estilos:** `src/components/CalculatorForm.module.css`

---

### `ResultsDisplay`

Visualización de resultados con tarjetas organizadas.

**Props:**

```typescript
interface ResultsDisplayProps {
  resultados: ResultadoCalculos;
  input: CalculoFinancieroInput;
}
```

**Características:**
- Grid responsive de tarjetas
- Código de colores por tipo de dato
- Formateo de moneda y porcentajes
- Sección de resumen
- Animaciones de entrada
- Iconos representativos

**Ubicación:** `src/components/ResultsDisplay.tsx`
**Estilos:** `src/components/ResultsDisplay.module.css`

---

### `App`

Componente principal que coordina toda la aplicación.

**Responsabilidades:**
- Gestión del estado global
- Manejo de errores
- Orquestación de componentes
- Layout principal

**Ubicación:** `src/App.tsx`
**Estilos:** `src/App.css`

---

## 📘 Tipos TypeScript

### `CalculoFinancieroInput`

Parámetros de entrada para cálculos.

```typescript
interface CalculoFinancieroInput {
  importe: number;   // Monto financiado en pesos
  cuotas: number;    // Número de cuotas (meses)
  tna: number;       // Tasa Nominal Anual en porcentaje
}
```

---

### `ResultadoCalculos`

Resultado completo de los cálculos.

```typescript
interface ResultadoCalculos {
  coeficiente: number;           // Factor multiplicador
  tasaDirecta: number;           // Tasa de interés directa (%)
  coeficienteConIVA: number;     // Coeficiente con IVA (21%)
  tea: number;                   // Tasa Efectiva Anual (%)
  cft: number;                   // Costo Financiero Total (%)
  cuota: number;                 // Valor de cuota sin IVA
  cuotaConIVA: number;          // Valor de cuota con IVA
  montoTotal: number;           // Monto total sin IVA
  montoTotalConIVA: number;     // Monto total con IVA
  interesTotal: number;         // Interés sin IVA
  interesTotalConIVA: number;   // Interés con IVA
}
```

---

### `ValidationResult`

Resultado de validación.

```typescript
interface ValidationResult {
  isValid: boolean;           // Indica si los datos son válidos
  errorMessage?: string;      // Mensaje de error si aplica
}
```

**Ubicación:** `src/types/financial.types.ts`

---

## 📊 Ejemplos de Uso

### Ejemplo 1: Préstamo básico

```typescript
import { calcularFinanciamiento } from './utils/financial-calculator';

const resultado = calcularFinanciamiento({
  importe: 10000,    // $10,000
  cuotas: 12,        // 12 meses
  tna: 120          // 120% anual
});

console.log('Cuota mensual:', resultado.cuota);
// Salida: 1467.60

console.log('Monto total:', resultado.montoTotal);
// Salida: 17611.20

console.log('TEA:', resultado.tea + '%');
// Salida: 213.84%
```

---

### Ejemplo 2: Préstamo a 6 cuotas con TNA 80%

```typescript
const resultado = calcularFinanciamiento({
  importe: 5000,
  cuotas: 6,
  tna: 80
});

console.log('Cuota mensual c/IVA:', resultado.cuotaConIVA);
console.log('CFT:', resultado.cft + '%');
```

---

### Ejemplo 3: Validación de datos

```typescript
import { validarDatosEntrada } from './utils/financial-calculator';

const validacion = validarDatosEntrada({
  importe: -100,    // Inválido: negativo
  cuotas: 12,
  tna: 120
});

if (!validacion.isValid) {
  alert(validacion.errorMessage);
  // Muestra: "El importe debe ser mayor a cero"
}
```

---

## 📐 Fórmulas Matemáticas

### Flujo de Cálculo

```
1. TNA (entrada) → TEM
   TEM = (TNA / 100) / 12

2. TEM + Cuotas → Coeficiente
   Coeficiente = (TEM × (1 + TEM)^cuotas) / ((1 + TEM)^cuotas - 1)

3. Coeficiente + Cuotas → Tasa Directa
   Tasa Directa = ((Coeficiente × cuotas) - 1) × 100

4. Coeficiente → Coeficiente con IVA
   Coef c/IVA = Coeficiente × 1.21

5. TEM → TEA
   TEA = ((1 + TEM)^12 - 1) × 100

6. Coeficiente + Cuotas → CFT
   CFT = ((Coeficiente × cuotas)^(12/cuotas) - 1) × 100

7. Importe + Coeficiente → Cuota
   Cuota = Importe × Coeficiente

8. Cuota + Cuotas → Monto Total
   Monto Total = Cuota × Cuotas

9. Monto Total - Importe → Interés Total
   Interés Total = Monto Total - Importe
```

---

### Relación entre TEA y CFT

Para préstamos a 12 cuotas, TEA y CFT suelen coincidir:

```
TEA = CFT  (cuando cuotas = 12)
```

Esto se debe a que ambos anualizan el costo del financiamiento, y a 12 cuotas, la anualización es directa.

---

### Sistema Francés (base del método Fiserv)

El método Fiserv utiliza el **Sistema Francés de Amortización**, donde:

- Las cuotas son **constantes**
- Cada cuota contiene **capital + interés**
- Al inicio se paga más interés, al final más capital
- El coeficiente calcula la cuota considerando el valor presente del dinero

---

## 🎨 Personalización de Estilos

Los estilos están organizados usando CSS Modules para evitar colisiones de nombres.

### Modificar colores del degradado principal

Editar `src/components/CalculatorForm.module.css`:

```css
.formContainer {
  background: linear-gradient(135deg, #tu-color-1 0%, #tu-color-2 100%);
}
```

### Modificar colores de las tarjetas

Editar `src/components/ResultsDisplay.module.css`:

```css
.cardPrimary {
  border-left-color: #tu-color;
}

.cardPrimary .cardTitle {
  color: #tu-color;
}
```

---

## 🧪 Testing (futuro)

Para agregar tests en el futuro, se recomienda:

```bash
yarn add -D vitest @testing-library/react @testing-library/jest-dom
```

Ejemplo de test para las funciones de cálculo:

```typescript
import { describe, it, expect } from 'vitest';
import { calcularTEM, calcularCoeficiente } from './financial-calculator';

describe('Funciones de cálculo financiero', () => {
  it('debe calcular TEM correctamente', () => {
    const tem = calcularTEM(120);
    expect(tem).toBeCloseTo(0.10);
  });

  it('debe calcular coeficiente correctamente', () => {
    const coef = calcularCoeficiente(0.10, 12);
    expect(coef).toBeCloseTo(0.14676, 5);
  });
});
```

---

## 📝 Notas Importantes

### IVA en Argentina

- El IVA actual en Argentina es del **21%**
- Está definido como constante en `financial-calculator.ts`
- Para modificarlo, cambiar la línea: `const IVA = 0.21;`

### Precisión de Cálculos

- Los coeficientes se formatean con **6 decimales**
- Los porcentajes con **2 decimales**
- Las monedas con **2 decimales**
- Se utiliza `Intl.NumberFormat` para formato consistente

### Limitaciones

- No considera días de gracia
- No incluye seguros adicionales
- Asume cuotas mensuales (no quincenal ni semanal)
- No calcula tabla de amortización detallada

---

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Mantén las funciones de cálculo como **funciones puras**
2. Documenta todas las funciones con JSDoc
3. Usa TypeScript estricto (no `any`)
4. Sigue la convención de nombres existente
5. Agrega tests para nuevas funcionalidades
6. Mantén los componentes pequeños y enfocados

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.

---

## 📞 Contacto

Para preguntas o sugerencias sobre este proyecto, por favor crear un issue en el repositorio.

---

**Versión:** 1.0.0
**Última actualización:** Noviembre 2024
**Desarrollado con:** React + TypeScript + Material UI + Vite
