import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { contractAbi, contract2Abi, contractAddress2, contractAddress } from './Constant/constant';
import Login from './Components/Login';
import Finished from './Components/Finished';
import Connected from './Components/Connected';
import './App.css';


function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [marketStatus, setMarketStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  const [stocks, setStocks] = useState([]);
  const [number, setNumber] = useState('');
  const[buyShares,setBuyShares] = useState('');
  const[title,setTitle] = useState('Dünya kupasını kim kazanır?');
  const [selectedContract, setSelectedContract] = useState(1); // 1 for first contract, 2 for second contract

  const currentAbi = selectedContract === 1 ? contractAbi : contract2Abi;
  const currentAddress = selectedContract === 1 ? contractAddress : contractAddress2;

  useEffect(() => {
    getStocks();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  }, [selectedContract]);

  async function connectToContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return new ethers.Contract(currentAddress, currentAbi, signer);
  }


  async function buyStock() {
    if(number === '' || buyShares === ''){
      alert('Please enter both stock index and number of stocks');
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = await connectToContract();
    const tx = await contractInstance.buyShares(number, buyShares);
    await tx.wait();
  }


  async function getStocks() {
    const contractInstance = await connectToContract();
    const stocksList = await contractInstance.getAllSharesOfStocks();
    const formattedStocks = stocksList.map((stock, index) => {
      return {
        index: index,
        name: stock.name,
        stockCount: stock.shareCount.toNumber()
      }
    });
    setStocks(formattedStocks);
  }

  async function getCurrentStatus() {
    const contractInstance = await connectToContract();
    const status = await contractInstance.getMarketStatus();
    setMarketStatus(status);
  }

  async function getRemainingTime() {
    const contractInstance = await connectToContract();
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser")
    }
  }

  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  function selectContract(contractNumber) {
    setSelectedContract(contractNumber);
    if (contractNumber === 1) {
      setTitle("Dünya kupasını kim kazanır?");
    } else if (contractNumber === 2) {
      setTitle("2023'te Eurovision kim kazanır?");
    }
  }
  async function handleBuySharesChange(e){
    setBuyShares(e.target.value);
  }

  return (
    <div className="App">
      {marketStatus && isConnected && (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Tahmin Et</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="mr-auto">
              <Nav.Link onClick={() => selectContract(1)}>Market 1</Nav.Link>
              <Nav.Link onClick={() => selectContract(2)}>Market 2</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )}

      {marketStatus ? (
        isConnected ? (
          <Connected
            account={account}
            stocks={stocks}
            remainingTime={remainingTime}
            number={number}
            buyShares={buyShares}
            handleNumberChange={handleNumberChange}
            handleBuySharesChange={handleBuySharesChange}
            buySharesFunction={buyStock}
            title={title}
          />
        ) : (
          <Login connectWallet={connectToMetamask} />
        )
      ) : (
        <Finished />
      )}
    </div>
  );
}

export default App;
