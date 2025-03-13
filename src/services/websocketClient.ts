import { DataPoint, WebSocketMessage } from '../types';

class WebSocketClient {
    private listeners: Array<(data: WebSocketMessage) => void> = [];
    private dataInterval: NodeJS.Timeout | null = null;
    private connected: boolean = false;
    private lastValue: number = 15; // Start with a moderate baseline value
    private trend: number = 0; // Direction of value movement
    private baseVolume: number = 15; // Ambient noise level

    constructor() {
        this.connect();
    }

    public connect() {
        if (this.connected) {return;}

        this.connected = true;
        console.log('Mock WebSocket connection established');

        // Start generating audio-like data
        this.dataInterval = setInterval(() => {
            const audioData = this.generateAudioLikeData();
            this.notifyListeners(audioData);
        }, 100);
    }

    private generateAudioLikeData(): WebSocketMessage {
        // Simulate microphone input levels with these characteristics:
        // 1. Values have inertia (don't jump randomly)
        // 2. Occasional spikes for "speech" or "sound events"
        // 3. Return to a baseline during "silence"
        // 4. Natural-looking patterns with small variations

        // Determine if this should be a "speech" moment (occasional spike)
        const isSpeaking = Math.random() < 0.1; // 10% chance of speech event
        const isEnding = Math.random() < 0.15; // 15% chance of ending speech

        // Calculate the next value with smoothing
        if (isSpeaking && this.lastValue < 60) {
            // Start of speech/sound - quick rise
            this.lastValue += Math.random() * 20 + 5;
            this.trend = 1;
        } else if (isEnding || this.lastValue > 80) {
            // End of speech or high value - start decreasing
            this.trend = -1;
        } else if (this.lastValue <= this.baseVolume + 3) {
            // At baseline - small random fluctuations
            this.lastValue = this.baseVolume + (Math.random() * 4);
            this.trend = Math.random() > 0.5 ? 0.5 : -0.5; // Small drift
        } else {
            // Continue current trend with some randomness
            this.lastValue += this.trend * (Math.random() * 5 + 1);
        }

        // Ensure value stays within bounds
        this.lastValue = Math.min(Math.max(this.lastValue, this.baseVolume), 100);

        // Occasional small ambient fluctuations
        const smallNoise = (Math.random() - 0.5) * 3;
        this.lastValue += smallNoise;

        // Round to one decimal place for more natural reading
        const finalValue = Math.round(this.lastValue * 10) / 10;

        // Create the message
        const dataPoint: DataPoint = {
            timestamp: Date.now(),
            value: finalValue,
        };

        return {
            type: 'audio',
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
        console.log('Generated audio data:', data);
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
