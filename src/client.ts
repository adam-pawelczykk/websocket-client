import Socket, { UrlProvider } from "./Modules/SocketClient/Socket";
import messageHandlers from "./Modules/SocketClient/Services/MessageHandlerServices";
import MessageSerializer from "./Modules/SocketClient/Services/MessageSerializer";
import handlers from "./Modules/SocketClient/Services/HandlerServices";
import SocketNotOpenException from "./Modules/SocketClient/Exceptons/SocketNotOpenException";
import Message from "./Modules/SocketClient/Model/Message";
import MessageInterface, { TMessagePayload } from "./Modules/SocketClient/Interfaces/MessageInterface";
import { SocketOptions } from "./Modules/SocketClient/Interfaces/SocketInterface";
import { TRestrictedEvents } from "./Modules/SocketClient/Handlers";
import { EVENT_AUTHENTICATE, TYPE_CLOSE } from "./constants"
import { PING_INTERVAL } from "./configuration"
import {
    THandlerCallback,
    TMessageHandlerCallback,
    TUnsubscribeHandler
} from "./Modules/SocketClient/Interfaces/HandlerInterface";

export default class Client {
    private readonly socket: Socket;
    private readonly maxEnqueuedMessages: number;
    private pingInterval: NodeJS.Timeout|undefined;
    private queue: Array<MessageInterface> = [];

    constructor(url: UrlProvider, options: SocketOptions = {}) {
        this.socket = new Socket(url, options);
        this.maxEnqueuedMessages = options.maxEnqueuedMessages || 100;

        // Send stored messages in queue
        this.listen(EVENT_AUTHENTICATE, () => {
            this.registerPing();
            this.queue.forEach((message, index, object) => {
                this.socket.send(MessageSerializer(message));
                // Remove element from array
                object.splice(index, 1);
            });
        })

        handlers.on(TYPE_CLOSE, () => {
            this.clearPingInterval();
        })
    }

    public connect(): void {
        this.socket.connect()
    }

    /**
     * Czy handler już istnieje
     */
    public has(type: string, callback: TMessageHandlerCallback): boolean {
        return messageHandlers.has(type, callback);
    }

    /**
     * Zwraca anonimową funkcje, jeżeli ją wywołamy usuniemy listener
     */
    public listen(type: string, callback: TMessageHandlerCallback): TUnsubscribeHandler {
        if (this.has(type, callback)) {
            return (): void => messageHandlers.remove(type, callback);
        }

        return messageHandlers.on(type, callback);
    }

    /**
     * Zwraca anonimową funkcje, jeżeli ją wywołamy usuniemy listener
     */
    public on(type: TRestrictedEvents, callback: THandlerCallback): TUnsubscribeHandler {
        return handlers.on(type, callback)
    }

    /**
     * Wysyła wiadomość do serwera
     */
    public send(
        type: string,
        payload: TMessagePayload,
        context: string|null = null,
        receivers: Array<string> = [],
        queue: true
    ): void {
        const message = new Message(type, payload, context, receivers)

        if (this.socket.isOpen()) {
            this.socket.send(MessageSerializer(message))
        } else if (this.queue.length < this.maxEnqueuedMessages && queue) {
            this.queue.push(message)
        } else {
            this.socket.connect()

            throw new SocketNotOpenException()
        }
    }

    private ping(): void {
        this.send('ping', null, null, [], true)
    }

    private registerPing(): void {
        this.clearPingInterval()
        this.pingInterval = setInterval(() => this.ping(), PING_INTERVAL);
    }

    private clearPingInterval(): void {
        if (undefined !== this.pingInterval) {
            clearInterval(this.pingInterval)
        }
    }
}
