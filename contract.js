// Global fileList to store file data
let fileList = []; 

// Web3 setup
let web3;
if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    alert('MetaMask is not installed.');
}

// Contract ABI and address
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_hash",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_owner",
                "type": "string"
            }
        ],
        "name": "addDocument",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_hash",
                "type": "string"
            }
        ],
        "name": "getDocument",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = "0xC4CEA0001f792CC2e4804A5Bacb37f288B8d5bcc"; // replace with your contract address

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Hash generation
async function sha256(buffer) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Handle file verification and hash generation
function verifyFile() {
    const fileInput = document.getElementById('fileInput').files[0];
    const result = document.getElementById('result');

    if (!fileInput) {
        alert("Vui lòng chọn một tệp để xác minh!");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
        const fileContent = event.target.result;
        const newHash = await sha256(fileContent);
        const fileName = fileInput.name;

        // Check if the file has already been uploaded
        let status = "File mới được thêm vào!";
        let existingFile = fileList.find(file => file.name === fileName);

        if (existingFile) {
            if (existingFile.hash === newHash) {
                status = "File chưa bị thay đổi!";
            } else {
                status = "File đã bị thay đổi!";
            }
        }

        // Update or add file to the list
        const fileData = {
            name: fileName,
            hash: newHash,
            status: status
        };

        if (existingFile) {
            existingFile.hash = newHash;
            existingFile.status = status;
        } else {
            fileList.push(fileData);
        }

        result.value = newHash;
        updateTable();
    };

    reader.readAsArrayBuffer(fileInput);
}

// Update table displaying the files
function updateTable() {
    const tableBody = document.getElementById('fileTableBody');
    tableBody.innerHTML = ''; // Clear existing rows

    fileList.forEach((file, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${file.name}</td>
            <td>${file.hash}</td>
            <td>${file.status}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Save hash to MetaMask and blockchain
async function saveToWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed.');
        return;
    }

    try {
        // Request wallet connection
        await ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const walletAddress = accounts[0];

        // Retrieve the hash from the result field
        const hashToSave = document.getElementById('result').value;

        if (!hashToSave) {
            alert('Không có mã hash hợp lệ để lưu!');
            return;
        }

        // Save the document hash using the smart contract
        await contract.methods.addDocument(hashToSave, walletAddress).send({ from: walletAddress });

        alert('Mã hash đã được lưu vào blockchain!');
    } catch (error) {
        console.error(error);
        alert('Đã xảy ra lỗi khi lưu mã hash vào MetaMask.');
    }
}

// Clear the file hash list
function clearHash() {
    fileList = [];
    updateTable();
    document.getElementById('result').value = 'Danh sách đã bị xóa!';
}
