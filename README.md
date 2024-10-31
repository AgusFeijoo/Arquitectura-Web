Leer como CODE para mas comodidad.

La idea del proyecto es un gestor de departamentos temporarios. Este tendra que poder:

⚫Cargar nuevos departamentos a gestionar
        Datos a solicitar:
        Alias de departamento
⚫Reservas nuevas
        [Nombre y apellido, fecha de ingreso, fecha de salida, reserva abonada, monto total
⚫Ser visualizados mediante un grafio de Gant. 
https://lucid.app/lucidchart/48f44658-0fd6-4c53-a553-445db317e477/edit?viewport_loc=17%2C195%2C2219%2C1087%2C0_0&invitationId=inv_6902075b-0c1c-4733-bb31-4ce7048addad
![der](https://github.com/user-attachments/assets/53850d30-e281-4d52-a474-b97da23d816b)


---------------------------------------------------------------------------------------------------------------------------------------
Endpoints

1. Gestión de Usuarios (/usuarios):

Crear un nuevo usuario (registro):
POST /api/usuarios
Crea un nuevo usuario enviando los datos como email, contraseña, nombre, apellido, teléfono.
Ejemplo: POST /api/usuarios (en el cuerpo de la solicitud irán los datos del usuario).

Iniciar sesión:
POST /api/usuarios/login
Permite iniciar sesión con email y contraseña.
Ejemplo: POST /api/usuarios/login (en el cuerpo de la solicitud se envían las credenciales).

Obtener la lista de usuarios:
GET /api/usuarios
Devuelve la lista de todos los usuarios registrados (solo para admin).
Ejemplo: GET /api/usuarios.

Obtener detalles de un usuario específico:
GET /api/usuarios/{id}
Devuelve la información del usuario con el id proporcionado.
Ejemplo: GET /api/usuarios/123 (donde 123 es el ID del usuario).


2. Gestión de Departamentos (/departamentos):

Crear un nuevo departamento:
POST /api/departamentos
Permite cargar un nuevo departamento con datos como alias, foto, tamaño, cantidad de camas, tipo de camas, etc.
Ejemplo: POST /api/departamentos.

Obtener la lista de departamentos:
GET /api/departamentos
Devuelve la lista de todos los departamentos registrados.
Ejemplo: GET /api/departamentos.

Obtener detalles de un departamento específico:
GET /api/departamentos/{id}
Devuelve la información del departamento con el id proporcionado.
Ejemplo: GET /api/departamentos/5 (donde 5 es el ID del departamento).

Actualizar un departamento existente:
PUT /api/departamentos/{id}
Permite actualizar los datos de un departamento específico.
Ejemplo: PUT /api/departamentos/5.

Eliminar un departamento:
DELETE /api/departamentos/{id}
Elimina un departamento según su ID.
Ejemplo: DELETE /api/departamentos/5.
3. Gestión de Reservas (/reservas):

Crear una nueva reserva:
POST /api/reservas
Crea una nueva reserva proporcionando detalles como nombre del huésped, fecha de ingreso, fecha de salida, camas solicitadas, cantidad de huéspedes, etc.
Ejemplo: POST /api/reservas.

Obtener la lista de todas las reservas:
GET /api/reservas
Devuelve todas las reservas registradas.
Ejemplo: GET /api/reservas.

Obtener detalles de una reserva específica:
GET /api/reservas/{id}
Devuelve los detalles de una reserva específica.
Ejemplo: GET /api/reservas/10 (donde 10 es el ID de la reserva).

Actualizar una reserva existente:
PUT /api/reservas/{id}
Actualiza los datos de una reserva específica.
Ejemplo: PUT /api/reservas/10.

Eliminar una reserva:
DELETE /api/reservas/{id}
Elimina una reserva según su ID.
Ejemplo: DELETE /api/reservas/10.
