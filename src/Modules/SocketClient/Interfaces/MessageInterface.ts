export type TMessagePayload = number | string | object | null;
export default interface MessageInterface {
    type: string;
    payload: TMessagePayload;
    context: string|null;
    receivers: Array<string>;
}
