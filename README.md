# #websegura

Una iniciativa de [PucelaBits](https://pucelabits.org/). Analizamos y mostramos [seguridad HTTPS de sitios web públicos](https://websegura.pucelabits.org), como medida para visualizar aquellos que pueden suponer un riesgo para sus usuarios.

## Participa

### Añadir una web

Si quieres incluir algún sitio público, puedes crear [un nuevo issue](https://github.com/PucelaBits/websegura/issues/new?assignees=&labels=new-site&template=nuevo-sitio.md&title=%5BNuevo+sitio%5D) o directamente crear un PR editando el fichero de la provincia o comunidad que corresponda en [`_data/`](https://github.com/PucelaBits/websegura/blob/main/_data/).

### Errores o sugerencias

🐞 [Abre un nuevo issue](https://github.com/PucelaBits/websegura/issues/new/choose) para hacernos saber si hay algún error con la web.

💡 Si tienes alguna idea o pregunta para mejorar, podemos [debatirla en los foros](https://github.com/PucelaBits/websegura/discussions).

### Habla con nosotros

- [Chat en matrix](https://matrix.to/#/#PucelaBits_websegura:gitter.im)
- [![Chat en gitter https://gitter.im/PucelaBits/websegura](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/PucelaBits/websegura?utm_source=badge&utm_medium=badge&utm_content=badge)
- [Foros del proyecto](https://github.com/PucelaBits/websegura/discussions)
- [PucelaBits](https://pucelabits.org)

## Desarrollo

Si quieres ayudar con el código de la web para mejorarla o añadir nuevas funcionalidades por favor sigue estas instrucciones.

### Requisitos

El framework que usamos es [Eleventy](https://www.11ty.dev/). Necesitarás `git` y `nodejs` 14+.

```sh
sudo apt get install git nodejs
```

Si quieres ejecutar el script para hacer el análiais de las webs, también necesitarás `jq` y `curl`.

```sh
sudo apt get install jq curl
```

Clona el repo

```sh
git clone git@github.com:PucelaBits/websegura.git
```

### Ejecutar en local

Instala dependencias

```sh
cd websegura
npm install
```

Levanta el servidor de desarrollo

```sh
npm start
```

Deberías poder acceder a la web en local en [http://localhost:8080](http://localhost:8080). Mientras dejes el proceso abierto, los cambios que hagas en el código se irán compilando automáticamente y podrás verlos recargando en el navegador.

### Actualizar el análisis de los sitios

Si modificas los listados de URLs, puede actualizar el análisis ejecutando (llevará unos minutos).

```sh
npm run crawl
```

El análisis se ejecuta automáticamente cada día y tras cada nuevo commit a la rama principal, por lo que no es necesario hacer commit de los ficheros generados.

### Añadir una nueva provincia

- Verifica que la comunidad de la provincia existe en `_data/comunidades`, si no, créala.
- Crea el archivo de la provincia en `_data/provincias` (usa uno existente como plantilla).

### Enviar tus modificaciones

🐞 Por favor, [abre primero un issue](https://github.com/PucelaBits/websegura/issues/new/choose) para describir el problema que vas a solucionar e indica que vas ponerte con ello.

⭐️ Si quieres implementar una nueva funcionalidad, por favor, [crea un nuevo issue](https://github.com/PucelaBits/websegura/issues/new/choose) antes de hacer nada. Queremos asegurarnos que las nuevas funcionalidades tienen consenso antes de aceptarlas y que alguien trabaje en el código.

Manda [un pull request](https://github.com/PucelaBits/websegura/pulls) siempre con el menor numero de commits posible, referencia en los commits y el PR qué issue estás resolviendo (Fix #numero).

Si tienes alguna duda, puedes escribirnos en cualquiera de [los canales listados más arriba](#habla-con-nosotros).
