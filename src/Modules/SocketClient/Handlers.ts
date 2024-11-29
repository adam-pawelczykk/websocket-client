import { THandlerCallback, TUnsubscribeHandler } from "./Interfaces/HandlerInterface";
import EventInterface from "./Interfaces/EventInterface";

export type TRestrictedEvents = "open" | "close" | "message" | "error";

/**
 * Handler wiadomości z socket klienta - używany wewnątrz aplikacji
 */
export default class Handlers {

    private readonly listeners: Record<TRestrictedEvents, Array<THandlerCallback>> = {
        open: [],
        close: [],
        message: [],
        error: [],
    };

    public on(type: TRestrictedEvents, listener: THandlerCallback): TUnsubscribeHandler {
        this.listeners[type].push(listener);

        return (): void => {
            this.listeners[type] = this.listeners[type].filter(fn => fn !== listener);
        }
    }

    public get (type: TRestrictedEvents): Array<THandlerCallback> {
        return this.listeners[type];
    }

    public call (type: TRestrictedEvents, event: EventInterface): void {
        this.listeners[type].forEach(fn => fn(event));
    }
}
