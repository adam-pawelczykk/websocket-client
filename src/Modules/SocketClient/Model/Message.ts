import MessageInterface, { TMessagePayload } from "../Interfaces/MessageInterface";

export default class Message implements MessageInterface {
    constructor(
        public readonly type: string,
        public readonly payload: TMessagePayload,
        public readonly context: string|null,
        public readonly receivers: Array<string> = []
    ) {
    }
}
