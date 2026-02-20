'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { RotateCcw, Wallet } from 'lucide-react';

const CustomWalletButton = () => {
  const { connected, publicKey, connect, disconnect } = useWallet();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <button
      onClick={handleClick}
      className="bg-[#c9933a] hover:bg-[#b08132] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
    >
      {connected ? (
        <>
          <RotateCcw className="w-4 h-4" />
          <span>{formatAddress(publicKey?.toString() || '')}</span>
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
};

export default CustomWalletButton;













