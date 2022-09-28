# CH Backend - Entrega Final Proyecto 

## EZEQUIEL PETRONE

Gracias tanto a los comentarios del código como a los errores que devuelve cada endpoint es fácil entender el funcionamiento, de todos modos algunas aclaraciones:

## Comentarios Entrega Final:

- Por cuestiones personales, de un tiempo a esta parte no tuve la posibilidad de dedicarle muchas horas al curso pero considero que afortunadamente pude plasmar todos los conceptos aprendidos. La realidad es que esta entrega no es ni más ni menos que un recopilado de mis entregas anteriores.

- Leyendo esta última semana las consignas de la entrega final, me doy cuenta que algunos puntos en particular difieren de lo que yo venía haciendo, pero teniendo en cuenta las excelentes devoluciones que siempre tuve de parte de mis tutores decidí seguir por esa vía y no rehacer cosas de cero.

- Dicho esto, sugiero leer tanto los comentarios de esta última entrega como los de las entregas anteriores para entender la lógica de mi e-commerce (principalmente lo relacionado con checkout de carritos y manejo de stock)

- Separé todo el código en capas según MVC. Cada capa hace lo suyo y no se saltean funcionalidades.

- La capa de Ruteo maneja las rutas obviamente e implementa ciertos Middlewares. 

- Los Controllers, además de ser los que definan las funciones que utilizan los Routers y los que llaman a los Servicios de cada API, manejan todo lo relacionado con validaciones de datos tanto los que llegan del request como los que se devuelven post procesamiento.

- La capa de Servicio maneja toda la lógica de negocio (incluye por ejemplo envío de mails), siendo la intermediaria entre los Controllers y la capa de persistencia (por ende se abstrae a nuestra app de las fuentes de datos elegidas)

- La capa de Persistencia justamente es la que maneja todo lo relacionado con las fuentes de datos.

- Intenté implementar correctamente los response status. Dejando la familia de los "400" para errores del request y los "500" para errores del backend.

- Hay patrones de diseño implementados como son FACTORY Y SINGLETON.

- Se puede elegir TIPO de PERSISTENCIA (MONGO o FILE). Ver config.

- Particularmente en la configuración de passport local me pareció muy complejo separar la capa de persistencia... Ya que el código que vimos en clase hace callbacks de callbacks dentro de los métodos mongoose... Es por eso que, al menos por ahora, lo dejé así (y por ejemplo no permito que la persistencia de usuarios sea por File)

- Se puede elegir MODO en el cuál se levanta el Server (CLUSTER o FORK). Ver config.

- Si bien desde cero este proyecto estuvo pensado para funcionar con mi front end, obviamente los endpoints de la api de productos y carritos funcionan con llamadas externas por ejemplo utilizando POSTMAN.

Lo que sí es importante emular el SIGNUP / LOGIN del Passport Local para obtener la cookie de conexión y de esa forma poder acceder a los datos. Sin autenticación los endpoints devuelven error.

Ejemplo de request por si quieren obetener la cookie de conexión con POSTMAN para luego utilizarla en el resto de los endpoints:

POST a http://localhost:8080/login

json BODY:
{ "email": "bruno@gmail.com", "password": "123456" }

- La ruta /chat muestra un chat ENTRE USUARIOS en tiempo real que utiliza Socket.io (básicamente ese módulo es el que hicimos para la entrega de websockets, no lo rehice pensandolo como canal de comunicación entre usuarios y el ADMIN del site)

- HEROKU:

https://esdpstore.herokuapp.com/

## Comentarios Tercera Entrega:

- Todas las vistas estáticas de la web son proporcionadas por el back, utilizando el motor de plantillas Handlebars
Pero el front maneja el render de los elementos dinámicos y todo lo que es interacción con el usuario.

- Cuando un nuevo user se loguea, se crea automáticamente un carrito abierto asociado a dicho user.
(Si un user se loguea y por algún motivo no cuenta con un carrito abierto asociado a su cuenta se le crea también...)

- Obviamente el contendido del carrito de un user persiste, por ende al desloguearse y volverse a loguear no lo pierde.
(Si bien no hace falta en este proyecto, en paralelo debería haber una rutina que elimine los carritos con X tiempo de antigüedad)

