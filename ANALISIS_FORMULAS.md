# Análisis de Fórmulas: Comparación con Implementación Actual

## 📋 Resumen Ejecutivo

**CONCLUSIÓN: Los cálculos actuales NO implementan la fórmula mostrada en la imagen.**

El proyecto actual utiliza el **Sistema Francés de Amortización** con cuotas mensuales iguales, mientras que la imagen muestra una fórmula específica para calcular el **Costo Financiero de un Arancel** basada en períodos de días (28 y 30 días) y año comercial de 360 días.

---

## 🔍 Fórmula de la Imagen

### Fórmula Principal

```
Costo Financiero = Valor Neto del Arancel × (1 - (1 / Cuotas Plan) × Σ[from i=1 to cuotas plan] (1 / ((1 + (TNA × 28 / 360)) × (1 + (TNA × 30 / 360))^(i-1))))
```

### Características Clave:

1. **Base de cálculo:** Año comercial de 360 días
2. **Primera cuota:** 28 días
   - Coeficiente para i=1: `1 / (1 + (TNA × 28 / 360))`
3. **Siguientes cuotas:** 30 días cada una
   - Coeficiente para i>1: `1 / ((1 + (TNA × 28 / 360)) × (1 + (TNA × 30 / 360))^(i-1))`
4. **Suma (Σ):** Se suman los coeficientes de todas las cuotas
5. **Factor de descuento:** `(1 / Cuotas Plan)` multiplica la suma
6. **Resultado final:** `Valor Neto del Arancel × (1 - factor_descuento × suma_coeficientes)`

---

## 🔧 Implementación Actual del Proyecto

### Método Utilizado: Sistema Francés

El proyecto actual implementa el método tradicional de amortización con cuotas mensuales iguales:

#### 1. Cálculo de TEM (Tasa Efectiva Mensual)
```typescript
TEM = (TNA / 100) / 12
```
- **Ubicación:** `calcularTEM()` en `financial-calculator.ts` (línea 64-67)
- **Base:** 12 meses (no días)

#### 2. Cálculo del Coeficiente
```typescript
Coeficiente = (TEM × (1 + TEM)^cuotas) / ((1 + TEM)^cuotas - 1)
```
- **Ubicación:** `calcularCoeficiente()` en `financial-calculator.ts` (línea 86-98)
- **Método:** Sistema Francés estándar
- **Cuotas:** Todas iguales (mensuales)

#### 3. Cálculo del CFT (Costo Financiero Total)
```typescript
CFT = ((Coeficiente × cuotas)^(12/cuotas) - 1) × 100
```
- **Ubicación:** `calcularCFT()` en `financial-calculator.ts` (línea 174-179)
- **Método:** Anualización del costo total

---

## ❌ Diferencias Principales

| Aspecto | Fórmula de la Imagen | Implementación Actual |
|---------|---------------------|----------------------|
| **Base temporal** | 360 días (año comercial) | 12 meses |
| **Primera cuota** | 28 días | 30 días (1 mes) |
| **Siguientes cuotas** | 30 días cada una | 30 días (1 mes) cada una |
| **Coeficientes** | Diferentes para cada cuota (i=1 vs i>1) | Iguales para todas las cuotas |
| **Fórmula** | Suma (Σ) de coeficientes con descuento progresivo | Sistema Francés estándar |
| **Aplicación** | Costo Financiero de un Arancel | Costo Financiero Total (CFT) de un préstamo |
| **Variable principal** | Valor Neto del Arancel | Importe financiado |

---

## 📊 Ejemplo Comparativo

### Datos de Entrada:
- TNA: 50% (0.50 en decimal)
- Cuotas: 3
- Valor Neto del Arancel / Importe: 10,000

### Según Fórmula de la Imagen:

**Primera cuota (i=1):**
```
Coeficiente₁ = 1 / (1 + (0.50 × 28 / 360))
             = 1 / (1 + 0.03889)
             = 1 / 1.03889
             ≈ 0.9625
```

**Segunda cuota (i=2):**
```
Coeficiente₂ = 1 / ((1 + (0.50 × 28 / 360)) × (1 + (0.50 × 30 / 360))^1)
             = 1 / (1.03889 × 1.04167)
             ≈ 0.9240
```

**Tercera cuota (i=3):**
```
Coeficiente₃ = 1 / ((1 + (0.50 × 28 / 360)) × (1 + (0.50 × 30 / 360))^2)
             = 1 / (1.03889 × 1.08507)
             ≈ 0.8870
```

**Suma de coeficientes:**
```
Σ = 0.9625 + 0.9240 + 0.8870 = 2.7735
```

**Factor de descuento:**
```
Factor = (1 / 3) × 2.7735 = 0.9245
```

**Costo Financiero:**
```
Costo Financiero = 10,000 × (1 - 0.9245)
                 = 10,000 × 0.0755
                 = 755
```

### Según Implementación Actual:

**TEM:**
```
TEM = (50 / 100) / 12 = 0.04167 (4.167% mensual)
```

**Coeficiente (igual para todas las cuotas):**
```
Coeficiente = (0.04167 × (1.04167)^3) / ((1.04167)^3 - 1)
            ≈ 0.3467
```

**Cuota mensual:**
```
Cuota = 10,000 × 0.3467 = 3,467
```

**Monto total:**
```
Monto Total = 3,467 × 3 = 10,401
```

**Interés total:**
```
Interés Total = 10,401 - 10,000 = 401
```

**CFT:**
```
CFT = ((0.3467 × 3)^(12/3) - 1) × 100
    = (1.0401^4 - 1) × 100
    ≈ 17.0%
```

---

## ✅ Conclusión

### Los cálculos actuales NO son correctos según la fórmula de la imagen porque:

1. ❌ **No utilizan año comercial de 360 días**
2. ❌ **No distinguen entre primera cuota (28 días) y siguientes (30 días)**
3. ❌ **No implementan la suma (Σ) de coeficientes diferentes por cuota**
4. ❌ **No calculan el "Costo Financiero" del arancel según la fórmula mostrada**
5. ❌ **Utilizan un método completamente diferente (Sistema Francés vs. método de días)**

### El proyecto actual implementa:
- ✅ Sistema Francés de amortización estándar
- ✅ Cuotas mensuales iguales
- ✅ Cálculo de CFT mediante anualización
- ✅ Método válido para préstamos tradicionales, pero NO para el cálculo específico del arancel mostrado en la imagen

---

## 🔧 Recomendaciones

Si se requiere implementar la fórmula de la imagen, sería necesario:

1. **Crear una nueva función** `calcularCostoFinancieroArancel()` que:
   - Reciba: `valorNetoArancel`, `cuotasPlan`, `tna`
   - Calcule coeficientes diferentes para i=1 (28 días) e i>1 (30 días)
   - Implemente la suma (Σ) de coeficientes
   - Aplique la fórmula completa

2. **Mantener la implementación actual** para cálculos de préstamos tradicionales

3. **Documentar claramente** qué método se usa en cada caso

---

**Fecha de análisis:** Diciembre 2024  
**Versión del código analizado:** Actual (main branch)

