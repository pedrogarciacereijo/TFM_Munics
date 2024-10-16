# Sistema de votación electrónica basado en blockchain

El código de este repositorio está asociado con el Trabajo de Fin de Máster del Máster Inter-Universitario en Ciberseguridad de la UDC y UVigo, con los siguientes datos: 
- Título: "Sistema de votación electrónica basado en blockchain"
- Autor: Pedro García Cereijo
- Tutores: Paula Fraga Lamas y Tiago Manuel Fernández Caramés
- Dirección: Facultade de Informática, Camiño do Lagar de Castro, 6, 15008, A Coruña

## Importante
Este trabajo es una prueba de concepto, así que la implementación actual no está pensada para ser usada directamente. El código está abierto a qué futuros desarrolladores puedan adaptarlo para sus necesidades específicas.


## Subsistemas:

- `Smart-Contract`: Smart contract escrito en Solidity que permite a los usuarios votar entre 2 opciones para una votación.
- `OrbitDB-Storage`: Los nodos OrbitDB funcionarán como almacenamiento descentralizado del sistema, almacenando las direcciones de los smart contracts desplegados.
- `Oráculo`:  El oráculo permitirá conectar los smart contracts  con el mundo off-chain,  permitiendo el almacenamiento en IPFS de los votos.
- `Voting-Dapp`:  La aplicación web que permitirá interactuar con todos los componentes.

La carpeta `Pruebas-OrbitDB` se corresponde con las pruebas definidas en la sección 5.3 de la memoria, donde se prueba el correcto funcionamiento de varios nodos de OrbitDB simultáneos, y no forma parte del sistema final, por lo que se explica al final de este README.

## Instalación

Para este sistema se ha utilizado una red Ethereum de prueba de Hardhat en el puerto 8544. Es importante tener en cuenta que, en caso de querer utilizar otra red de Ethereum, es necesario realizar los cambios adecuados en el sistema.

En el estado actual de la aplicación, está configurada con una cuenta de administrador que corresponde a la cuenta 19 generada por Hardhat.

### Hardhat
En primer lugar, después de instalar Hardhat, es necesario desplegar una red con el siguiente comando:

```
npx hardhat node --port 8544
```

Esto iniciará la red blockchain que usaremos en el proyecto y creará las cuentas que podremos importar a Metamask y utilizar en el sistema de votación. 

Para utilizar Metamask con esta red, tendremos que añadirla manualmente a la configuración de Metamask. Para ello, sigue estos pasos:

1.  Ir a Configuración en Metamask.
2.  Seleccionar Redes.
3.  Añadir manualmente cada uno de los campos que se muestran en la configuración de la red de prueba de Hardhat.

Una vez configurada la red, es necesario importar las cuentas en Metamask. Para ello, es necesario introducir la clave privada que se mostró al ejecutar Hardhat. Una vez completado el paso anterior, ya estará importada la cuenta en Metamask.

Al entrar por primera vez en la aplicación web, recibiremos un mensaje en Metamask que nos informará de que la cuenta importada no está conectada al sitio web actual. Una vez aceptemos la conexión, ya podremos utilizar la cuenta con la aplicación.

### Orbit DB
Para levantar el nodo de Orbit DB, en primer lugar es necesario asegurarse de que Node.js y npm se encuentran instalados en el equipo. Para instalar las dependencias del proyecto, se puede ejecutar el siguiente comando en el directorio raíz (orbitdb-storage):
```
npm install
```

Para levantar el nodo de OrbitDB, es suficiente con ejecutar el siguiente comando:
```
node server.js
```

Esto levantará un nodo de OrbitDB con la API en el puerto 3001. La aplicación ya está configurada para utilizar este puerto para añadir y recuperar la lista de las votaciones abiertas. En el caso de querer utilizar más nodos, es necesario realizar cambios como se ha indicado en la sección 4.3 de la memoria.

### Oráculo
En primer lugar, es necesario compilar el contrato oraculo.sol y desplegarlo en la red de Hardhat utilizando Remix IDE o cualquier otra herramienta que permita compilar y desplegar smart contracts. Una vez hecho esto, hay que copiar el ABI y el address y pegarlos en oraculoNodo.py.

Dentro del Dockerfile se definen los procesos necesarios para preparar el contenedor para la ejecución del oráculo y del nodo de IPFS. Dentro del script.sh se definen las operaciones que realiza el contenedor una vez desplegado, como la generación de la swarm.key, la ejecución del oráculo y el nodo IPFS.

Para crear la imagen del contenedor se utiliza el comando:
```
docker build -t nombre_imagen .
```

Para desplegar el contenedor e iniciar el oráculo se utiliza el comando:
```
docker run --name nombre_contenedor -p 8000:8000 nombre_imagen
```

Una vez desplegado el contenedor, se nos mostrará por consola los datos de la inicialización del nodo IPFS. El proceso comienza generando un par de claves ED25519 para la autenticación y encriptación, seguido de la identificación del peer en la red IPFS. Se inicializa un nodo IPFS en el directorio "/root/.ipfs". Posteriormente, se eliminan varias direcciones de bootstrap predeterminadas que se utilizan para descubrir otros peers en la red IPFS. Se clona el repositorio 'go-ipfs-swarm-key-gen', para generar una clave de swarm para la red privada. Luego, se inicia el proceso daemon de IPFS, mostrando las versiones utilizadas. La red de peers (swarm) está limitada a una red privada utilizando la clave de swarm generada. El nodo está escuchando conexiones en las direcciones IP 127.0.0.1 y 172.17.0.2 en el puerto TCP 4001, así como utilizando el protocolo 'p2p-circuit', anunciando su disponibilidad en las mismas direcciones y puerto.

Una vez iniciado, es necesario acceder al contenedor por línea de comandos y ejecutar el siguiente comando para levantar el nodo del oráculo:
```
python3 oraculoNodo.py
```

### Front-end
Para levantar el front-end, en primer lugar es necesario asegurarse de que Node.js y npm se encuentran instalados en el equipo. Para instalar las dependencias del proyecto, se puede ejecutar el siguiente comando en el directorio raíz (voting-dapp):
```
npm install
```

Para levantar el front-end, es suficiente con ejecutar el siguiente comando:
```
node server.js
```

Esto levantará la aplicación web en el puerto 3000. 

## Escenario de pruebas de OrbitDB

### Despliegue del escenario de Pruebas

Para desplegar el escenario de las pruebas definidas en la sección 5.3 de la memoria, primero ejecutaremos el nodo principal utilizando el siguiente comando desde la carpeta /NodoPrincipal:
```
node server.js
```
Una vez ejecutado el nodo principal, modificaremos el código del nodo secundario para introducir la dirección del nodo principal, la cual ha sido mostrada en la consola como resultado del comando anterior. También introduciremos la dirección de la base de datos OrbitDB, que igualmente ha sido mostrada en la consola. Luego, ejecutaremos el siguiente comando:
```
node client.js
```
Después de desplegar ambos nodos, podremos acceder a ellos a través de los puertos 3000 y 3001, respectivamente. Esto nos permitirá interactuar con cada uno de los nodos de la base de datos OrbitDB mediante dos interfaces front-end.

## Licencia

Este proyecto está licenciado bajo la [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).
