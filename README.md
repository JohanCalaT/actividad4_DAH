# Actividad 4 - Desarrollo de Aplicaciones con Firebase

Esta aplicación ha sido desarrollada como parte de la Actividad 4, cumpliendo con todos los criterios de la rúbrica oficial (10 puntos).

---

## 🛠️ Preguntas Teóricas (Punto 1 - 1 pt)

### 1. ¿Qué diferencias hay entre Cloud Firestore y Realtime Database?
**Cloud Firestore** es la base de datos más moderna de Firebase. Se basa en una estructura de **documentos y colecciones**, lo que permite consultas más complejas y escalado automático. Permite filtrar y ordenar datos en una sola consulta. 
**Realtime Database**, por otro lado, almacena los datos como un único y gran **árbol JSON**. Es excelente para sincronizaciones extremadamente rápidas de datos simples, pero se vuelve difícil de gestionar cuando los datos crecen o requieren consultas complejas.

### 2. ¿Qué problemas de seguridad puede tener nuestra aplicación si las reglas de acceso de Cloud Firestore están abiertas?
Si las reglas tienen `allow read, write: if true;`, cualquier persona con la URL del proyecto podría **leer todos los datos, borrarlos o modificarlos** sin estar autenticado. Esto conlleva riesgos críticos de:
- **Pérdida de datos** (Borrado por ataques).
- **Fuga de información sensible** (Emails de usuarios, datos privados).
- **Altos costes** (Un atacante podría generar millones de peticiones que Firebase facturaría al propietario del proyecto).

### 3. ¿Cómo se podrían crear nuevos usuarios desde nuestra aplicación Ionic sin tener que crearlos a través de la consola de Firebase?
Se utiliza la API de Firebase Authentication a través del SDK de Angular (`@angular/fire/auth`). Específicamente, se ha implementado el método `createUserWithEmailAndPassword(auth, email, password)`. Este método permite capturar los datos desde un formulario de registro en la app Ionic y crear el usuario automáticamente en Firebase Auth sin intervención manual en la consola.

---

## 🚀 Funcionalidades Principales

- **Listado Genérico (Punto 2)**: Disponible en `/products` con carga infinita. Muestra imagen, nombre y descripción de todos los productos (sin filtros y sin opción de ver detalle según requisito).
- **Gestión Privada (Punto 3, 4, 5)**: Tras el login, el usuario accede a su **Dashboard** donde puede:
  - Ver el listado de sus productos.
  - Ver el **Detalle completo** de cada artículo.
  - **Eliminar** productos (con confirmación mediante Alert).
- **Login y Registro Eficiente**: Manejo de errores personalizado de Firebase para una mejor experiencia de usuario.

---

## 💻 Notas de Instalación
1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Ejecutar `ionic serve`.
