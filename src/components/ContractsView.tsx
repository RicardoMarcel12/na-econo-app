import React, { useState } from 'react';
import { DatabaseState } from '../types/models';
import {
  MiembroSchema,
  CuotaMembresiaSchema,
  MaterialClaseSchema,
  TransaccionOtroSchema,
  ReporteMoraSchema,
  CentralDatabaseSyncPayloadSchema,
  CENTRAL_API_ENDPOINTS,
  validateEntityPayload
} from '../contracts/jsonContracts';
import { downloadFile } from '../utils/csvEngine';
import { Code2, Server, CheckCircle2, AlertCircle, Copy, Download, Play, FileJson } from 'lucide-react';

interface ContractsViewProps {
  data: DatabaseState;
}

export const ContractsView: React.FC<ContractsViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'schemas' | 'endpoints' | 'validator' | 'export_sync'>('schemas');
  const [selectedSchema, setSelectedSchema] = useState<'miembros' | 'cuotas' | 'materiales' | 'otros' | 'mora' | 'full_sync'>('miembros');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live validator state
  const [validatorType, setValidatorType] = useState<'miembros' | 'cuotas' | 'materiales' | 'otros' | 'mora'>('miembros');
  const [validatorInput, setValidatorInput] = useState<string>(
    JSON.stringify(
      {
        ID_Miembro: 1,
        Miembro_Aspirante: "Alejandro Mendoza Ortiz",
        Condicion: "Miembro",
        DUI: "03456789-2",
        Celular: "7845-1234",
        Correo: "alejandro.mendoza@email.com",
        Grupo_Horario: "Introducción a la Filosofía - Mar/Jue 6:30 PM",
        Instructores: "Prof. Roberto Valencia",
        Concepto_Pago: "Cuota Mensual de Membresía",
        Cuota: 25.0
      },
      null,
      2
    )
  );
  const [validationResult, setValidationResult] = useState<{ checked: boolean; valid: boolean; errors: string[] } | null>(null);

  const getSchemaObject = () => {
    switch (selectedSchema) {
      case 'miembros': return MiembroSchema;
      case 'cuotas': return CuotaMembresiaSchema;
      case 'materiales': return MaterialClaseSchema;
      case 'otros': return TransaccionOtroSchema;
      case 'mora': return ReporteMoraSchema;
      case 'full_sync': return CentralDatabaseSyncPayloadSchema;
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadSchema = () => {
    const schemaObj = getSchemaObject();
    const str = JSON.stringify(schemaObj, null, 2);
    downloadFile(str, `${selectedSchema}_schema_draft07.json`, 'application/json');
  };

  const handleRunValidation = () => {
    try {
      const parsed = JSON.parse(validatorInput);
      const res = validateEntityPayload(validatorType, parsed);
      setValidationResult({ checked: true, valid: res.valid, errors: res.errors });
    } catch (err: any) {
      setValidationResult({
        checked: true,
        valid: false,
        errors: [`Error de sintaxis JSON: ${err.message}`]
      });
    }
  };

  const getFullCentralSyncPayload = () => {
    return {
      version: "1.0.0",
      sede: "Nueva Acrópolis - San Salvador",
      fecha_sincronizacion: new Date().toISOString(),
      miembros: data.miembros,
      cuotas: data.cuotas,
      materiales: data.materiales,
      otros: data.otros,
      mora: data.mora
    };
  };

  const handleDownloadSyncPayload = () => {
    const payload = getFullCentralSyncPayload();
    downloadFile(JSON.stringify(payload, null, 2), 'payload_central_database_sync.json', 'application/json');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Contratos JSON para Base de Datos Centralizada
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Especificaciones JSON Schema Draft-07, DTOs y Endpoints REST para conectar este sistema con bases de datos SQL o NoSQL
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadSyncPayload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Payload Centralizado</span>
          </button>
        </div>
      </div>

      {/* Subnav Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-xl text-xs">
        <button
          onClick={() => setActiveTab('schemas')}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-colors cursor-pointer ${
            activeTab === 'schemas'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          JSON Schemas (Entidades)
        </button>
        <button
          onClick={() => setActiveTab('endpoints')}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-colors cursor-pointer ${
            activeTab === 'endpoints'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Endpoints REST API
        </button>
        <button
          onClick={() => setActiveTab('validator')}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-colors cursor-pointer ${
            activeTab === 'validator'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Validador en Vivo
        </button>
        <button
          onClick={() => setActiveTab('export_sync')}
          className={`flex-1 py-1.5 px-3 rounded-md font-medium text-center transition-colors cursor-pointer ${
            activeTab === 'export_sync'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sincronizador Lote
        </button>
      </div>

      {/* Tab 1: Schemas */}
      {activeTab === 'schemas' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700 mr-2">Contrato de Entidad:</span>
            <button
              onClick={() => setSelectedSchema('miembros')}
              className={`px-3 py-1.5 rounded-md border font-medium cursor-pointer ${
                selectedSchema === 'miembros'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              0. Miembro (Maestro)
            </button>
            <button
              onClick={() => setSelectedSchema('cuotas')}
              className={`px-3 py-1.5 rounded-md border font-medium cursor-pointer ${
                selectedSchema === 'cuotas'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              1. CuotaMembresia
            </button>
            <button
              onClick={() => setSelectedSchema('materiales')}
              className={`px-3 py-1.5 rounded-md border font-medium cursor-pointer ${
                selectedSchema === 'materiales'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              2. MaterialClase
            </button>
            <button
              onClick={() => setSelectedSchema('otros')}
              className={`px-3 py-1.5 rounded-md border font-medium cursor-pointer ${
                selectedSchema === 'otros'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              3. TransaccionOtro
            </button>
            <button
              onClick={() => setSelectedSchema('mora')}
              className={`px-3 py-1.5 rounded-md border font-medium cursor-pointer ${
                selectedSchema === 'mora'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              4. ReporteMora
            </button>
            <button
              onClick={() => setSelectedSchema('full_sync')}
              className={`px-3 py-1.5 rounded-md border font-medium cursor-pointer ${
                selectedSchema === 'full_sync'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              5. CentralDatabaseSyncPayload
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>{selectedSchema.toUpperCase()}_SCHEMA.json (JSON Schema Draft-07)</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(JSON.stringify(getSchemaObject(), null, 2), 'schema_code')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] inline-flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedKey === 'schema_code' ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  onClick={handleDownloadSchema}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] inline-flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Descargar .json</span>
                </button>
              </div>
            </div>
            <pre className="overflow-x-auto max-h-[500px] text-emerald-300/90 leading-relaxed">
              {JSON.stringify(getSchemaObject(), null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Endpoints */}
      {activeTab === 'endpoints' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Contratos de los endpoints recomendados para el servicio backend central (Express, FastAPI, o Cloud Run) que se sincroniza con la base de datos de Nueva Acrópolis:
          </p>

          <div className="space-y-3">
            {CENTRAL_API_ENDPOINTS.map((endpoint, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                      endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="font-mono font-semibold text-slate-900">{endpoint.path}</span>
                  </div>
                  <span className="text-slate-500 font-medium">{endpoint.summary}</span>
                </div>

                <p className="text-slate-600 leading-relaxed">{endpoint.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  {endpoint.requestBodySchemaName && (
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                        Request Body Contract ({endpoint.requestBodySchemaName})
                      </span>
                      <pre className="bg-slate-50 p-2.5 rounded font-mono text-[11px] text-slate-800 overflow-x-auto border border-slate-200">
                        {JSON.stringify(endpoint.samplePayload, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Response Contract
                    </span>
                    <pre className="bg-slate-50 p-2.5 rounded font-mono text-[11px] text-slate-800 overflow-x-auto border border-slate-200">
                      {endpoint.responseSchemaName}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Validator */}
      {activeTab === 'validator' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Validador Interactivo de Contrato JSON
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pegue un objeto JSON que provenga del backend, webhook o API externa para verificar si cumple las reglas de negocio de App Economia NA:
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="font-medium text-slate-700">Validar contra:</span>
              <select
                value={validatorType}
                onChange={(e) => setValidatorType(e.target.value as any)}
                className="px-3 py-1.5 border border-slate-300 rounded-md bg-white font-medium focus:outline-hidden"
              >
                <option value="miembros">Miembro (Datos Inmutables y Cuota Base)</option>
                <option value="cuotas">CuotaMembresia (1-Registro-cuotas-membresia.csv)</option>
                <option value="materiales">MaterialClase (2-Registro-materiales-clase.csv)</option>
                <option value="otros">TransaccionOtro (3-registro-otros.csv)</option>
                <option value="mora">ReporteMora (4-reporte-mora.csv)</option>
              </select>
            </div>

            <div>
              <textarea
                value={validatorInput}
                onChange={(e) => setValidatorInput(e.target.value)}
                rows={10}
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-md focus:border-slate-900 focus:outline-hidden bg-slate-50"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleRunValidation}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Ejecutar Validación</span>
              </button>

              {validationResult && (
                <div>
                  {validationResult.valid ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>El JSON cumple estrictamente con el contrato.</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-md border border-rose-200">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>{validationResult.errors.length} infracciones al contrato encontradas.</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {validationResult && !validationResult.valid && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 space-y-1">
                <span className="font-bold block mb-1">Detalle de Infracciones:</span>
                {validationResult.errors.map((err, i) => (
                  <p key={i}>· {err}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Export Sync */}
      {activeTab === 'export_sync' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Lote Consolidado de Sincronización Centralizada
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Este payload agrupa las 4 colecciones de la sede en un solo paquete JSON estructurado según el contrato <span className="font-mono">CentralDatabaseSyncPayload</span>:
                </p>
              </div>
              <button
                onClick={handleDownloadSyncPayload}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Archivo JSON</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block">Miembros:</span>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900">{data.miembros.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block">Cuotas:</span>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900">{data.cuotas.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block">Materiales:</span>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900">{data.materiales.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block">Otros:</span>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900">{data.otros.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block">En Mora:</span>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900">{data.mora.length}</span>
              </div>
            </div>

            <pre className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
              {JSON.stringify(getFullCentralSyncPayload(), null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
