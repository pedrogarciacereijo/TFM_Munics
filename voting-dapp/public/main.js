let web3;
let contractInstance;

const contractABI  = [ 	{ 		"inputs": [], 		"name": "closeVoting", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "string", 				"name": "_title", 				"type": "string" 			}, 			{ 				"internalType": "string", 				"name": "_option1", 				"type": "string" 			}, 			{ 				"internalType": "string", 				"name": "_option2", 				"type": "string" 			} 		], 		"stateMutability": "nonpayable", 		"type": "constructor" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "string", 				"name": "option", 				"type": "string" 			} 		], 		"name": "vote", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"anonymous": false, 		"inputs": [ 			{ 				"indexed": true, 				"internalType": "address", 				"name": "voter", 				"type": "address" 			}, 			{ 				"indexed": false, 				"internalType": "string", 				"name": "option", 				"type": "string" 			} 		], 		"name": "Voted", 		"type": "event" 	}, 	{ 		"anonymous": false, 		"inputs": [], 		"name": "VotingClosed", 		"type": "event" 	}, 	{ 		"inputs": [], 		"name": "getVotes", 		"outputs": [ 			{ 				"internalType": "uint256", 				"name": "", 				"type": "uint256" 			}, 			{ 				"internalType": "uint256", 				"name": "", 				"type": "uint256" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "address", 				"name": "", 				"type": "address" 			} 		], 		"name": "hasVoted", 		"outputs": [ 			{ 				"internalType": "bool", 				"name": "", 				"type": "bool" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "option1", 		"outputs": [ 			{ 				"internalType": "string", 				"name": "", 				"type": "string" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "option2", 		"outputs": [ 			{ 				"internalType": "string", 				"name": "", 				"type": "string" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "owner", 		"outputs": [ 			{ 				"internalType": "address", 				"name": "", 				"type": "address" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "title", 		"outputs": [ 			{ 				"internalType": "string", 				"name": "", 				"type": "string" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "votesOption1", 		"outputs": [ 			{ 				"internalType": "uint256", 				"name": "", 				"type": "uint256" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "votesOption2", 		"outputs": [ 			{ 				"internalType": "uint256", 				"name": "", 				"type": "uint256" 			} 		], 		"stateMutability": "view", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "votingClosed", 		"outputs": [ 			{ 				"internalType": "bool", 				"name": "", 				"type": "bool" 			} 		], 		"stateMutability": "view", 		"type": "function" 	} ]; 

const oracleABI = [ 	{ 		"anonymous": false, 		"inputs": [ 			{ 				"indexed": true, 				"internalType": "address", 				"name": "_sender", 				"type": "address" 			}, 			{ 				"indexed": false, 				"internalType": "string", 				"name": "cipher", 				"type": "string" 			} 		], 		"name": "IPFS_Add_Event", 		"type": "event" 	}, 	{ 		"anonymous": false, 		"inputs": [ 			{ 				"indexed": true, 				"internalType": "address", 				"name": "_sender", 				"type": "address" 			} 		], 		"name": "IPFS_Cat_Event", 		"type": "event" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "string", 				"name": "_userAddress", 				"type": "string" 			}, 			{ 				"internalType": "string", 				"name": "_cipher", 				"type": "string" 			} 		], 		"name": "setValuesIPFS", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "string", 				"name": "_cipher", 				"type": "string" 			} 		], 		"name": "trigger_IPFS_Add_Event", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [], 		"name": "trigger_IPFS_Cat_Event", 		"outputs": [], 		"stateMutability": "nonpayable", 		"type": "function" 	}, 	{ 		"inputs": [ 			{ 				"internalType": "string", 				"name": "_userAddress", 				"type": "string" 			} 		], 		"name": "getValuesIPFS", 		"outputs": [ 			{ 				"internalType": "string", 				"name": "", 				"type": "string" 			} 		], 		"stateMutability": "view", 		"type": "function" 	} ];
const oracleAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


// Funciones relativas a Metamask y los smart contracts
async function loadWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    } else {
        alert('You need to install MetaMask!');
    }
}

async function deployContract() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    const title = document.getElementById('titleInput').value;
    const option1 = document.getElementById('option1Input').value;
    const option2 = document.getElementById('option2Input').value;

    if (!title || !option1 || !option2) {
        document.getElementById('deployResult').innerText = 'Please enter a title and both options';
        return;
    }

    const VotingContract = new web3.eth.Contract(contractABI);

    try {
        const newContractInstance = await VotingContract.deploy({
            data: '0x608060405234801562000010575f80fd5b506040516200150938038062001509833981810160405281019062000036919062000239565b335f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550826001908162000086919062000526565b50816002908162000098919062000526565b508060039081620000aa919062000526565b505050506200060a565b5f604051905090565b5f80fd5b5f80fd5b5f80fd5b5f80fd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6200011582620000cd565b810181811067ffffffffffffffff82111715620001375762000136620000dd565b5b80604052505050565b5f6200014b620000b4565b90506200015982826200010a565b919050565b5f67ffffffffffffffff8211156200017b576200017a620000dd565b5b6200018682620000cd565b9050602081019050919050565b5f5b83811015620001b257808201518184015260208101905062000195565b5f8484015250505050565b5f620001d3620001cd846200015e565b62000140565b905082815260208101848484011115620001f257620001f1620000c9565b5b620001ff84828562000193565b509392505050565b5f82601f8301126200021e576200021d620000c5565b5b815162000230848260208601620001bd565b91505092915050565b5f805f60608486031215620002535762000252620000bd565b5b5f84015167ffffffffffffffff811115620002735762000272620000c1565b5b620002818682870162000207565b935050602084015167ffffffffffffffff811115620002a557620002a4620000c1565b5b620002b38682870162000207565b925050604084015167ffffffffffffffff811115620002d757620002d6620000c1565b5b620002e58682870162000207565b9150509250925092565b5f81519050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806200033e57607f821691505b602082108103620003545762000353620002f9565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302620003b87fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826200037b565b620003c486836200037b565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f6200040e620004086200040284620003dc565b620003e5565b620003dc565b9050919050565b5f819050919050565b6200042983620003ee565b62000441620004388262000415565b84845462000387565b825550505050565b5f90565b6200045762000449565b620004648184846200041e565b505050565b5b818110156200048b576200047f5f826200044d565b6001810190506200046a565b5050565b601f821115620004da57620004a4816200035a565b620004af846200036c565b81016020851015620004bf578190505b620004d7620004ce856200036c565b83018262000469565b50505b505050565b5f82821c905092915050565b5f620004fc5f1984600802620004df565b1980831691505092915050565b5f620005168383620004eb565b9150826002028217905092915050565b6200053182620002ef565b67ffffffffffffffff8111156200054d576200054c620000dd565b5b62000559825462000326565b620005668282856200048f565b5f60209050601f8311600181146200059c575f841562000587578287015190505b62000593858262000509565b86555062000602565b601f198416620005ac866200035a565b5f5b82811015620005d557848901518255600182019150602085019450602081019050620005ae565b86831015620005f55784890151620005f1601f891682620004eb565b8355505b6001600288020188555050505b505050505050565b610ef180620006185f395ff3fe608060405234801561000f575f80fd5b50600436106100a7575f3560e01c80634f13ad551161006f5780634f13ad55146101545780638da5cb5b1461017257806392d2e43814610190578063ad69ab95146101ae578063c631b292146101cc578063fc36e15b146101d6576100a7565b806309eef43e146100ab5780630dc96015146100db5780632479ecb8146100fa5780632b0b2225146101185780634a79d50c14610136575b5f80fd5b6100c560048036038101906100c09190610831565b6101f2565b6040516100d29190610876565b60405180910390f35b6100e361020f565b6040516100f19291906108a7565b60405180910390f35b61010261021f565b60405161010f9190610876565b60405180910390f35b610120610231565b60405161012d91906108ce565b60405180910390f35b61013e610237565b60405161014b9190610971565b60405180910390f35b61015c6102c3565b60405161016991906108ce565b60405180910390f35b61017a6102c9565b60405161018791906109a0565b60405180910390f35b6101986102ec565b6040516101a59190610971565b60405180910390f35b6101b6610378565b6040516101c39190610971565b60405180910390f35b6101d4610404565b005b6101f060048036038101906101eb9190610ae5565b6104d9565b005b6006602052805f5260405f205f915054906101000a900460ff1681565b5f80600454600554915091509091565b60075f9054906101000a900460ff1681565b60045481565b6001805461024490610b59565b80601f016020809104026020016040519081016040528092919081815260200182805461027090610b59565b80156102bb5780601f10610292576101008083540402835291602001916102bb565b820191905f5260205f20905b81548152906001019060200180831161029e57829003601f168201915b505050505081565b60055481565b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600280546102f990610b59565b80601f016020809104026020016040519081016040528092919081815260200182805461032590610b59565b80156103705780601f1061034757610100808354040283529160200191610370565b820191905f5260205f20905b81548152906001019060200180831161035357829003601f168201915b505050505081565b6003805461038590610b59565b80601f01602080910402602001604051908101604052809291908181526020018280546103b190610b59565b80156103fc5780601f106103d3576101008083540402835291602001916103fc565b820191905f5260205f20905b8154815290600101906020018083116103df57829003601f168201915b505050505081565b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610491576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161048890610bf9565b60405180910390fd5b600160075f6101000a81548160ff0219169083151502179055507f66b6cb4a09abc3bf1cacc3c67420258856ffdad0deba9078cbd1658957b5021860405160405180910390a1565b60065f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff1615610563576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161055a90610c61565b60405180910390fd5b60075f9054906101000a900460ff16156105b2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105a990610cc9565b60405180910390fd5b60026040516020016105c49190610d83565b60405160208183030381529060405280519060200120816040516020016105eb9190610dc9565b6040516020818303038152906040528051906020012014806106595750600360405160200161061a9190610d83565b60405160208183030381529060405280519060200120816040516020016106419190610dc9565b60405160208183030381529060405280519060200120145b610698576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161068f90610e29565b60405180910390fd5b600160065f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690831515021790555060026040516020016106ff9190610d83565b60405160208183030381529060405280519060200120816040516020016107269190610dc9565b604051602081830303815290604052805190602001200361075d5760045f81548092919061075390610e74565b9190505550610775565b60055f81548092919061076f90610e74565b91905055505b3373ffffffffffffffffffffffffffffffffffffffff167fcb6783276e8a4347387036bbfea000268f0a4b1f8c46ac79980609f2af8d2acd826040516107bb9190610971565b60405180910390a250565b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610800826107d7565b9050919050565b610810816107f6565b811461081a575f80fd5b50565b5f8135905061082b81610807565b92915050565b5f60208284031215610846576108456107cf565b5b5f6108538482850161081d565b91505092915050565b5f8115159050919050565b6108708161085c565b82525050565b5f6020820190506108895f830184610867565b92915050565b5f819050919050565b6108a18161088f565b82525050565b5f6040820190506108ba5f830185610898565b6108c76020830184610898565b9392505050565b5f6020820190506108e15f830184610898565b92915050565b5f81519050919050565b5f82825260208201905092915050565b5f5b8381101561091e578082015181840152602081019050610903565b5f8484015250505050565b5f601f19601f8301169050919050565b5f610943826108e7565b61094d81856108f1565b935061095d818560208601610901565b61096681610929565b840191505092915050565b5f6020820190508181035f8301526109898184610939565b905092915050565b61099a816107f6565b82525050565b5f6020820190506109b35f830184610991565b92915050565b5f80fd5b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6109f782610929565b810181811067ffffffffffffffff82111715610a1657610a156109c1565b5b80604052505050565b5f610a286107c6565b9050610a3482826109ee565b919050565b5f67ffffffffffffffff821115610a5357610a526109c1565b5b610a5c82610929565b9050602081019050919050565b828183375f83830152505050565b5f610a89610a8484610a39565b610a1f565b905082815260208101848484011115610aa557610aa46109bd565b5b610ab0848285610a69565b509392505050565b5f82601f830112610acc57610acb6109b9565b5b8135610adc848260208601610a77565b91505092915050565b5f60208284031215610afa57610af96107cf565b5b5f82013567ffffffffffffffff811115610b1757610b166107d3565b5b610b2384828501610ab8565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f6002820490506001821680610b7057607f821691505b602082108103610b8357610b82610b2c565b5b50919050565b7f4f6e6c7920746865206f776e65722063616e20657865637574652074686973205f8201527f66756e6374696f6e000000000000000000000000000000000000000000000000602082015250565b5f610be36028836108f1565b9150610bee82610b89565b604082019050919050565b5f6020820190508181035f830152610c1081610bd7565b9050919050565b7f596f75206861766520616c726561647920766f746564000000000000000000005f82015250565b5f610c4b6016836108f1565b9150610c5682610c17565b602082019050919050565b5f6020820190508181035f830152610c7881610c3f565b9050919050565b7f566f74696e6720697320636c6f736564000000000000000000000000000000005f82015250565b5f610cb36010836108f1565b9150610cbe82610c7f565b602082019050919050565b5f6020820190508181035f830152610ce081610ca7565b9050919050565b5f81905092915050565b5f819050815f5260205f209050919050565b5f8154610d0f81610b59565b610d198186610ce7565b9450600182165f8114610d335760018114610d4857610d7a565b60ff1983168652811515820286019350610d7a565b610d5185610cf1565b5f5b83811015610d7257815481890152600182019150602081019050610d53565b838801955050505b50505092915050565b5f610d8e8284610d03565b915081905092915050565b5f610da3826108e7565b610dad8185610ce7565b9350610dbd818560208601610901565b80840191505092915050565b5f610dd48284610d99565b915081905092915050565b7f496e76616c6964206f7074696f6e0000000000000000000000000000000000005f82015250565b5f610e13600e836108f1565b9150610e1e82610ddf565b602082019050919050565b5f6020820190508181035f830152610e4081610e07565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610e7e8261088f565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610eb057610eaf610e47565b5b60018201905091905056fea2646970667358221220b237b095deef5cab75f3cc850951e248d53c00a19f9612983c2a8dbf7ba124b464736f6c63430008160033', 
            arguments: [title, option1, option2]
        }).send({
            from: account,
            gas: 1500000,
            gasPrice: '30000000000'
        });

        console.log('Contract deployed at address:', newContractInstance.options.address);
        document.getElementById('deployResult').innerText = `Contract deployed at address: ${newContractInstance.options.address}`;

        // Store deployed contract address
        addRecord(newContractInstance.options.address, title);

        // Actualiza la lista de contratos activos
        updateDeployedContractsDropdown();
    } catch (error) {
        console.error('Error deploying contract:', error);
        document.getElementById('deployResult').innerText = `Error deploying contract: ${error.message}`;
    }
}

async function selectContract() {
    const selectedAddress = document.getElementById('deployedContracts').value;
    if (selectedAddress) {
        contractInstance = new web3.eth.Contract(contractABI, selectedAddress);

        document.getElementById('contractOptions').style.display = 'block';
        document.getElementById('viewResults').style.display = 'block';

        const accounts = await web3.eth.getAccounts();
        const userAddress = accounts[0];

        const votingClosed = await contractInstance.methods.votingClosed().call();

        if (votingClosed) {
            document.getElementById('contractActions').style.display = 'none';
            document.getElementById('deployResult').innerText = 'Voting Contract Closed';
        } else {
            document.getElementById('deployResult').innerText = 'Voting Contract Open';
            if (userAddress.toLowerCase() !== '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199') {
                document.getElementById('contractActions').style.display = 'block';
                document.getElementById('closeContract').style.display = 'none';
            } else {
                document.getElementById('contractActions').style.display = 'none';
                document.getElementById('closeContract').style.display = 'block';
            }
        }

        await displayContractOptions();
    } else {
        document.getElementById('contractOptions').style.display = 'none';
        document.getElementById('contractActions').style.display = 'none';
    }
}

async function displayContractOptions() {
    const title = await contractInstance.methods.title().call();
    const option1 = await contractInstance.methods.option1().call();
    const option2 = await contractInstance.methods.option2().call();

    document.getElementById('contractTitle').value = title;
    document.getElementById('contractOption1').value = option1;
    document.getElementById('contractOption2').value = option2;
}

async function voteForOption(option) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    console.log("Votando en la votación: ", document.getElementById('contractTitle').value);
    if (option == 1){
        option = document.getElementById('contractOption1').value
    } else if (option == 2){
        option = document.getElementById('contractOption2').value
    }

    console.log("Valor: ", option);

    try {
        await contractInstance.methods.vote(
            option
        ).send({ 
            from: account,
            gas: 1500000,
            gasPrice: '30000000000'
        });
        console.log('Vote submitted for option', option);
        alert('Vote submitted successfully!');
        
        try {
            await uploadStringToIPFS(option);
        } catch (uploadError) {
            console.error('Error en uploadStringToIPFS:', uploadError);
        }

    } catch (error) {
        console.error('Error voting:', error);
        alert('Error voting: ' + error.message);
    }
}

async function closeContract() {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    console.log("Cerrando la votación: ", document.getElementById('contractTitle').value);

    try {
        await contractInstance.methods.closeVoting().send({
            from: account,
            gas: 1500000,
            gasPrice: '30000000000'
        });
        console.log('Voting closed successfully');
        alert('Voting closed successfully!');
    } catch (error) {
        console.error('Error closing voting:', error);
        alert('Error closing voting: ' + error.message);
    }
}

async function viewResults() {
    try {
        const result = await contractInstance.methods.getVotes().call();
        console.log('Votes for Option 1:', result[0]);
        console.log('Votes for Option 2:', result[1]);
        alert(`Votes for Option 1: ${result[0]}\nVotes for Option 2: ${result[1]}`);
    } catch (error) {
        console.error('Error fetching results:', error);
        alert('Error fetching results: ' + error.message);
    }
}

async function updateDeployedContractsDropdown() {
    const select = document.getElementById('deployedContracts');
    select.innerHTML = '<option value="">Select a contract</option>';

    // Llamada a fetchRecords y obtener los registros de OrbitDB
    const records = await fetchRecords();

    // Rellenar el dropdown con los valores de key y value de los registros
    records.forEach(record => {
        const option = document.createElement('option');
        option.value = record.key;
        option.text = `${record.key}: ${record.value}`;
        select.appendChild(option);
    });
}

// Funciones relativas a los datos almacenados en OrbitDB
async function fetchRecords() {
    const response = await fetch('http://localhost:3001/records');
    const records = await response.json();
    const keyValuePairs = [];

    for (const [key, record] of Object.entries(records)) {
        keyValuePairs.push({ key: record.key, value: record.value });
    }

    return keyValuePairs;
}

async function addRecord(key, value) {
    console.log(key);
    console.log(value);
    await fetch('http://localhost:3001/records', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key, value })
    });
}


