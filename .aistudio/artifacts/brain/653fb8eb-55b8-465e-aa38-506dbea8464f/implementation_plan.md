# App Economia NA - Registro y Control de Pagos con Contratos JSON para Base de Datos Centralizada

Un sistema integral de gestión financiera y administrativa para la escuela de filosofía (Nueva Acrópolis), que administra los 4 registros operativos del Diccionario de Datos (`1-Registro-cuotas-membresia.csv`, `2-Registro-materiales-clase.csv`, `3-registro-otros.csv` y `4-reporte-mora.csv`) e incorpora **Contratos de Datos JSON (JSON Schemas / API Contracts)** y especificaciones REST/DTO para la integración con una base de datos centralizada.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Se incorpora la definición explícita de **Contratos JSON formales (JSON Schema / DTOs)** para cada entidad y endpoint de sincronización con base de datos centralizada (PostgreSQL, Firestore o API REST). La aplicación incluirá un explorador interactivo de contratos en vivo para inspeccionar, validar y descargar los esquemas JSON y ejemplos de carga (`payloads`).

*   **Identidad Institucional**: **App Economia NA** (Econo-app) para Nueva Acrópolis (miembros, aspirantes, cursos filosóficos, libros y actividades).
*   **Contratos JSON Centralizados**:
    *   Esquemas JSON formales con validación estricta de tipos, campos requeridos y reglas de negocio (ej. regex para DUI salvadoreño `^[0-9]{8}-[0-9]$`, validación de montos positivos, listas controladas de `Metodo_Pago`, `Estado_Pago`, `Estado_Entrega`, `Estado_Gestion`).
    *   Contratos de endpoints para API centralizada (`/api/v1/cuotas`, `/api/v1/materiales`, `/api/v1/otros`, `/api/v1/mora`, `/api/v1/sync/batch`).
*   **Doble Capa de Integración**:
    *   Soporte nativo para importar/exportar los 4 archivos CSV tradicionales definidos en el PRD.
    *   Soporte nativo para exportar e importar lotes JSON formateados según los contratos para bases de datos relacionales o NoSQL.
    *   Persistencia local en el navegador (localStorage) con emulación de cliente API centralizado.

---

### 1. Overview & Core Concept

*   **Qué hace**: 
    1. Proporciona una interfaz ágil de alta densidad para la administración diaria de cuotas de membresía, adquisición de libros/materiales, gastos e ingresos extraordinarios, y seguimiento de mora.
    2. Proporciona un **Módulo de Contratos y Arquitectura Centralizada** que define, valida y exporta las estructuras JSON estándar necesarias para que un backend centralizado (ej. Node.js/Express, Python/FastAPI, Cloud SQL o Firebase) almacene y sincronice la información de todas las sedes o grupos horarios.
*   **Audiencia / Roles**: Administradores de economía de Nueva Acrópolis, coordinadores de sede, encargados de sistemas y tesorería.
*   **Valor Clave**: Unifica la operación diaria inmediata (vía CSV y tablas interactivas) con la estandarización técnica necesaria para migrar o conectar a una base de datos centralizada sin inconsistencias de datos.

---

### 2. User Experience & Visual Design

#### Flujos de Usuario Principales
1.  **Panel de Control Económico (Dashboard General)**:
    *   Indicadores clave: Total Recaudado en Cuotas, Saldo Total en Mora, Materiales Pendientes de Entrega, Balance Neto de Operaciones y Miembros Activos.
    *   Gráficos compactos de distribución por Grupo Horario y Método de Pago (`Págala`, `Transferencia`, `Efectivo`).
2.  **Módulo 1: Cuotas de Membresía (`Registro-cuotas-membresia`)**:
    *   Tabla de alta densidad con filtros por Grupo Horario, Mes y Método de Pago.
    *   Registro de nuevo pago con validación en tiempo real de DUI (`00000000-0`), monto mayor a cero y unicidad de referencia.
    *   Botón para exportar en CSV y exportar en JSON según el contrato centralizado.
