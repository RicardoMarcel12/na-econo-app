# App Economia NA

Sistema de registro y control de pago de membresías, materiales, mora y tesorería para la **Escuela de Filosofía Nueva Acrópolis** (El Salvador).

Aplicación web de una sola página (SPA) construida con React + TypeScript + Vite + Tailwind CSS. Los datos se persisten en el navegador (`localStorage`) y pueden exportarse a los archivos CSV oficiales del PRD o a un JSON consolidado para una base de datos central.

---

## Descripción general

El sistema centraliza la operación económica de la sede:

- Registro maestro de **miembros y aspirantes** con estatus institucional, grupo/horario e instructor.
- Cobro de **cuotas mensuales** con métodos de pago, referencias y amortización automática de mora.
- Seguimiento de **materiales y libros** (pago y entrega).
- Bitácora de **otros ingresos y gastos** de la sede, con archivos adjuntos.
- Tablero de **mora** con categorías en tiempo real y gestión de cobro.
- **Contratos JSON Schema Draft-07** y especificación de endpoints REST para conectar un backend central.
- **Diccionario de datos** y exportación/importación **CSV** conforme al PRD.

## Características principales

| Módulo | Qué permite |
| --- | --- |
| **Dashboard** | KPIs de recaudación de cuotas, cartera en mora, materiales y balance de otros ingresos; distribución por grupo y método de pago. |
| **Catálogos** | Administración de estatus institucional, horarios, instructores y grupos (con relaciones entre ellos). |
| **Miembros** | Alta, edición, eliminación, búsqueda, ordenamiento, importación/exportación CSV y validación de datos. |
| **Cuotas** | Registro de pagos, filtros, validación contra el contrato JSON y amortización automática del saldo en mora al registrar un pago. |
| **Materiales** | Control de solicitudes, costo, estado de pago y estado de entrega. |
| **Otros** | Bitácora de ingresos/gastos con estados y adjuntos (recibos, facturas) almacenados localmente. |
| **Mora** | Cálculo en tiempo real de **Solventes**, **Mora pequeña (< 3 meses)** y **3 meses o más**, con gráfico, deuda total y gestión de cobro. |
| **Contratos JSON** | Visor de schemas Draft-07, endpoints REST, validador en vivo de payloads y sincronizador por lote. |
| **Diccionario** | Estructura, tipos, obligatoriedad y reglas de negocio de los 4 registros CSV. |
| **Exportar Todo** | Descarga de los 5 CSV (incluye registro de miembros) y respaldo JSON centralizado; opción de restablecer datos demo. |

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| UI | React 19 + TypeScript |
| Build / dev server | Vite 8 |
| Estilos | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Iconos | lucide-react |
| Animaciones | motion |
| Utilidades | Express, dotenv, `@google/genai` (scaffolding de AI Studio; no se usan en el código actual) |
| Persistencia | `localStorage` del navegador |

## Requisitos

- **Node.js 20+** y npm.
- Navegador moderno con soporte de `localStorage` y `Blob` (Chrome, Edge, Firefox, Safari).

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo en http://localhost:3000
npm run dev

# Compilación de producción (genera dist/)
npm run build

# Previsualizar la compilación
npm run preview

# Verificación de tipos (tsc --noEmit)
npm run lint

