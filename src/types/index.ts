export interface DataPoint {
    timestamp: number;
    value: number;
}

export interface WebSocketMessage {
    type: string;
    data: DataPoint;
}