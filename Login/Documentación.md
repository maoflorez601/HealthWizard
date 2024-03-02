# Documentación Login

Las funcionalidades de Login permiten a la aplicación gestionar y controlar el acceso de los usuarios a la plataforma, asi como la privacidad y la seguridad de la información.

# Registro e Inicio de Sesión
## Título: Acceso a HealthBoost
### Descripción
Como usuario interesado en mejorar mi salud y bienestar, quiero poder registrarme e iniciar sesión en HealthBoost para acceder a las funciones personalizadas de la plataforma.

### Historias de usuario:

#### Registro/creación de usuario:
**Descripción:** El usuario puede registrarse con una dirección de correo electrónico y establecer una contraseña.

**Criterios de aceptación:**
- El usuario puede escribir un correo de máximo 100 caracteres para la creación de su cuenta.
- El usuario debe escoger una contraseña que contenga como mínimo una letra mayúscula, un carácter especial y un número.

#### Inicio de sesión:
**Descripción:** El usuario debe poder iniciar sesión con su correo electrónico y contraseña establecidos en la creación de usuario.

**Criterios de aceptación:**
- El usuario puede iniciar sesión con su dirección de correo electrónico y contraseña después de haber creado la cuenta.
- La aplicación verifica las credenciales del usuario y permite el acceso si son correctas.
- Se proporciona un mensaje de bienvenida o una pantalla de inicio de sesión exitosa después de iniciar sesión correctamente.

#### Recuperar contraseña:
**Descripción:** En caso de olvido de contraseña, el usuario puede restablecerla a través de un proceso seguro.

**Criterios de aceptación:**
- Si un usuario olvida su contraseña, debe haber un enlace o proceso para restablecer de manera segura.
- El usuario recibe un correo electrónico con un enlace seguro para restablecer la contraseña.
- Después de restablecer la contraseña, el usuario puede iniciar sesión con la nueva contraseña.