# Limpiar artefactos de build
npm run clean
```

> El servidor de desarrollo se expone en `0.0.0.0` en el puerto `3000`.
> La recarga en caliente (HMR) se desactiva definiendo `DISABLE_HMR=true`, útil en AI Studio.

### Variables de entorno

El archivo `.env.example` documenta variables del entorno de AI Studio:

```dotenv
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
```

Actualmente **no se consumen en el código fuente**; la aplicación funciona sin ellas. Si se integra IA o servicios externos, crear un `.env` local a partir del ejemplo (los `.env*` están ignorados por Git, salvo `.env.example`).

## Estructura del proyecto

```text
na-econo-app/
├── index.html                      # Punto de entrada y metadatos
├── metadata.json                   # Metadatos del applet
├── package.json
├── tsconfig.json
├── vite.config.ts                  # React + Tailwind, alias "@" -> raíz
├── public/
│   └── assets/aistudio/
│       ├── data_dictionary_8d3f0ef8.md   # Diccionario de datos original
│       └── image_4a26e133.png
└── src/
    ├── main.tsx                    # Render de React
    ├── App.tsx                     # Estado global, navegación y handlers CRUD
    ├── index.css                   # Tailwind y tipografías
    ├── types/models.ts             # Entidades TypeScript del dominio
    ├── data/seedData.ts            # Datos demo y catálogos por defecto
    ├── utils/
    │   ├── storage.ts              # Persistencia y migraciones en localStorage
    │   └── csvEngine.ts            # Parseo/serialización CSV y descargas
    ├── services/
    │   └── moraBackendService.ts   # Cálculo de categorías de mora
    ├── contracts/
    │   └── jsonContracts.ts        # JSON Schemas, endpoints y validador
    └── components/
        ├── Header.tsx
        ├── DashboardView.tsx
        ├── CatalogosView.tsx
        ├── MiembrosView.tsx
        ├── CuotasView.tsx
        ├── MaterialesView.tsx
        ├── OtrosView.tsx
        ├── MoraView.tsx
        ├── ContractsView.tsx
        ├── DataDictionaryView.tsx
        ├── ExportAllModal.tsx
        └── TableSortHeader.tsx
