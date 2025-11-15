async function getCurrentBlock() {
  if (!window.ethereum) {
    throw new Error('MetaMask not available');
  }
  
  try {
    const blockNumber = await window.ethereum.request({
      method: 'eth_blockNumber',
    });
    return parseInt(blockNumber, 16);
  } catch (error) {
    console.error('Error fetching current block:', error);
    throw error;
  }
}

async function getTxHistory(address) {
  const url = `https://api.routescan.io/v2/network/mainnet/evm/137/address/${address}/transactions?page_size=500`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`);
    }
    
    const data = await res.json();
    const items = data.items || [];
    return items.reverse();
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}

function computeWalletAge(txs, currentBlock) {
  if (txs.length === 0) return 0;
  const firstTx = txs[0];
  return currentBlock - firstTx.block_number;
}

function getBadge(walletAge, txCount) {
  if (walletAge >= 200000 || txCount >= 100) return "OG";
  if (walletAge >= 50000 || txCount >= 10) return "Trusted";
  return "New";
}

export async function analyzeWallet(address) {
  try {
    const currentBlock = await getCurrentBlock();
    const txs = await getTxHistory(address);
    
    const walletAge = computeWalletAge(txs, currentBlock);
    const txCount = txs.length;
    const badge = getBadge(walletAge, txCount);
    
    return { address, walletAge, txCount, badge };
  } catch (error) {
    console.error('Error analyzing wallet:', error);
    return { address, walletAge: 0, txCount: 0, badge: "New" };
  }
}