3.  **Módulo 2: Materiales y Libros (`Registro-materiales-clase`)**:
    *   Catálogo de pedidos de libros filosóficos, cuadernos y materiales.
    *   Seguimiento del estado de pago (`Pagado`, `Pendiente`) y entrega física (`Entregado`, `En Tránsito`, `Pendiente`).
4.  **Módulo 3: Otros Movimientos y Misceláneos (`Registro-otros`)**:
    *   Libro de ingresos y egresos (admite montos positivos y negativos).
    *   Estados (`Completado`, `Pendiente`, `Anulado`) y gestión de acción pendiente.
5.  **Módulo 4: Reporte y Gestión de Mora (`Reporte-mora`)**:
    *   Listado de estudiantes en atraso con `Saldo_Anterior`, `Saldo_Actual`, conteo de `Meses_En_Mora` y meses específicos adeudados.
    *   Acción para actualizar estado de gestión (`Notificado`, `En Negociación`, `Sin Respuesta`) y registrar fecha de contacto.
    *   Generador automático de mensaje de recordatorio cordial con un clic.
6.  **Módulo 5: Visor y Exportador de Contratos JSON (Backend Centralizado)**:
    *   Pestaña dedicada con visor de esquemas JSON formales (JSON Schema Draft-07), contratos OpenAPI/REST de endpoints y generador de payloads de prueba para desarrolladores de backend.
    *   Validador interactivo de JSON para verificar si un payload externo cumple con el contrato antes de ingresarlo al sistema.
7.  **Panel de Diccionario de Datos**:
    *   Acceso instantáneo a las reglas de negocio y restricciones originales de `data_dictionary_8d3f0ef8.md`.

#### Identidad Visual y Estilo
*   **Aesthetic Direction**: Interfaz SaaS de alta densidad con sobriedad académica (fondos `#FFFFFF` / `#F8FAFC`, bordes precisos `#E2E8F0`, tipografía principal `#0F172A`).
*   **Tipografía**: `Plus Jakarta Sans` para textos y títulos; `font-mono tabular-nums` para montos monetarios, DUIs salvadoreños, códigos de referencia y bloques de esquemas JSON.
*   **Disciplina Cero Píldoras**: Sin insignias tipo cápsula redondeada; se utilizan etiquetas de texto con separadores tipográficos sutiles (`·`, `/`) y acentos de color semánticos (verde esmeralda, ámbar, carmesí).

---

### 3. Key Product Decisions & Trade-Offs

*   **Decisión 1: Estandarización de Contratos JSON (Esquema Dual Snake_Case / CamelCase)**
    *   *Enfoque*: El sistema genera contratos JSON que mapean exactamente las columnas del CSV (`ID_Registro`, `Miembro_Aspirante`, `DUI`, `Grupo_Horario`, `Mes_Pagado`, `Monto_Cuota`, `Fecha_Pago`, `Metodo_Pago`, `Referencia`), garantizando compatibilidad 1:1 entre CSV, JSON y bases de datos relacionales SQL (PostgreSQL/MySQL) o documentales.
    *   *Razón*: Evita discrepancias de nomenclatura al comunicar sistemas externos o scripts de sincronización.
*   **Decisión 2: Validador de Contratos Integrado en el Cliente**
    *   *Enfoque*: Incluir un validador reactivo que comprueba en tiempo real si un objeto o lote JSON importado cumple con los tipos y restricciones antes de persistirlo.
    *   *Razón*: Previene la corrupción de datos y facilita pruebas para los ingenieros de backend.
*   **Decisión 3: Generación de Semillas Realistas de Nueva Acrópolis**
    *   *Enfoque*: Datos precargados con nombres salvadoreños reales, DUIs válidos, grupos como "Introducción a la Filosofía - Mar/Jue 6:30 PM", "Ética Clásica - Sábado 9:00 AM", libros como "La Voz del Silencio", "Manual de Epicteto" y transacciones de seminarios.
    *   *Razón*: La aplicación es inmediatamente navegable y funcional desde el primer segundo.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation Bar                              │
