import { useEffect, useState } from 'react';
import { WebSocketClient } from './websocketClient';
import { DataPoint } from '../types';

const dataService = (() => {
  let socket: WebSocketClient | null = null;

  const connect = (onDataReceived: (data: DataPoint) => void) => {
    socket = new WebSocketClient();

    socket.onMessage((message: string) => {
      const data: DataPoint = JSON.parse(message);
      onDataReceived(data);
    });

    socket.connect();
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };

  return {
    connect,
    disconnect,
  };
})();

export default dataService;