async function checkUserAddressOnLoad() {
    await loadWeb3();

    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    if (userAddress.toLowerCase() !== '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199') {
        document.getElementById('deploy').style.display = 'none';
    } else {
        document.getElementById('deploy').style.display = 'block';
    }
}

function generateSecurePassword(length) {
    // Se definen los carácteres que pueden ser utilizados en la contraseña
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?&@*%$';
    const charsetLength = charset.length;

    // Se crea un array para almacenar valores aleatorios
    const randomValues = new Uint32Array(length);

    // Se llena el array con valores aleatorios criptográficamente seguros
    window.crypto.getRandomValues(randomValues);

    // Se convierten los valores aleatorios a carácteres utilizables 
    const passwordArray = [];
    for (let i = 0; i < length; i++) {
        const randomIndex = randomValues[i] % charsetLength;
        passwordArray.push(charset[randomIndex]);
    }

    // Se unen los caracteres en una cadena y se devuelven como contraseña
    return passwordArray.join('');
}

async function uploadStringToIPFS(inputString) {
    
    // Generar una contraseña segura de 16 caracteres
    const password = generateSecurePassword(16);

    if (typeof password !== 'undefined' && password !== null && password !== '') {
        if (typeof inputString === 'string' && inputString !== '') {
            
            // Asignar valor a la variable clave
            const clave = password;
            console.log("Subiendo voto a IPFS con la contraseña: " + clave);

            // Cifrar el mensaje con la contraseña
            const mensajeCifrado = CryptoJS.AES.encrypt(inputString, clave).toString();

            // Crear una instancia del contrato oráculo
            const oracleContract = new web3.eth.Contract(oracleABI, oracleAddress);

            // Llamar al contrato oráculo para desencadenar el evento
            oracleContract.trigger_IPFS_Add_Event(mensajeCifrado).then(async (cipher) => {
                // Mostrar la contraseña generada al usuario
                alert("Recibo del voto subido a IPFS con la contraseña: " + password);
            }).catch(error => {
                console.error("Error al desencadenar el evento IPFS_Add: ", error);
            });
        } else {
            console.error("El string de entrada está vacío o no es válido.");
        }
    } else {
        console.error("El campo password está vacío o no definido.");
    }
}

window.addEventListener('load', checkUserAddressOnLoad);

// Fetch records on page load
fetchRecords();

loadWeb3();
updateDeployedContractsDropdown(); // Populate the dropdown on load
