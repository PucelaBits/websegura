---
layout: base
title: Preguntas frecuentes sobre una web segura
permalink: "/faq/"
---
# 📌 Preguntas frecuentes sobre una web segura

[España](/) - {{ title }}

## ¿Qué es esta web?

Websegura usa el servicio [Mozilla Observatory](https://observatory.mozilla.org/) para analizar y mostrar la nota que tienen las webs de diferentes entidades públicas.

## ¿Qué es una conexión segura (HTTPS)?
Cuando nos conectamos a una página web, nuestros datos viajan ida y vuelta desde nuestro dispositivo hasta el servidor de la página web por medio de cables y servidores intermedios.

Si la dirección de la web incluye HTTPS, esto quiere decir que estos datos viajan cifrados, pero no todas las webs HTTPS tienen una implementación segura.

## ¿Qué nos asegura el cifrado?

🕵 Impide que nadie pueda **interceptar** los datos que introduces (contraseñas, datos bancarios, personales o médicos). Sólo tú y el dueño de la web puede verlos.

En una conexión no segura cualquier persona en tu mismo wifi, tu compañía de Internet o agencias gubernamentales que analizan el tráfico podrían leer absolutamente todo.

💉 Impide que terceros **"inyecten"** contenido dañino o modifiquen la información de forma no detectable.

De nuevo, sin conexiones seguras, podrían cambiar el contenido, tanto visible como invisible, de las webs que visitamos para añadir publicidad, códigos para hacerte seguimiento entre webs o incluso código malicioso para infectar tu equipo o engañarte para infectarlo.

## ¿Qué significan las notas, por qué son importantes?

Aunque una web implemente HTTPS, debe también implementar ciertas medidas para asegurarse que las conexiones a su web siempre se realizan así.

⚠**Si la web no tienen una nota A o B**, usan una implementación deficiente, ¡tu privacidad está en riesgo!

## ¿Qué tipo de problemas podría haber en webs que no tienen esa nota?

Si una web no tiene al menos una A o B, un actor malicioso podría aplicar algunos de los siguientes ataques:

### 🌐 Redirección a web no segura

Un atacante podría forzar tu navegador a cargar la versión no segura (HTTP) de la web para poder leer y modificar los datos ([_downgrade attack_](https://en.wikipedia.org/wiki/Downgrade_attack))

### 🔓 Carga de recursos no seguros

La web podría cargar sin querer varios recursos de la web (imágenes, vídeos...) de forma no segura, haciéndolos vulnerables.

### 👿 Carga de código malicioso de terceros

Alguien podría añadir mediante cualquier servicio para introducir información (como los comentarios), código malicioso de terceros que no está alojado en el servidor de la web. Abriendo un vector para atacar a todos los visitantes ([_XSS_](https://es.wikipedia.org/wiki/Cross-site_scripting))

Historicamente esto se ha usado para robar usuarios y contraseñas o incluso realizar ataques para bloquear completamente una web (denegación de servicio o [_DDOS_](https://es.wikipedia.org/wiki/Ataque_de_denegaci%C3%B3n_de_servicio)).

### ⚔ Ataques externos

La web podría ser objetivo de ataques externos, como el llamado [_clickjacking_](https://es.wikipedia.org/wiki/Clickjacking), que permite que desde otra web o aplicación (como un juego) en el que una persona tenga que hacer clics, cargue la web atacada por debajo de forma invisible y haga a los visitantes hacer clic sin ellos saberlo.
