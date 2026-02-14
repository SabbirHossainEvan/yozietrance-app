import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class SocketService {
    private static instance: SocketService;
    public socket: Socket | null = null;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public init(token?: string): Socket {
        if (!this.socket) {
            this.socket = io(SOCKET_URL, {
                auth: { token },
                transports: ['websocket'],
                autoConnect: false, // Wait for auth
            });
        } else if (token) {
            this.socket.auth = { token };
        }
        return this.socket;
    }

    public connect(): void {
        if (this.socket) {
            this.socket.connect();
        }
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    public getSocket(): Socket | null {
        return this.socket;
    }
}

export default SocketService.getInstance();
