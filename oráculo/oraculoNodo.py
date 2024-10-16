import json
import os
from web3 import Web3
from ipfslib import *
from flask import Flask, jsonify
import os
from random import randint

# Conexión a la red de Ethereum usando Hardhat (o cualquier otro proveedor de nodo)
web3 = Web3(Web3.HTTPProvider('http://host.docker.internal:8545/'))
#web3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545/'))

# Dirección del contrato y su ABI
contract_address = Web3.to_checksum_address("0x5FbDB2315678afecb367f032d93F642f64180aa3")  # Reemplaza esto con la dirección del contrato desplegado
contract_abi = json.loads('[ 	{ 		"anonymous": false, 		"inputs": [ 			{ 				"indexed": true, 				"internalType": "address", 				"name": "_sender", 				"type": "address" 			}, 			{ 				"indexed": false, 				"internalType": "string", 				"name": "cipher", 				"type": "string" 			} 		], 		"name": "IPFS_Add_Event", 		"type": "event" 	}, 	{ 		"anonymous": false, 		"inputs": [ 			{ 				"indexed": true, 				"internalType": "address", 				"name": "_sender", 				"type": "address" 			} 		], 		"name": "IPFS_Cat_Event", 		"type": "event" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "string", 				"name": "_userAddress", 				"type": "string" 			} 		], 		"name": "getValuesIPFS", 		"outputs": [ 			{ 				"internalType": "string", 				"name": "", 				"type": "string" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "string", 				"name": "_userAddress", 				"type": "string" 			}, 			{ 				"internalType": "string", 				"name": "_cipher", 				"type": "string" 			} 		], 		"name": "setValuesIPFS", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "string", 				"name": "_cipher", 				"type": "string" 			} 		], 		"name": "trigger_IPFS_Add_Event", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "trigger_IPFS_Cat_Event", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	} ]')

print(contract_address)

# Crear una instancia del contrato
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

dict = {}

def handle_event_add_IPFS(event):
    sender = event['args']['_sender']
    cipher = event['args']['cipher']

    print(f"Evento IPFS Add detectado - Remitente: {sender}")

    data = {}
    data['sender'] = sender
    data['cipher'] = cipher
    
    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    api = Connect()
    cid = IPFS.add(api, 'data.json')

    print("CID: " + cid)

    dict[sender] = cid

    print("Sender: "+ sender)
    print(dict)

    

    # Ejecutar una consulta a IPFS para comprobar que el objeto se ha subido correctamente
    path = "/ipfs/" + cid
    text = IPFS.cat(api, path)

    print("Fichero: " + text)


def handle_event_cat_IPFS(event):
    sender = event['args']['_sender']

    print(f"Evento IPFS Cat detectado - Remitente: {sender}")


    api = Connect()

    # Ejecutar una consulta a IPFS para comprobar que el objeto se ha subido correctamente
    cid = dict[sender]
    print("CID: " + cid)

    path = "/ipfs/" + cid
    print("Path: " + path)

    object = IPFS.cat(api, path)
    print(object)
    
    # Se lleva a cabo la transacción 
    try:
        tx_hash = contract.functions.setValuesIPFS(sender, object).transact()
        print(f"Transacción enviada: {Web3.to_hex(tx_hash)}")
    except Exception as e:
        print(f"Error al enviar transacción: {e}")


def watch_events():
    # Filtrar eventos
    event_filter_IPFS_add = contract.events.IPFS_Add_Event.create_filter(fromBlock="latest")

    event_filter_IPFS_cat = contract.events.IPFS_Cat_Event.create_filter(fromBlock="latest")

    print("Monitorizando la red en busca de eventos")

    while True:
        for event in event_filter_IPFS_add.get_new_entries():
            handle_event_add_IPFS(event)
        for event in event_filter_IPFS_cat.get_new_entries():
            handle_event_cat_IPFS(event)


if __name__ == "__main__":
    print("Inicializando el oráculo...")
    watch_events()
