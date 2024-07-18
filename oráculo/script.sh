#!/bin/sh

# Inicializar el nodo
ipfs init

# Borrar el bootstrap por defecto
ipfs bootstrap rm --all

# Generar swarm.key
git clone https://github.com/Kubuxu/go-ipfs-swarm-key-gen
cd go-ipfs-swarm-key-gen/
cd ipfs-swarm-key-gen/
go run main.go > /root/.ipfs/swarm.key

cd /app/
python3 oraculoNodo.py & ipfs daemon