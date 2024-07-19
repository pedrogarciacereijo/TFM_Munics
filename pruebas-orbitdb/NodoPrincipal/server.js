// server.js
import express from 'express';
import cors from 'cors';
import { createLibp2p } from 'libp2p';
import { createHelia } from 'helia';
import { createOrbitDB } from '@orbitdb/core';
import { LevelBlockstore } from 'blockstore-level';
import { Libp2pOptions } from './config/libp2p.js';

// Configuración de Express
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static('public'));

// Configuración de IPFS y OrbitDB
const blockstore = new LevelBlockstore('./ipfs/blocks');
const libp2p = await createLibp2p(Libp2pOptions);
const ipfs = await createHelia({ libp2p, blockstore });
const orbitdb = await createOrbitDB({ ipfs });

// Crear la base de datos con permisos específicos
const db = await orbitdb.open('my-db', {
    type: 'keyvalue',
    accessController: {
        write: ['*'] // Permitir escritura a cualquier nodo (solo para desarrollo)
    }
});

console.log('my-db address', db.address);


// Obtener el MainNodeId y mostrar por consola
const peerId = libp2p.peerId.toString();
const mainNodeAddresses = libp2p.getMultiaddrs().map(addr => `${addr.toString()}/p2p/${peerId}`);
console.log('MainNodeId:', peerId);
console.log('Nodo principal multiaddrs:', mainNodeAddresses.join('\n'));


// Endpoint para obtener todos los registros
app.get('/records', async (req, res) => {
    const records = await db.all();
    res.json(records);
});

// Endpoint para añadir un nuevo registro
app.post('/records', async (req, res) => {
    const { key, value } = req.body;
    const hash = await db.put(key, value);

    // Mostrar por consola el nuevo registro añadido
    console.log(`Nuevo registro añadido: { key: "${key}", value: "${value}", hash: "${hash}" }`);

    res.json({ key, value, hash });
});


// Endpoint para filtrar registros por valor
app.get('/records/search', async (req, res) => {
    const searchValue = req.query.value;
    const records = await db.all();

    const filteredRecords = records.filter(record => record.value === searchValue);
    res.json(filteredRecords);
 
    // Mostrar por consola la búsqueda
    console.log(`Buscando registros con valor: {"${searchValue}"}`);

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
