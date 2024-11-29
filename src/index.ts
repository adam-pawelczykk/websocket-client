import Client from "./client"
import {
    TYPE_OPEN,
    TYPE_CLOSE,
    TYPE_MESSAGE,
    TYPE_ERROR,
    EVENT_PONG,
    EVENT_AUTHENTICATE
} from "./constants"

export default Client
export {
    TYPE_OPEN,
    TYPE_CLOSE,
    TYPE_MESSAGE,
    TYPE_ERROR,
    EVENT_PONG,
    EVENT_AUTHENTICATE
}

module.exports = Client
module.exports = Object.assign(module.exports, {
    TYPE_OPEN,
    TYPE_CLOSE,
    TYPE_MESSAGE,
    TYPE_ERROR,
    EVENT_PONG,
    EVENT_AUTHENTICATE
})
