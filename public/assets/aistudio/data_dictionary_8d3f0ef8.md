# Data Definition Dictionary: Registros CSV

**Archivos de Referencia:**

* `1-Registro-cuotas-membresia.csv`

* `2-Registro-materiales-clase.csv`

* `3-registro-otros.csv`

* `4-reporte-mora.csv`

**Propósito del Documento:** Definir la estructura de datos, tipos y reglas de negocio de los archivos de registro para adjuntarlos al Product Requirements Document (PRD).

## Archivo: `1-Registro-cuotas-membresia.csv`

**Descripción:** Registro principal del pago de cuotas mensuales de los miembros o aspirantes.

| Nombre del Campo | Tipo de Dato | Requerido | Descripción | Reglas de Negocio / Restricciones | 
| ----- | ----- | ----- | ----- | ----- | 
| `ID_Registro` | Integer | Y | Identificador único del pago. | Llave primaria (Autoincremental). | 
| `Miembro_Aspirante` | String | Y | Nombre completo del estudiante. | Sin caracteres especiales. | 
| `DUI` | String | N | Documento Único de Identidad. | Formato estándar de El Salvador (00000000-0). | 
| `Grupo_Horario` | String | Y | Grupo asignado al miembro. | Valores de lista predefinida. | 
| `Mes_Pagado` | String | Y | Mes que cubre la cuota. | Formato: 'Enero', 'Febrero', etc. | 
| `Monto_Cuota` | Decimal | Y | Cantidad abonada en la transacción. | Mayor a 0.00. | 
| `Fecha_Pago` | Date | Y | Fecha en que se realizó el abono. | Formato: YYYY-MM-DD. | 
| `Metodo_Pago` | String | Y | Plataforma o método de pago. | Ej: 'Págala', 'Transferencia', 'Efectivo'. | 
| `Referencia` | String | N | Número de comprobante o ticket. | Único por método de pago. | 

## Archivo: `2-Registro-materiales-clase.csv`

**Descripción:** Seguimiento de adquisición y pago de materiales, equipos o uniformes para las clases.

| Nombre del Campo | Tipo de Dato | Requerido | Descripción | Reglas de Negocio / Restricciones | 
| ----- | ----- | ----- | ----- | ----- | 
| `ID_Material_Log` | Integer | Y | Identificador único del registro. | Llave primaria. | 
| `Miembro_Aspirante` | String | Y | Nombre completo del estudiante. | Coincidir con registro de membresía. | 
| `Materia_Articulo` | String | Y | Nombre del material o artículo. | Texto libre corto. | 
| `Monto` | Decimal | Y | Costo del material. | Mayor o igual a 0.00. | 
| `Fecha_Solicitud` | Date | Y | Fecha en la que se requirió. | Formato: YYYY-MM-DD. | 
| `Estado_Pago` | String | Y | Estatus financiero del material. | Valores: 'Pagado', 'Pendiente'. | 
| `Estado_Entrega` | String | Y | Estatus físico del material. | Valores: 'Entregado', 'En Tránsito', 'Pendiente'. | 

## Archivo: `3-registro-otros.csv`

**Descripción:** Bitácora de transacciones misceláneas, cobros extraordinarios o eventos no tipificados en mensualidades y materiales.

| Nombre del Campo | Tipo de Dato | Requerido | Descripción | Reglas de Negocio / Restricciones | 
| ----- | ----- | ----- | ----- | ----- | 
| `ID_Transaccion` | Integer | Y | Identificador de la transacción. | Llave primaria. | 
| `Fecha` | Date | Y | Fecha del evento o transacción. | Formato: YYYY-MM-DD. | 
| `Concepto` | String | Y | Motivo del ingreso o gasto. | Texto descriptivo. | 
| `Monto` | Decimal | Y | Cantidad monetaria asociada. | Permite valores positivos y negativos. | 
| `Contacto` | String | N | Persona responsable o involucrada. | Referencia del tercero. | 
| `Estado` | String | Y | Estatus de la transacción. | Valores: 'Completado', 'Pendiente', 'Anulado'. | 
| `Accion_Pendiente` | String | N | Siguiente paso a realizar. | Texto libre (Ej. 'Enviar recibo'). | 

## Archivo: `4-reporte-mora.csv`

**Descripción:** Tablero de seguimiento para miembros con cuotas atrasadas y cálculo de saldos pendientes.

| Nombre del Campo | Tipo de Dato | Requerido | Descripción | Reglas de Negocio / Restricciones | 
| ----- | ----- | ----- | ----- | ----- | 
| `ID_Mora` | Integer | Y | Identificador del reporte. | Llave primaria. | 
| `Miembro_Aspirante` | String | Y | Nombre del miembro en atraso. | \- | 
| `Saldo_Anterior` | Decimal | Y | Deuda acumulada de años previos. | Por defecto 0.00. | 
| `Saldo_Actual` | Decimal | Y | Deuda total al momento del corte. | Calculado automáticamente. | 
| `Meses_En_Mora` | Integer | Y | Cantidad de meses sin pago. | Entero mayor a 0. | 
| `Detalle_Meses` | String | Y | Meses específicos adeudados. | Ej: 'Enero, Febrero'. | 
| `Ultimo_Contacto` | Date | N | Fecha de última gestión de cobro. | Formato: YYYY-MM-DD. | 
| `Estado_Gestion` | String | Y | Estatus del cobro. | Valores: 'Notificado', 'En Negociación', 'Sin Respuesta'. | 
