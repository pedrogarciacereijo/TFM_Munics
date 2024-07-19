# Sistema de votación electrónica basado en blockchain


## Importante
Este trabajo es una prueba de concepto, así que la implementación actual no está pensada para ser usada directamente. El código está abierto a qué futuros desarrolladores puedan adaptarlo para sus necesidades específicas.


## Subsistemas:

- `Smart-Contract`: Smart contract escrito en Solidity que permite a los usuarios votar entre 2 opciones para una votación.
- `OrbitDB-Storage`: Los nodos OrbitDB funcionarán como almacenamiento descentralizado del sistema, almacenando las direcciones de los smart contracts desplegados.
- `Oráculo`:  El oráculo permitirá conectar los smart contracts  con el mundo off-chain,  permitiendo el almacenamiento en IPFS de los votos.
- `Voting-Dapp`:  La aplicación web que permitirá interactuar con todos los componentes.

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


## Licencia

Este proyecto está licenciado bajo la [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html).
