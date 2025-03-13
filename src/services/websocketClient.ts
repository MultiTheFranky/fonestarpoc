import { DataPoint, WebSocketMessage } from '../types';

class WebSocketClient {
    private listeners: Array<(data: WebSocketMessage) => void> = [];
    private dataInterval: NodeJS.Timeout | null = null;
    private connected: boolean = false;

    constructor() {
        this.connect();
    }

    public connect() {
        if (this.connected) {return;}

        this.connected = true;
        console.log('Mock WebSocket connection established');

        // Start generating random data every 100ms
        this.dataInterval = setInterval(() => {
            const randomData = this.generateRandomData();
            this.notifyListeners(randomData);
        }, 100);
    }

    private generateRandomData(): WebSocketMessage {
        const types = ['temperature', 'humidity', 'pressure', 'speed', 'voltage'];
        const type = types[Math.floor(Math.random() * types.length)];

        const dataPoint: DataPoint = {
            timestamp: Date.now(), // Current time in milliseconds
            value: Math.random() * 100, // Random value between 0-100
        };

        return {
            type,
            data: dataPoint,
        };
    }

    public addListener(listener: (data: WebSocketMessage) => void) {
        this.listeners.push(listener);
    }

    public removeListener(listener: (data: WebSocketMessage) => void) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    private notifyListeners(data: WebSocketMessage) {
        console.log('Generated random data:', data);
        this.listeners.forEach(listener => listener(data));
    }

    public close() {
        if (this.dataInterval) {
            clearInterval(this.dataInterval);
            this.dataInterval = null;
        }
        this.connected = false;
        console.log('Mock WebSocket connection closed');
    }
}

export default new WebSocketClient();
