import { useState, useEffect } from 'react';
import {ethers} from 'ethers';
import {contractAbi,contract2Abi,contractAddress2, contractAddress} from './Constant/constant';
import Login from './Components/Login';
import Finished from './Components/Finished';
import Connected from './Components/Connected';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [CanVote, setCanVote] = useState(true);
  const [selectedContract, setSelectedContract] = useState(1); // 1 for first contract, 2 for second contract

  const currentAbi = selectedContract === 1 ? contractAbi : contract2Abi;
  const currentAddress = selectedContract === 1 ? contractAddress : contractAddress2;

  useEffect(() => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    canVote();
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

  async function vote() {
    const contractInstance = await connectToContract();
    const tx = await contractInstance.vote(number);
    await tx.wait();
    canVote();
  }

  async function canVote() {
    const contractInstance = await connectToContract();
    const voteStatus = await contractInstance.voters(await contractInstance.signer.getAddress());
    setCanVote(voteStatus);
  }

  async function getCandidates() {
    const contractInstance = await connectToContract();
    const candidatesList = await contractInstance.getAllVotesOfCandiates();
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber()
      }
    });
    setCandidates(formattedCandidates);
  }

  async function getCurrentStatus() {
    const contractInstance = await connectToContract();
    const status = await contractInstance.getVotingStatus();
    setVotingStatus(status);
  }

  async function getRemainingTime() {
    const contractInstance = await connectToContract();
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
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
        canVote();
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
  }

  return (
    <div className="App">
      <button onClick={() => selectContract(1)}>First Voting</button>
      <button onClick={() => selectContract(2)}>Second Voting</button>

      { votingStatus ? (isConnected ? (<Connected 
                      account = {account}
                      candidates = {candidates}
                      remainingTime = {remainingTime}
                      number= {number}
                      handleNumberChange = {handleNumberChange}
                      voteFunction = {vote}
                      showButton = {CanVote}/>) 
                      
                      : 
                      
                      (<Login connectWallet = {connectToMetamask}/>)) : (<Finished />)}
      
    </div>
  );
}

export default App;
