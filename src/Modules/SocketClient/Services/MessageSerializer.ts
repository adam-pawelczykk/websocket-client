import MessageInterface from "../Interfaces/MessageInterface";

export default function (object: MessageInterface): string {
    return JSON.stringify(object);
}
