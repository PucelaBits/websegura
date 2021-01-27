# websegura

Una iniciativa de [PucelaBits](https://pucelabits.org/). Analizamos y mostramos [seguridad HTTPS de sitios web públicos](https://websegura.pucelabits.org), como medida para visualizar aquellos que pueden suponer un riesgo para sus usuarios.

## Participa

### Añadir una web

Si quieres incluir algún sitio público, puedes crear [un nuevo issue](https://github.com/PucelaBits/websegura/issues/new?assignees=&labels=new-site&template=nuevo-sitio.md&title=%5BNuevo+sitio%5D) o directamente crear un PR editando el fichero de la provincia o comunidad que corresponda en [`_data/`](https://github.com/PucelaBits/websegura/blob/main/_data/).

### Errores o sugerencias

[Abre un nuevo issue](https://github.com/PucelaBits/websegura/issues/new/choose) para hacernos saber si hay algún error con la web o tienes alguna idea para mejorar.

### Habla con nosotros

- [Chat en matrix](https://matrix.to/#/#PucelaBits_websegura:gitter.im)
- [![Chat en gitter https://gitter.im/PucelaBits/websegura](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/PucelaBits/websegura?utm_source=badge&utm_medium=badge&utm_content=badge)
- [PucelaBits](https://pucelabits.org)

## Desarrollo

Si quieres ayudar con el código de la web para mejorarla o añadir nuevas funcionalidades por favor sigue estas instrucciones.

### Requisitos

El framework que usamos es [Eleventy](https://www.11ty.dev/). Necesitarás git, npm, jq, curl, bash.

```
sudo apt get install git npm jq curl
```

Clona el repo

```
git clone git@github.com:PucelaBits/websegura.git
```

### Ejecutar en local

Instala dependencias

```
cd websegura
npm install
```

Ejecuta Eleventy

```
npx eleventy --serve
```

Deberías poder acceder a la web en local en [http://localhost:8080](http://localhost:8080)

### Actualizar el análisis de los sitios

Si modificas los listados de URLs, puede actualizar el análisis ejecutando (llevará unos minutos)

```
bash crawl.sh
```

### Enviar tus modificaciones

🐞 Por favor, [abre primero un issue](https://github.com/PucelaBits/websegura/issues/new/choose) para describir el problema que vas a solucionar e indica que vas ponerte con ello.

⭐️ Si quieres implementar una nueva funcionalidad, por favor, [crea un nuevo issue](https://github.com/PucelaBits/websegura/issues/new/choose) antes de hacer nada. Queremos asegurarnos que las nuevas funcionalidades tienen consenso antes de aceptarlas y que alguien trabaje en el código.

Manda [un pull request](https://github.com/PucelaBits/websegura/pulls) siempre con el menor numero de commits posible, referencia en los commits y el PR qué issue estás resolviendo (Fix #numero).

Si tienes alguna duda, puedes escribirnos en cualquiera de [los canales listados más arriba](#habla-con-nosotros).
