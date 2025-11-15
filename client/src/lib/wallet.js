export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed. Please install MetaMask to use this app.");
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }

    const address = accounts[0].toLowerCase();
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    return {
      address,
      chainId: parseInt(chainId, 16),
    };
  } catch (error) {
    if (error.code === 4001) {
      throw new Error("User rejected wallet connection");
    }
    throw error;
  }
}

export async function signMessage(address, message) {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  try {
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [message, address],
    });
    return signature;
  } catch (error) {
    if (error.code === 4001) {
      throw new Error("User rejected signature request");
    }
    throw error;
  }
}

export function shortenAddress(address, chars = 4) {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function generateIdenticon(address) {
  const canvas = document.createElement("canvas");
  const size = 64;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  
  if (!ctx) return "";

  const hash = address.slice(2, 18);
  const hue = parseInt(hash.slice(0, 6), 16) % 360;
  
  ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
  ctx.fillRect(0, 0, size, size);
  
  ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
  const gridSize = 5;
  const cellSize = size / gridSize;
  
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const index = i * gridSize + j;
      const shouldFill = parseInt(hash[index % hash.length], 16) % 2 === 0;
      
      if (shouldFill) {
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  }
  
  return canvas.toDataURL();
}

export function getInitials(address) {
  if (!address) return "??";
  return address.slice(2, 4).toUpperCase();
}
