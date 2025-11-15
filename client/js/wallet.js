export async function connectWallet(){
  if(!window.ethereum) throw new Error('MetaMask not available');
  const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
  return accounts[0].toLowerCase();
}

export async function getAddress(){
  if(!window.ethereum) throw new Error('MetaMask not available');
  const accounts = await window.ethereum.request({method:'eth_accounts'});
  if(!accounts || accounts.length===0) throw new Error('Not connected');
  return accounts[0].toLowerCase();
}

export function getAnonId(address){
  const s = (address||'').toLowerCase(); let hash = 0; for(let i=0;i<s.length;i++) hash = ((hash<<5)-hash)+s.charCodeAt(i)|0; const num = Math.abs(hash) % 10000; return `Anon #${String(num).padStart(4,'0')}`;
}
