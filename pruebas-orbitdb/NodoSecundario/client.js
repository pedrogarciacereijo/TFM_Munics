// client.js
import express from 'express';
import cors from 'cors';
import { createLibp2p } from 'libp2p';
import { createHelia } from 'helia';
import { createOrbitDB } from '@orbitdb/core';
import { LevelBlockstore } from 'blockstore-level';
import { multiaddr } from '@multiformats/multiaddr';
import { Libp2pOptions } from './config/libp2p.js';

// Configuración de Express
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static('public'));

// Configuración de IPFS y OrbitDB
const blockstore = new LevelBlockstore('./ipfs/client_blocks');
const libp2p = await createLibp2p(Libp2pOptions);
const ipfs = await createHelia({ libp2p, blockstore });
const orbitdb = await createOrbitDB({ ipfs });

// Conexión al nodo principal
const mainNodeMultiaddr = multiaddr('/ip4/172.23.224.1/tcp/55434/p2p/12D3KooWMJ3WhfHVqy5jQKWRxCxKWySqsmcTjcyMEkdpPMedRiEW/p2p/12D3KooWMJ3WhfHVqy5jQKWRxCxKWySqsmcTjcyMEkdpPMedRiEW');
await libp2p.dial(mainNodeMultiaddr);

console.log(`Conectado al nodo principal en: ${mainNodeMultiaddr.toString()}`);

// Abrir la base de datos
const dbAddress = '/orbitdb/zdpuAuxN6Druj6zXu9ANa9gcdeEVYQKwX6tfkUmgY7wSAE1wM';  // Reemplaza con la dirección de tu base de datos OrbitDB
const db = await orbitdb.open(dbAddress, { type: 'keyvalue' });

console.log('Direccion de la base de datos: ', db.address.toString());


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