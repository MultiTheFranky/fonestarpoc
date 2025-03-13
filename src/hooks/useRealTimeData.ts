import { useEffect, useState } from 'react';
import WebSocketClient from '../services/websocketClient'; // Updated import (default export)
import { DataPoint, WebSocketMessage } from '../types';

const useRealTimeData = () => {
    const [data, setData] = useState<DataPoint[]>([]);

    useEffect(() => {
        // Use the singleton instance instead of creating a new one
        const handleData = (message: WebSocketMessage) => {
            const newData: DataPoint = {
                timestamp: message.data.timestamp,
                value: message.data.value,
            };
            setData(prevData => [...prevData, newData].slice(-100)); // Keep the last 100 data points
        };

        // Register listener with the singleton client
        WebSocketClient.addListener(handleData);

        // Connect is automatically called in the constructor, but we can ensure it's connected
        WebSocketClient.connect();

        // Clean up by removing the listener and closing if needed
        return () => {
            // Note: We don't have a removeListener method in the client yet
            // If this becomes an issue, consider adding that method
            WebSocketClient.close();
        };
    }, []);

    return { data };
};

export default useRealTimeData;