```

## Modelo de datos

Definido en `src/types/models.ts`:

| Entidad | Propósito | Llave |
| --- | --- | --- |
| `Miembro` | Registro maestro de miembros/aspirantes: nombre, estatus, DUI, contacto, grupo, instructores, cuota. | `ID_Miembro` |
| `CuotaMembresia` | Pago de cuota mensual: miembro, grupo, mes, monto, fecha, método y referencia. | `ID_Registro` |
| `MaterialClase` | Material/libro solicitado: artículo, monto, fecha, estado de pago y de entrega. | `ID_Material_Log` |
| `TransaccionOtro` | Ingreso/gasto misceláneo (monto positivo o negativo) con adjuntos opcionales. | `ID_Transaccion` |
| `ReporteMora` | Saldo anterior/actual, meses en mora, detalle y estado de gestión. | `ID_Mora` |
| `HorarioClase` | Día y rango horario de clase. | `ID_Horario` |
| `Instructor` | Nombre y estatus del instructor. | `ID_Instructor` |
| `GrupoClase` | Grupo con referencias a horario e instructor. | `ID_Grupo` |

`DatabaseState` agrupa todas las colecciones y los catálogos (`catalogoEstatus`, `horarios`, `instructores`, `grupos`).

### Catálogo de estatus por defecto

`01-J.F.`, `02-F.F.V.V.`, `03-Miembro`, `04-Probacionista`, `05-Inscrito`, `06-Ficha llena`, `98-Sospecha de retiro`, `99-Retirado`.

- Los estatus que empiezan con `01` o `02` están exentos de grupo e instructores.
- Los estatus que empiezan con `9` se consideran inactivos.
- Al renombrar o eliminar un estatus, el cambio se propaga a miembros e instructores (reasignando a un estatus de respaldo).

## Archivos CSV oficiales

Generados por `src/utils/csvEngine.ts` (UTF-8 con BOM, RFC 4180, saltos `CRLF`):

| Archivo | Contenido |
| --- | --- |
| `registro-miembros.csv` | Registro maestro de miembros y aspirantes. |
| `1-Registro-cuotas-membresia.csv` | Cuotas mensuales pagadas. |
| `2-Registro-materiales-clase.csv` | Materiales y libros solicitados. |
| `3-registro-otros.csv` | Otras transacciones (incluye nombres de adjuntos). |
| `4-reporte-mora.csv` | Reporte de mora y gestión de cobro. |

La importación CSV está disponible en **Miembros**, **Cuotas**, **Materiales** y **Otros**. El tipo de archivo se detecta automáticamente por los encabezados (`detectCSVType`). La mora solo se exporta.

## Persistencia local

`src/utils/storage.ts` guarda cada colección bajo su propia clave y aplica migraciones de formatos anteriores:

```text
app_economia_na_miembros_v2
app_economia_na_cuotas_v3        (migra desde v2/v1)
app_economia_na_materiales_v1
app_economia_na_otros_v2         (migra desde v1)
app_economia_na_mora_v1
app_economia_na_catalogo_estatus_v1
app_economia_na_horarios_v1
app_economia_na_instructores_v1
app_economia_na_grupos_v1
```

- Los datos iniciales son de demostración y provienen de `src/data/seedData.ts`.
- **Exportar Todo → Restablecer datos predeterminados** borra las claves y recarga los datos demo.
- Al registrar una cuota, si el miembro tiene saldo en mora, este se amortiza automáticamente y se recalculan los meses pendientes.

## Contratos JSON y API

`src/contracts/jsonContracts.ts` define:

- **JSON Schemas Draft-07**: `MiembroSchema`, `CuotaMembresiaSchema`, `MaterialClaseSchema`, `TransaccionOtroSchema`, `ReporteMoraSchema` y `CentralDatabaseSyncPayloadSchema`.
- **Endpoints REST propuestos** (`CENTRAL_API_ENDPOINTS`):
  - `GET /api/v1/cuotas`
  - `POST /api/v1/cuotas`
  - `POST /api/v1/materiales`
  - `POST /api/v1/otros`
  - `POST /api/v1/mora/reconciliar`
  - `POST /api/v1/sync/central-database`
  - `GET /api/v1/mora/stats`
- **Validador en el navegador** (`validateEntityPayload`) usado por los formularios y por el visor de contratos.

Estos contratos son la base para conectar el frontend con PostgreSQL, Firebase u otra API central; actualmente **no existe un backend implementado**.

## Reglas y formatos

- **DUI**: formato salvadoreño `00000000-0` (regex `^[0-9]{8}-[0-9]$`, opcional en cuotas).
- **Fechas**: `YYYY-MM-DD`.
- **Meses**: formato estándar `01-ENERO` … `12-DICIEMBRE`; el sistema normaliza variantes como `Enero`, `1` o nombres sin prefijo.
- **Montos**: en USD con dos decimales.
- **Métodos de pago**: `Págala`, `Transferencia`, `Efectivo`, `Depósito Bancario` (el schema también admite `Cheque` y `Tarjeta`).
- **Estados**:
  - Material — pago: `Pagado` / `Pendiente`; entrega: `Entregado` / `En Tránsito` / `Pendiente`.
  - Otros: `Completado` / `Pendiente` / `Anulado`.
  - Mora: `Notificado` / `En Negociación` / `Sin Respuesta`.

## Flujo de trabajo típico

1. Configurar **Catálogos**: estatus, horarios, instructores y grupos.
2. Registrar **Miembros** con su grupo, instructor y cuota base.
3. Registrar **Cuotas** conforme se reciben los pagos (la mora se amortiza sola).
4. Gestionar **Materiales** y **Otros** movimientos de tesorería.
5. Revisar **Mora** y dar seguimiento a los casos pendientes.
6. **Exportar Todo** para respaldar en CSV/JSON o alimentar la base central.

## Notas y limitaciones

- Aplicación **solo frontend**: no hay servidor ni autenticación; los datos viven en el navegador y no se sincronizan entre dispositivos.
- Los adjuntos de **Otros** se guardan como Data URL en `localStorage`, lo que limita el tamaño total disponible.
- El cálculo de meses en mora tras un abono usa una referencia fija de `$25` por mes (`Math.ceil(saldo / 25)`).
- Los datos de `seedData.ts` son ficticios y solo sirven como demostración.
- `@google/genai`, `express` y `dotenv` figuran como dependencias del scaffolding, pero no se usan en el código actual.

---

**Escuela de Filosofía Nueva Acrópolis · El Salvador**
Registro Maestro de Miembros · Contratos JSON Draft-07
