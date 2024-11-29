import ReconnectingWebSocket  from "reconnecting-websocket";
import EventInterface from "./Interfaces/EventInterface";
import handlers from "./Services/HandlerServices";
import SocketInterface, {SocketOptions} from "./Interfaces/SocketInterface";

export type UrlProvider = string | (() => string) | (() => Promise<string>);
export default class Socket implements SocketInterface {

    private socket: ReconnectingWebSocket;
    private open: boolean;

    constructor(url: UrlProvider, options: SocketOptions = {}) {
        options.maxRetries = options.maxRetries || 5;
        options.maxEnqueuedMessages = 1;

        this.open = false;
        this.socket = new ReconnectingWebSocket(url,[], options);

        this.socket.addEventListener('open', (event: EventInterface) => this.handleOpen(event));
        this.socket.addEventListener('close', (event: EventInterface) => this.handleClose(event));
        this.socket.addEventListener('message', (event: EventInterface) => Socket.handleMessage(event));
        this.socket.addEventListener('error', (event: EventInterface) => Socket.handleError(event));
    }

    public connect(): void {
        if (!this.open) {
            this.reconnect();
        }
    }

    public reconnect(): void {
        this.socket.reconnect();
    }

    public isOpen(): boolean {
        return this.open;
    }

    public send(message: string): void {
        this.socket.send(message);
    }

    private handleOpen(event: EventInterface): void {
        this.open = true;
        handlers.call('open', event);
    }

    private handleClose(event: EventInterface): void {
        this.open = false;
        handlers.call('close', event);
    }

    private static handleMessage(event: EventInterface): void {
        handlers.call('message', event);
    }

    private static handleError(event: EventInterface): void {
        handlers.call('error', event);
    }
}
