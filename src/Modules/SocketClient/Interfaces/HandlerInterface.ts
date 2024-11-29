import ReceivedMessageInterface from "./ReceivedMessageInterface";
import EventInterface from "./EventInterface";

export type TUnsubscribeHandler = () => void;
export type THandlerCallback = (event: EventInterface) => void;
export type TMessageHandlerCallback = (
    message: ReceivedMessageInterface,
    event: EventInterface
) => void;