│   [App Economia NA]  —  [Cuotas · Materiales · Otros · Mora · Contratos]│
│                      —  [Exportar Todo (CSV / JSON)]                   │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                    Contenedor Principal de la App                      │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Vistas de Registros (CSV / UI Operativa):                        │  │
│  │ • 1. Cuotas Membresía (DUI, Grupo Horario, Pagos, Págala)        │  │
│  │ • 2. Materiales de Clase (Libros, Estado Pago/Entrega)           │  │
│  │ • 3. Otros Ingresos/Gastos (Seminarios, Mantenimiento)           │  │
│  │ • 4. Reporte Mora (Saldos, Meses, Estado Gestión de Cobro)       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Visor de Contratos JSON para Base de Datos Centralizada:         │  │
│  │ • JSON Schema Draft-07 para cada una de las 4 entidades          │  │
│  │ • Especificación de Endpoints REST (/api/v1/...)                 │  │
│  │ • Validador de JSON en vivo y Generador de Payloads Demo         │  │
│  │ • Descarga de schemas en formato .json y TypeScript Types        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                    Capa de Esquemas y Contratos                        │
│                                                                        │
│  1. CuotaMembresiaContract:                                            │
│     { ID_Registro: int, Miembro_Aspirante: str, DUI: "00000000-0",    │
│       Grupo_Horario: str, Mes_Pagado: str, Monto_Cuota: float > 0,    │
│       Fecha_Pago: "YYYY-MM-DD", Metodo_Pago: str, Referencia?: str }  │
│                                                                        │
│  2. MaterialClaseContract:                                             │
│     { ID_Material_Log: int, Miembro_Aspirante: str,                   │
│       Materia_Articulo: str, Monto: float >= 0,                        │
│       Fecha_Solicitud: "YYYY-MM-DD",                                  │
│       Estado_Pago: "Pagado" | "Pendiente",                            │
│       Estado_Entrega: "Entregado" | "En Tránsito" | "Pendiente" }     │
│                                                                        │
│  3. TransaccionOtroContract:                                           │
│     { ID_Transaccion: int, Fecha: "YYYY-MM-DD", Concepto: str,        │
│       Monto: float (signed), Contacto?: str,                          │
│       Estado: "Completado" | "Pendiente" | "Anulado",                 │
│       Accion_Pendiente?: str }                                        │
│                                                                        │
│  4. ReporteMoraContract:                                               │
│     { ID_Mora: int, Miembro_Aspirante: str, Saldo_Anterior: float,    │
│       Saldo_Actual: float, Meses_En_Mora: int > 0, Detalle_Meses: str,│
│       Ultimo_Contacto?: "YYYY-MM-DD",                                 │
│       Estado_Gestion: "Notificado" | "En Negociación" | "Sin Resp." } │
│                                                                        │
│  5. REST Backend API Specification:                                    │
│     • GET /api/v1/cuotas / POST /api/v1/cuotas                        │
│     • GET /api/v1/materiales / POST /api/v1/materiales                │
│     • GET /api/v1/otros / POST /api/v1/otros                          │
│     • GET /api/v1/mora / POST /api/v1/mora/reconciliar                │
---

### 5. Actualizaciones Recientes
- **Insignias que inician con número 1**: Se asignó una paleta activa distintiva y con alto contraste para los códigos del catálogo que comienzan con `1` (Cian `10`, Turquesa `11`, Fucsia `12`, Orquídea `13`, Lima `14`, Ámbar `15`, Melocotón `16`, Rosa `17`, Azul Acero `18`, Zafiro `19` y Turquesa general para la serie 1). Se mantiene su estado como activo (`isActivo: true`).

