# Documentación Login:

Las funcionalidades de Login permiten a la aplicación gestionar y controlar el acceso de los usuarios a la plataforma, asi como la privacidad y la seguridad de la información.

```markdown
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

# Casos de Prueba

## CP1.1 - Registro Exitoso
**Objetivo:** Verificar que un usuario pueda registrarse correctamente proporcionando un correo electrónico y una contraseña válida.

**Pasos:**
1. Acceder a la página de registro de HealthBoost.
2. Ingresar un correo electrónico válido y una contraseña que cumpla con los criterios de aceptación.
3. Confirmar el registro.

**Resultado Esperado:** El usuario debe registrarse correctamente y recibir una confirmación.

## CP1.2 - Ingreso Exitoso
**Objetivo:** Asegurar que un usuario registrado pueda iniciar sesión con éxito utilizando sus credenciales correctas.

**Pasos:**
1. Acceder a la página de inicio de sesión de HealthBoost.
2. Ingresar el correo electrónico y la contraseña utilizados durante el registro.
3. Iniciar sesión.

**Resultado Esperado:** El usuario debe poder acceder a su cuenta sin problemas.

## CP1.3 - Mensaje de Error
**Objetivo:** Confirmar que se muestra un mensaje de error adecuado si un usuario intenta iniciar sesión con credenciales incorrectas.

**Pasos:**
1. Acceder a la página de inicio de sesión de HealthBoost.
2. Ingresar un correo electrónico válido pero una contraseña incorrecta.
3. Intentar iniciar sesión.

**Resultado Esperado:** Debe mostrarse un mensaje de error indicando que las credenciales son incorrectas.

## CP1.4 - Seguridad
**Objetivo:** Verificar que la contraseña está cifrada y almacenada de manera segura.

**Pasos:**
1. Registrarse en HealthBoost y proporcionar una contraseña.
2. Acceder a la base de datos o almacenamiento donde se guardan las contraseñas.
3. Confirmar que la contraseña está cifrada y almacenada de manera segura.

**Resultado Esperado:** La contraseña debe estar cifrada y almacenada de forma segura para garantizar la seguridad de los datos.
```

## Arquitecura considerada:

![](https://github.com/maoflorez601/HealthWizard/blob/main/Arquitectura_Login.pdf)

