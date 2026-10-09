# BancoIAS Frontend

Frontend web para gestionar transferencias entre cuentas. La solución permite crear
una transferencia, consultar su resultado por referencia y revisar las transferencias
más recientes.

## Alcance completado

El alcance implementado en este repositorio es el siguiente:

- Formulario para solicitar transferencias en COP con referencia, cuenta origen,
  cuenta destino y monto.
- Validaciones de campos obligatorios, longitud máxima, monto mínimo y prevención
  de transferencias a la misma cuenta.
- Visualización del resultado de la operación, incluyendo estado autorizado o
  rechazado y motivo de rechazo.
- Consulta de una transferencia por referencia desde un modal.
- Historial de las últimas 20 transferencias, con acceso al detalle al seleccionar
  un registro.
- Mensajes de error amigables para respuestas de la API, errores HTTP, falta de
  conexión y errores inesperados.
- Interfaz visual responsive y componentes reutilizables para campos, modal,
  estados y formatos de moneda/fecha.

## Estado y limitaciones conocidas

La interfaz está funcional para el flujo descrito, pero su ejecución depende de que
el backend de BancoIAS esté disponible. Quedan fuera del alcance actual:

- Autenticación, autorización y manejo de sesiones de usuario.
- Persistencia local o modo offline.
- Pruebas end-to-end y pruebas visuales automatizadas; las pruebas incluidas son
  unitarias.
- Despliegue a un ambiente productivo y configuración de variables por ambiente.
- Implementación o cambios en el backend: este repositorio contiene únicamente el
  código fuente del frontend.

Estas limitaciones permiten distinguir entre las funcionalidades entregadas y los
aspectos que requerirían trabajo adicional.

## Tecnologías y requisitos

- Angular 20
- TypeScript 5.9
- RxJS 7.8
- Jasmine + Karma para pruebas unitarias
- Node.js 20 o superior
- npm
- Backend de BancoIAS ejecutándose en `http://localhost:8080`

## Ejecución local

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:

   ```bash
   npm start
   ```

3. Abrir [http://localhost:4200](http://localhost:4200).

Durante el desarrollo, `proxy.conf.json` reenvía las solicitudes que comienzan
por `/api` a `http://localhost:8080`, evitando configurar la URL del backend
directamente en el navegador.

## Pruebas automatizadas

Ejecutar las pruebas unitarias:

```bash
npm test
```

Para una ejecución no interactiva en Chrome Headless:

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

Las pruebas actuales verifican:

- Interpretación de errores HTTP y mensajes provenientes de la API.
- Reglas de validación y transformación del formulario de transferencias.
- Creación, consulta y listado de transferencias mediante `HttpTestingController`.
- Manejo de sobres de respuesta exitosos y fallidos.

## Compilación

```bash
npm run build
```

El resultado de producción se genera en `dist/`. Para compilación continua durante
el desarrollo:

```bash
npm run watch
```

## Contrato de API utilizado

El frontend utiliza el prefijo `/api` y espera transferencias con la siguiente
estructura funcional:

| Método | Ruta | Uso |
| --- | --- | --- |
| `POST` | `/api/transfers` | Crear una transferencia |
| `GET` | `/api/transfers/{ref}` | Consultar por referencia |
| `GET` | `/api/transfers?limit=20` | Listar las transferencias recientes |

Las respuestas individuales pueden venir dentro de un sobre con `success`, `data`
y `error`. El listado también admite directamente un arreglo, para soportar ambas
representaciones del backend.

## Estructura del código fuente

```text
src/
  app/
    core/http/                  Normalización de errores HTTP y tipos de API
    features/transfers/         Flujo completo de transferencias
      components/               Formulario, consulta, historial y resultado
      pages/                    Página principal
      utils/                    Creación y transformación del formulario
      transfer.service.ts       Acceso HTTP al backend
      transfers.facade.ts       Estado y coordinación de la pantalla
    shared/                     Componentes, directivas, pipes y utilidades
  environments/                 Configuración de URL de API
  main.ts                       Punto de entrada
```

La aplicación usa componentes standalone de Angular y carga la página principal
con `loadComponent`. La lógica de negocio está separada de la presentación:
`TransferService` encapsula HTTP y `TransfersFacade` coordina el estado de la
pantalla.

## Decisiones técnicas

| Decisión | Motivo |
| --- | --- |
| Angular standalone components | Reduce configuración global y mantiene cada funcionalidad encapsulada. |
| Organización por feature (`features/transfers`) | Agrupa la interfaz, el servicio y las reglas del dominio de transferencias. |
| Facade para la pantalla | Evita que los componentes presentacionales coordinen directamente todas las llamadas HTTP. |
| Proxy de desarrollo para `/api` | Mantiene la URL del backend fuera de los componentes y evita problemas de CORS en local. |
| Sobres de API y arreglos en el listado | Permite tolerar las dos formas de respuesta que expone el backend. |
| Mensajes de error centralizados | Ofrece una respuesta consistente para errores de validación, conexión y servidor. |
| COP con locale `es-CO` | Representa los montos según el contexto colombiano y sin decimales. |

## Uso de inteligencia artificial

Durante el desarrollo se utilizó inteligencia artificial como apoyo para definir y
refinar la interfaz visual del frontend: composición de pantallas, jerarquía visual,
componentes de interacción y estilos responsive. La integración con la API, las
validaciones, la separación de responsabilidades, las pruebas y la revisión final
del código forman parte de la implementación de este repositorio.

## Historial de commits

El historial disponible en el repositorio registra el siguiente commit de desarrollo:

| Commit | Descripción |
| --- | --- |
| `1aa9308` | `initialize Angular project with basic structure and transfer functionality` |

Para consultar el historial completo y los cambios asociados:

```bash
git log --oneline --decorate
git show --stat 1aa9308
```

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm start` | Servidor de desarrollo en el puerto 4200 |
| `npm test` | Pruebas unitarias con Karma y Jasmine |
| `npm run build` | Compilación de producción |
| `npm run watch` | Compilación continua en modo desarrollo |
