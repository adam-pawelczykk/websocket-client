import { TMessagePayload } from "./MessageInterface";

export default interface ReceivedMessageInterface {
    type: string;
    payload: TMessagePayload;
    receivers: Array<string>;
}
