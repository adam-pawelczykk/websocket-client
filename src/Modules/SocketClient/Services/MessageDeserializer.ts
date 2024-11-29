import ReceivedMessage from "../Model/ReceivedMessage";

export default function (text: string): ReceivedMessage {
    const {
        type = undefined,
        payload = undefined,
        context = null,
        receivers = []
    } = JSON.parse(text);

    if (undefined === type || undefined === payload) {
        throw new Error('Bad received message format.')
    }

    return new ReceivedMessage(type, payload, context, receivers);
}
