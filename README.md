# Proyecto-Micromercado
Nuestro proyecto tiene como finalidad el desarrollo de una pagina web sobre un catalogo de productos para el negocio Micromercado Koki, con el objetivo de mostrar de manera organizada y accesible la variedad de productos que ofrece el establecimiento
Fragmentos, Plantillas y Web Components

Fragmentos (HTML dinámico)

Los fragmentos son partes de una página web que se separan en archivos independientes y luego se cargan dinámicamente con JavaScript.

En este proyecto, se implementaron usando `fetch()` para cargar componentes como:

* Header (encabezado)
* Sidebar (menú lateral)
* Footer (pie de página)

¿Por qué se usan?

* Evitan repetir código en varias páginas
* Facilitan el mantenimiento
* Permiten actualizar una sola vez y que se refleje en todo el sitio

Plantillas (Templates)

Las **plantillas** son estructuras HTML reutilizables que sirven para mostrar información dinámica.

En el proyecto se utilizaron para:

* Mostrar productos cargados desde un archivo JSON

Funcionamiento:

1. Se obtiene la información (nombre, precio, imagen)
2. Se crea una estructura HTML base
3. Se reemplazan los datos dinámicamente

Ventajas:

* Código más limpio
* Mayor organización
* Escalabilidad (puedes agregar más productos fácilmente)

Web Components

Los **Web Components** son elementos personalizados de HTML creados con JavaScript.

En este proyecto se creó un componente llamado:

 ¿Qué hace?

* Representa una tarjeta de producto
* Tiene su propio diseño y estructura
* Funciona como una etiqueta HTML personalizada

Ventajas:

* Reutilización de código
* Encapsulación (no afecta otros estilos)
* Código más modular y profesional

 Implementación del formulario de inicio de sesión

El formulario de login se desarrolló combinando HTML, CSS y JavaScript.

Estructura (HTML)

Se creó un formulario con los siguientes campos:

* Usuario
* Correo electrónico
* Contraseña

También incluye botones para:

* Cambiar entre Registro y Login
* Ingresar al sistema

Estilos (CSS)

Se diseñó una interfaz centrada y visualmente clara:

* Formulario centrado en pantalla
* Inputs con iconos
* Colores consistentes con el sitio
* Botones diferenciados

Esto mejora la experiencia del usuario.

Lógica (JavaScript)

Uso de DOMContentLoaded


Cambio entre Login y Registro

Se implementa ocultando o mostrando el campo de usuario:


#### ✔ Validación de datos

Se verifica que los campos no estén vacíos:

* En Login → solo correo y contraseña
* En Registro → todos los campos

Si hay errores, se muestra un mensaje en pantalla.

Verificación de credenciales

Se comparan los datos ingresados con valores predefinidos:



Buenas prácticas aplicadas
 1. Separación de responsabilidades

Se divide el proyecto en:

* HTML → estructura
* CSS → diseño
* JavaScript → lógica

Uso de componentes reutilizables

Se implementaron:

* Fragmentos (header, sidebar, footer)
* Web Components (tarjetas de productos)

---

 Programación dinámica

Uso de:

* JSON para productos
* Generación automática de contenido

---
Manejo adecuado del DOM

Uso de:

```js
addEventListener
```

en lugar de eventos inline.

 Validación de formularios

Se verifica que:

* Los campos estén completos
* Los datos sean correctos

---

Uso de almacenamiento local

`localStorage` permite:

* Simular autenticación
* Mantener estado del usuario

---

Experiencia de usuario (UX)

* Mensajes claros de error
* Interfaz limpia
* Navegación fluida

---

 Conclusión (para decir en la sustentación)

Este proyecto implementa un sistema web modular y organizado, donde se utilizan fragmentos para reutilizar estructuras, plantillas para generar contenido dinámico y Web Components para encapsular funcionalidades.

Además, el formulario de inicio de sesión permite validar datos y simular autenticación mediante el uso de localStorage, aplicando buenas prácticas como la separación de responsabilidades, el uso de eventos adecuados y la reutilización de código.

Todo esto permite que la aplicación sea más escalable, mantenible y cercana a un desarrollo web profesional.