- Dado que yo no quería que esté expuesto en el front datos como el id de los carritos, lo que hice fue darle a los endpoints de api/carritos la inteligencia suficiente para reconocer al user authenticado y devolver la data de su carrito correspondiente.

- Decidí manejar el ABM del maestro de productos por fuera de la web.
(Con Postman por ejemplo. En caso que sea necesario se lo puedo incorporar)

- Si tuviese la posibilidad de dedicarle más tiempo, estaría bueno agregarle filtros al store de productos del home.
(Hoy muestro todos ya que los proeductos no están categorizados)

- Actualmente el sistema modifica el stock del maestro de productos cuando un user agrega / elimina productos a su carrito.
Así lo tengo desde la primer entrega del proyecto porque entendí que es lo que pedía la descripción de la API rest.
En mi opinión, si este fuese un proyecto personal sin consignas, la baja del stock debe hacerse al momento del checkout.

- Pendiente: limitar la qty de unidades que un user puede agregar de un producto para evitar quiebres de stock sin comprar...

- Al momento del checkout lo que hago es "cerrar" el carrito en cuestión (atributo activo lo paso de true a false) y "abrir" un nuevo carrito vacío
(En realidad, si el diseño dependiera de mí, ese cierre de carrito debería crear otra entidad llamada PEDIDO u ORDEN dentro de la BD)

- Obviamente hay validaciones que no permiten hacer el checkout de un carrito vacío.

- Actualmente el monto total que muestra el carrito lo calcula con el precio de los productos al momento que fue agregado al mismo.
(Está hecho así porque la descripción de la API de los entregables anteriores pedía que guardemos TODOS los datos del producto dentro del array del carrito)

Si yo haría el diseño, sólo guardaría SKU y qty en el carrito, y todo lo relacionado con el precio lo calcularía en tiempo real obteniendolo del maestro de productos!

- Si tuviese la posibilidad de dedicarle más tiempo al SIGNUP, estaría bueno permitirle al user modificar sus datos personales e implementar multer para que el user pueda adjuntar un file, en vez de ingresar la url de alguna imagen ya hosteada.

- Todo lo relacionado con la configuración de Passport Local está en /src/auth/passportConfig.js

- Mails que el sistema envía:

A) Al admin informando Nuevo registro con datos del new user.

B) Al admin (bcc) y al mail registrado del user (to) con el checkout de su carrito.

Pendiente: mejorar el HTML enviado. Actualmente estoy mandando un json sin formato.

- Cambié todos los console.log por mi logger Winston.

- Para levantar el server en modo CLUSTER pasarle -m CLUSTER por parámetro (o editarlo en el .env)

## Comentarios Entregas Anteriores:

- Al final de este doc hay ejemplos de los body que acepta cada endpoint

- Reutilicé la clase Contenedor que había desarrollado en las primeras entregas ya que estaba bastante completa, es por eso que las clases que extiendan de la misma me quedaron tan simples.

- Cuando se quiere eliminar un producto del file, primero se valida que ese producto no esté en algún carrito. En dicho caso se solicita primero eliminarlo de cada carrito y luego eliminarlo del file de productos.

- Cuando se agrega un producto a un carrito sólo se necesita id del producto y qty deseada (esa qty es el stock del producto dentro del array productos del carrito). Si el producto no existe aún en dicho carrito lo agrega pero si ya existe suma la qty actual a la original.

- Cuando se agrega un producto a un carrito se descuenta la qty seleccionada del stock del producto en el file de productos. SE VALIDA QUE HAYA STOCK SUFICIENTE ANTES DE HACER DICHA OPERACIÓN.

- Cuando se elimina un producto de un carrito se devuelve la qty que poseía al stock del file de productos. Si se elimina un carrito entero, devuelve stock por cada uno de los productos incluídos.

## ejemplo body POST / PUT de productos (router productos)

{
    "nombre": "Remera Vintage",
    "descripcion": "Es una Remera Clasic Style",
    "codigo": "RV123",
    "thumbnail": "www.misimagenes.com/remeravintage",
    "precio": 1900,
    "stock": 50
}

## ejemplo body POST un producto dentro de un carrito (router carritos)

{
    "idProd": "18siW1imNGyOlkoa2vCq",
    "qty": 10
}