import handlers from "./Services/HandlerServices"
import MessageDeserializer from "./Services/MessageDeserializer"
import EventInterface from "./Interfaces/EventInterface"
import ReceivedMessage from "./Model/ReceivedMessage"
import { TMessageHandlerCallback, TUnsubscribeHandler } from "./Interfaces/HandlerInterface"

/**
 * Handler wiadomości otrzymanych z serwera - wystawiony na zewnątrz
 */
export default class MessageHandlers {
    private readonly listeners: Record<string, Array<TMessageHandlerCallback>> = {}

    constructor() {
        handlers.on('message', (event) => this.handleMessage(event));
    }

    public has(type: string, listener: TMessageHandlerCallback): boolean {
        return (this.listeners[type] || []).includes(listener)
    }

    public on(type: string, listener: TMessageHandlerCallback): TUnsubscribeHandler {
        if (!this.listeners[type]) { this.listeners[type] = []; }

        this.listeners[type].push(listener);

        return (): void => {
            this.remove(type, listener)
        }
    }

    public remove(type: string, listener: TMessageHandlerCallback): void {
        this.listeners[type] = this.listeners[type].filter(fn => fn !== listener)
    }

    private handleMessage(event: EventInterface): void {
        // @ts-ignore - data exist in event!
        const message = MessageDeserializer(event.data || {})

        this.call(message.type, message, event)
    }

    private call (type: string, message: ReceivedMessage, event: EventInterface): void {
        this.get(type).forEach(fn => fn(message, event))
    }

    public get(type: string): Array<TMessageHandlerCallback> {
        return this.listeners[type] || []
    }
}
