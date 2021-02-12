---
layout: base
title: Preguntas frecuentes sobre una web segura
permalink: "/faq/"
---
[España](/) - {{ title }}

# 📌 Preguntas frecuentes sobre una web segura

- [¿Qué es esta web?](#{{ '¿Qué es esta web?' | slug }})
- [¿Qué es una conexión segura (HTTPS)?](#{{ '¿Qué es una conexión segura (HTTPS)?' | slug }})
- [¿Qué nos asegura el cifrado?](#{{ '¿Qué nos asegura el cifrado?' | slug }})
- [¿Qué significan las notas, por qué son importantes?](#{{ '¿Qué significan las notas, por qué son importantes?' | slug }})
- [¿Qué tipo de problemas podría haber en webs que no tienen esa nota?](#{{ '¿Qué tipo de problemas podría haber en webs que no tienen esa nota?' | slug }})
- [¿Debemos exigir webs seguras?](#{{ '¿Debemos exigir webs seguras?' | slug }})
- [¿Cómo puedo participar en #websegura?](#{{ '¿Cómo puedo participar en #websegura?' | slug }})
- __🎬 [Vídeo-resumen explicativo sobre los peligros](https://twitter.com/PucelaBits/status/1359577471016910855)__

<a id="{{ '¿Qué es esta web?' | slug }}"></a>

## ¿Qué es esta web?

Websegura usa el servicio [Mozilla Observatory](https://observatory.mozilla.org/) para mostrar los análisis y la nota que les da esta herramienta externa a las webs de diferentes entidades públicas de España.

<a id="{{ '¿Qué es una conexión segura (HTTPS)?' | slug }}"></a>

## ¿Qué es una conexión segura (HTTPS)?
Cuando nos conectamos a una página web, nuestros datos viajan ida y vuelta desde nuestro dispositivo hasta el servidor de la página web por medio de cables y servidores intermedios.

Si la dirección de la web incluye HTTPS, esto quiere decir que estos datos viajan cifrados, pero no todas las webs HTTPS tienen una implementación segura.

<a id="{{ '¿Qué nos asegura el cifrado?' | slug }}"></a>

## ¿Qué nos asegura el cifrado?

Cuando una página tiene protocolo HTTPS, esta se compromete a que la conexión entre tu ordenador y tú es cifrada. Este cifrado supone que ningún agente externo pueda interferir en tu conexión con la página y ello tiene dos consecuencias.

🕵 Impide que nadie pueda **interceptar** los datos que introduces (contraseñas, datos bancarios, personales o médicos). Sólo tú y el dueño de la web puede verlos.

En una conexión no segura (sin HTTPS) cualquier persona en tu mismo wifi, tu compañía de Internet o agencias gubernamentales que analizan el tráfico podrían leer absolutamente todo.

💉 Impide que terceros **"inyecten"** contenido dañino o modifiquen la información de forma no detectable.

De nuevo, sin conexiones seguras, podrían cambiar el contenido, tanto visible como invisible, de las webs que visitamos para añadir publicidad, códigos para hacerte seguimiento entre webs o incluso código malicioso para infectar tu equipo o engañarte para infectarlo.

Además, el protocolo HTTPS te asegura que te estás conectando con la página que deseabas. Es decir, es un certificado de su autenticidad.

<a id="{{ '¿Qué significan las notas, por qué son importantes?' | slug }}"></a>

## ¿Qué significan las notas, por qué son importantes?

Sin embargo, usar HTTPS, no es suficiente para garantizar la total seguridad de nuestras conexiones, la página debe también implementar ciertas medidas para asegurarse que las conexiones a su web siempre se realizan mediante este protocolo. Las notas que puede obtener una página web son A, B, C, D, E y F. [Información técnica sobre la metodología de las notas](https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/scoring.md).

⚠**Si la web no tienen una nota A o B**, usan una implementación deficiente, ¡tu privacidad está en riesgo!

<a id="{{ '¿Qué tipo de problemas podría haber en webs que no tienen esa nota?' | slug }}"></a>

## ¿Qué tipo de problemas podría haber en webs que no tienen esa nota?

Si una web no tiene al menos una A o B, un actor malicioso podría aplicar algunos de los siguientes ataques:

### 🌐 Redirección a web no segura

Un atacante podría forzar tu navegador a cargar la versión no segura (HTTP) de la web para poder leer y modificar los datos (esto se conoce como [_downgrade attack_](https://en.wikipedia.org/wiki/Downgrade_attack))

### 🔓 Carga de recursos no seguros

La web podría cargar sin querer varios recursos de la web (imágenes, vídeos...) de forma no segura, haciéndolos vulnerables a ataques maliciosos.

### 👿 Carga de código malicioso de terceros

Alguien podría añadir mediante cualquier servicio para introducir información (como los comentarios), código malicioso de terceros que no está alojado en el servidor de la web. Abriendo un vector para atacar a todos los visitantes (este se conoce como [_XSS_](https://es.wikipedia.org/wiki/Cross-site_scripting))

Históricamente este código se ha empleado para robar usuarios y contraseñas o incluso realizar ataques para bloquear completamente una web (es decir, denegación de servicio o [_DDOS_](https://es.wikipedia.org/wiki/Ataque_de_denegaci%C3%B3n_de_servicio)).

### ⚔ Ataques externos

La web podría ser objetivo de ataques externos, como el llamado [_clickjacking_](https://es.wikipedia.org/wiki/Clickjacking), que permite que desde otra web o aplicación (como un juego) en el que una persona tenga que hacer clics, cargue la web atacada por debajo de forma invisible y haga a los visitantes hacer clic sin ellos saberlo.

<a id="{{ '¿Debemos exigir webs seguras?' | slug }}"></a>

## ¿Debemos exigir webs seguras?

Desde [PucelaBits](https://pucelabits.org/), pensamos que sí. Ahora más que nunca, y de forma creciente, Internet es un vehículo para informarse y participar activamente en la sociedad. Bien sea porque queremos conocer los servicios e infraestructuras de nuestro entorno más cercano o bien porque deseamos usar una web pública para completar un registro, las diversas entidades han de garantizarnos una conexión segura con sus páginas.

De otro modo, las diversas entidades, y sobre todo las entidades públicas, han de comprometerse a que podemos visitar e interactuar con sus espacios en línea sin detrimento de nuestra seguridad como internautas.

<a id="{{ '¿Cómo puedo participar en #websegura?' | slug }}"></a>

## ¿Cómo puedo participar en #websegura?

Si te interesa nuestro proyecto, tienes varias formas de participar en él:

-	Puedes participar añadiendo nuevas páginas web. [En nuestro GitHub](https://github.com/PucelaBits/websegura#a%C3%B1adir-una-web) tienes todas las instrucciones necesarias.
- Puedes hacer saber a las diversas entidades que sus páginas web no son seguras. En esta web puedes enviarles mensajes a Twitter con la opción “tuitear” que aparece al lado de cada enlace.
-	Si te gusta crear contenido, puedes utilizar la información que aquí aparece para elaborar piezas informativas que difundan la importancia de tener una web segura.
