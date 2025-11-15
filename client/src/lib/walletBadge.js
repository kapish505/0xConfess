async function getCurrentBlockHeight() {
  const rpcEndpoints = [
    'https://polygon-bor-rpc.publicnode.com',
    'https://polygon-rpc.com',
    'https://rpc.ankr.com/polygon'
  ];
  
  for (const rpc of rpcEndpoints) {
    try {
      const response = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 1
        })
      });
      const data = await response.json();
      if (data.result) {
        return parseInt(data.result, 16);
      }
    } catch (error) {
      console.warn(`RPC ${rpc} failed, trying next...`);
    }
  }
  throw new Error('All RPC endpoints failed');
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
    throw error;
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

const badgeCache = new Map();

export async function analyzeWallet(address) {
  if (badgeCache.has(address.toLowerCase())) {
    return badgeCache.get(address.toLowerCase());
  }

  try {
    const [currentBlock, txs] = await Promise.all([
      getCurrentBlockHeight(),
      getTxHistory(address)
    ]);
    
    if (!currentBlock || currentBlock === 0) {
      throw new Error('Unable to determine current block height');
    }

    const walletAge = computeWalletAge(txs, currentBlock);
    const txCount = txs.length;
    const badge = getBadge(walletAge, txCount);
    
    const result = { address, walletAge, txCount, badge, error: null };
    badgeCache.set(address.toLowerCase(), result);
    return result;
  } catch (error) {
    console.error('Error analyzing wallet:', error);
    return { address, walletAge: 0, txCount: 0, badge: "New", error: error.message };
  }
}
