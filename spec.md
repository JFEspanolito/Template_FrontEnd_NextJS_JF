# Spec Template

```markdown
# SPEC: <Feature / System Name>

## 1. Metadata

| Campo | Valor |
|---|---|
| Nombre | |
| Módulo | |
| Autor | |
| Fecha | |
| Versión | |
| Estado | Draft / Approved / Deprecated |

---

# 2. Objetivo

Descripción clara de qué problema resuelve esta funcionalidad y cuál es su propósito dentro del sistema.

---

# 3. Alcance

## Incluye

-  
-  
-  

## No incluye

-  
-  
-  

---

# 4. Contexto del Sistema

Descripción breve de dónde vive esta funcionalidad dentro de la arquitectura.

| Elemento | Descripción |
|---|---|
| Servicio | |
| Framework | |
| Base de datos | |
| Dependencias externas | |

---

# 5. Actores

| Actor | Descripción |
|---|---|
| Usuario | |
| Sistema | |
| Servicio externo | |

---

# 6. Flujos Principales

## Flujo 1 — <Nombre del flujo>

1.  
2.  
3.  
4.  

Resultado esperado:

---

## Flujo 2 — <Nombre del flujo>

1.  
2.  
3.  

Resultado esperado:

---

# 7. Reglas de Negocio

| ID | Regla |
|---|---|
| BR-01 | |
| BR-02 | |
| BR-03 | |

---

# 8. Modelo de Datos

## Entidad: <Nombre>

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| id | string | sí | |
| name | string | sí | |
| created_at | datetime | sí | |

---

# 9. API Contract

## Endpoint

```

METHOD /api/<endpoint>

````

### Request

```json
{
}
````

### Response 200

```json
{
}
```

### Response Errors

| Código | Descripción |
| ------ | ----------- |
| 400    |             |
| 401    |             |
| 404    |             |
| 500    |             |

---

# 10. Validaciones

| Campo | Regla |
| ----- | ----- |
|       |       |
|       |       |

---

# 11. Estados del Sistema

| Estado   | Descripción |
| -------- | ----------- |
| Draft    |             |
| Active   |             |
| Archived |             |

---

# 12. Casos de Uso

## Caso 1 —  <Nombre>

Precondiciones:

*

Pasos:

1.
2.
3.

Resultado esperado:

---

## Caso 2 — <Nombre>

Precondiciones:

*

Pasos:

1.
2.
3.

Resultado esperado:

---

# 13. Casos de Error

| ID    | Escenario | Resultado esperado |
| ----- | --------- | ------------------ |
| ER-01 |           |                    |
| ER-02 |           |                    |

---

# 14. Test Scenarios

| Test ID | Descripción |
| ------- | ----------- |
| T-01    |             |
| T-02    |             |
| T-03    |             |

---

# 15. Performance

| Métrica      | Valor esperado |
| ------------ | -------------- |
| Latencia     |                |
| Throughput   |                |
| Concurrencia |                |

---

# 16. Seguridad

| Área          | Requisito |
| ------------- | --------- |
| Autenticación |           |
| Autorización  |           |
| Rate limit    |           |

---

# 17. Observabilidad

| Métrica | Descripción |
| ------- | ----------- |
| Logs    |             |
| Metrics |             |
| Alerts  |             |

---

# 18. Dependencias

| Servicio | Motivo |
| -------- | ------ |
|          |        |

---

# 19. Cambios

| Versión | Fecha | Cambio   |
| ------- | ----- | -------- |
| v0.1    |       | creación |

---

# 20. Notas

Información adicional relevante para implementación o mantenimiento.

```
contenido
```
