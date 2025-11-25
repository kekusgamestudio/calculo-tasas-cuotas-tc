# Calculadora de Cuotas Procesador

Aplicación web para calcular financiamientos utilizando el método Procesador, desarrollada con React, TypeScript y Material UI.

## 📋 Descripción del Proyecto

Esta calculadora financiera implementa el método Procesador para calcular todos los parámetros relevantes de un préstamo o financiamiento. Permite ingresar el monto a financiar, la cantidad de cuotas, la TNA (Tasa Nominal Anual) publicada y porcentajes adicionales (Arancel de Procesador, Fee de Riesgo, Adicional de Cobrador e Impuestos) para calcular automáticamente la TNA Cobrador resultante y todos los valores financieros asociados.

### Características Principales

- ✅ **Cálculos precisos** siguiendo el método Procesador
- 🎨 **Interfaz moderna** con Material UI
- 📱 **Diseño responsive** (mobile-first)
- 🔢 **Validación de datos** en tiempo real
- 📊 **Visualización clara** de resultados con tarjetas organizadas
- 🧮 **Funciones de cálculo** separadas y documentadas
- 💼 **Código limpio** y mantenible
- 🔒 **Type-safe** con TypeScript
- 📦 **CSS Modules** para encapsulación de estilos
- 🎯 **Botonera de cuotas** predefinidas (1, 2, 3, 6, 9, 12, 18, 24)
- 📈 **Cálculo de TNA Cobrador resultante** sumando porcentajes adicionales

## 🛠 Tecnologías Utilizadas

- **React 19.2**: Framework de UI
- **TypeScript 5.9**: Tipado estático
- **Vite 7.2**: Build tool y dev server
- **Material UI 7.3**: Biblioteca de componentes
- **CSS Modules**: Estilos encapsulados
- **Yarn**: Gestor de paquetes

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **Yarn** (versión 1.22 o superior)

Para verificar las versiones instaladas:

```bash
node --version
yarn --version
```

## 🚀 Instalación

1. **Clonar el repositorio** (si aplica):
```bash
git clone <url-del-repositorio>
cd calculo-tasas-cuotas-tc
```

2. **Instalar dependencias** con Yarn:
```bash
yarn install
```

Esto instalará todas las dependencias necesarias definidas en `package.json`.

## ▶️ Ejecución

### Modo Desarrollo

Para ejecutar la aplicación en modo desarrollo con hot-reload:

```bash
yarn dev
```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne automáticamente).

### Compilar para Producción

Para generar una build optimizada para producción:

```bash
yarn build
```

Los archivos compilados se generarán en la carpeta `dist/`.

### Vista Previa de Producción

Para previsualizar la build de producción localmente:

```bash
yarn preview
```

### Linting

Para ejecutar el linter y verificar el código:

```bash
yarn lint
```

## 🎯 Funcionalidad

### Campos de Entrada

La calculadora permite ingresar los siguientes datos:

1. **Importe**: Monto a financiar en pesos argentinos
2. **Cantidad de Cuotas**: Selección mediante botonera horizontal con opciones predefinidas:
   - 1, 2, 3, 6, 9, 12, 18, 24 cuotas
3. **TNA (Tasa Nominal Anual)**: Tasa nominal anual publicada en porcentaje
4. **Arancel de Procesador (%)**: Porcentaje adicional de arancel
5. **Fee de Riesgo de Procesador (%)**: Porcentaje adicional de fee de riesgo
6. **Adicional de Cobrador (%)**: Porcentaje adicional de Cobrador
7. **Impuestos (%)**: Porcentaje adicional de impuestos

### Cálculo de TNA Cobrador Resultante

La aplicación calcula automáticamente la **TNA Cobrador resultante** sumando todos los porcentajes adicionales a la TNA publicada:

```
TNA Cobrador Resultante = TNA + Arancel de Procesador + Fee de Riesgo + Adicional de Cobrador + Impuestos
```

Esta TNA Cobrador resultante es la que se utiliza para todos los cálculos financieros posteriores.

### Resultados Calculados

La calculadora proporciona los siguientes resultados:

#### Valores Principales
- **Cuota Mensual**: Valor de cada cuota (con y sin IVA)
- **Monto Total a Pagar**: Suma total de todas las cuotas (con y sin IVA)
- **Interés Total**: Diferencia entre lo pagado y lo prestado (con y sin IVA)

#### Indicadores Financieros
- **Coeficiente**: Factor multiplicador para calcular la cuota (con y sin IVA)
- **Tasa Directa**: Costo total del financiamiento como porcentaje del capital
- **TEA (Tasa Efectiva Anual)**: Tasa anual equivalente con capitalización mensual
- **CFT (Costo Financiero Total)**: Costo total anualizado incluyendo todos los costos

#### Resumen del Financiamiento
- Monto solicitado
- Cantidad de cuotas
- TNA publicada
- Desglose de porcentajes adicionales (si aplica)
- **TNA Cobrador resultante** (en negrita)
- Cuota mensual con IVA

### Validaciones

La aplicación incluye validaciones para:
- Importe mayor a cero
- Número de cuotas entero y mayor a cero
- TNA no negativa
- Solo números (enteros o decimales) en campos numéricos

## 📁 Estructura del Proyecto

```
calculo-tasas-cuotas-tc/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── CalculatorForm.tsx          # Formulario de entrada
│   │   ├── CalculatorForm.module.css    # Estilos del formulario
│   │   ├── ResultsDisplay.tsx           # Visualización de resultados
│   │   └── ResultsDisplay.module.css    # Estilos de resultados
│   ├── types/             # Definiciones TypeScript
│   │   └── financial.types.ts           # Tipos para cálculos financieros
│   ├── utils/             # Funciones utilitarias
│   │   └── financial-calculator.ts      # Lógica de cálculo Procesador
│   ├── App.tsx            # Componente principal
│   ├── App.css            # Estilos globales
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos base
├── package.json           # Dependencias y scripts
├── vite.config.ts         # Configuración de Vite
├── tsconfig.json           # Configuración de TypeScript
└── README.md              # Este archivo
```

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `yarn dev` | Inicia el servidor de desarrollo |
| `yarn build` | Compila la aplicación para producción |
| `yarn preview` | Previsualiza la build de producción |
| `yarn lint` | Ejecuta el linter para verificar el código |

## 🔧 Configuración

### Variables de Entorno

Actualmente no se requieren variables de entorno para el funcionamiento básico de la aplicación.

### Personalización

Los estilos pueden personalizarse modificando los archivos CSS Modules en `src/components/`. Los colores y temas de Material UI pueden ajustarse en `src/App.tsx`.

## 📚 Documentación Adicional

Para más detalles sobre las fórmulas matemáticas, funciones de cálculo y ejemplos de uso, consulta el archivo `DOCUMENTACION.md`.

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y de uso interno.

## 👥 Autor

Desarrollado para Cobrador - Cálculo de Tasas y Cuotas TC

---

**Nota**: Esta calculadora utiliza el método Procesador para cálculos financieros. Los resultados son aproximaciones basadas en las fórmulas implementadas y deben ser validados según los requerimientos específicos del negocio.
