import ReceivedMessageInterface from "../Interfaces/ReceivedMessageInterface";
import { TMessagePayload } from "../Interfaces/MessageInterface";

export default class ReceivedMessage implements ReceivedMessageInterface {
    constructor(
        public readonly type: string,
        public readonly payload: TMessagePayload,
        public readonly context: string|null = null,
        public readonly receivers: Array<string> = []
    ) {
    }
}
