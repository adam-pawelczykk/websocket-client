export default class SocketNotOpenException extends Error {
    constructor() {
        super('Socket was not open!');
    }
}
