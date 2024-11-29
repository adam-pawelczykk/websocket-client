const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NTY5MjU2MDEsImV4cCI6MTY1Njk2MTYwMSwicm9sZXMiOltdLCJlbWFpbCI6InVzZXIxQGdydXBhZGVhbGVyLnBsIiwiYXV0aF9tZXRob2QiOiJERUFMRVJfSUQiLCJjb250ZXh0IjoiY2Y5YTU3YWYtNGE5ZS00NmI5LTlhMGYtYzE0YWE1NTI3NWVmIiwiY29udGV4dF90eXBlIjoiZGVhbGVyX2NybSIsImNvbnRleHRfdHlwZV91dWlkIjoiNzIwYTI3M2QtOWZiZS01M2JjLTlhOTMtNDMxZmY2MjJkYjY4IiwiY29udGV4dF92YXJpZXR5IjoiREVBTEVSIiwidXVpZCI6IjI1MGJmNmZhLTJmYzUtNGVmYS04NmQzLTM5ZjczNDY0Zjk2NSIsInBob25lIjoiKzE5Mjg1NTA1NjU5IiwibmFtZSI6IlVzZXIgMSIsImxhbmd1YWdlIjoicGwiLCJob3N0IjoiaHR0cDovL2RlYWxlcmNybS5kZXYifQ.TgMFptcokeG0GLuyWsojmbzOu9yvpIZawgA6RjegrjDCEL48CQlZYhsc8BeXmWvf-wu1Keb2pBMlHiOd-POVBcp3kPQY8qImKwsN55_rWNe-B3gnh1mA8l1T68Wd6Vp67dmWJWsRjipjlVq_l0v9Tncp_9kR1ACDROsToTDDpIhtMC06fp0eQwravVvNQZJEo-9UL226E9v468owDbtErvF8kfWjExmipnbiu3BGoADjUYTYf7zTwgKjfbHV3zaHpFl9oB7A0cUYf27WgRW7h9qZKDx6ToI_KK4EGts9IPRX9t_8P5oaJwWdo7Mzuk-U2dGZl7MfCVNEEoB4edHHBwgdYNbo3-uHcBaiWiQgQWX8QkkcYJFmMsnR-x7YiWqmaAHD9Zm10EBmSX2SbOdsQFiQ8eBgLXv9UdG_xPmTef4EbvHK6j93iWVriiRyvgizg0RRG_kzO-KC56XIYPDje0PuKD29BeSMVeocfEzACLnNLFOJv-y6odYFugCFSvG-f8DPMbDGh1Ou0aTFvatoXtIFUOLEGR9Hyd2MhehpPcV8wgJ7jDHBQajE-eHgbKRjx7hh-GkYZIFC6Vynf-saafFf_ql3ThiwIvftt0lq-cAx-EUsMnqGq6jTXePhHtNbe03BS2mGXf6_dKXfESLJx_-Vn_lRrBZQwMWIcQ5LMdc';
const host = 'localhost';
const port = 3000;
const maxRetries = 2;

function getUrl () {
    return new Promise(resolve => {
        resolve(`ws://${host}:${port}/ws?token=${token}`);
    })
}

const {
    default: Client,
    TYPE_MESSAGE,
    TYPE_OPEN,
    TYPE_CLOSE,
    TYPE_ERROR
} = window.WebSocket;

const el = document.getElementById('console');
const client = new Client(getUrl, {
    maxRetries,
    debug: false
});

function addNewMessage(message) {
    const pre = document.createElement('pre');
    pre.innerHTML = message;
    el.append(pre);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getRandomString() {
    return Math.random().toString(36).substr(2, 10);
}

const messageNamespace = 'message.test';
const intervalTime = 2000;

client.listen(messageNamespace, ({payload}) => {
    addNewMessage('[Receive] ' + payload);
});

client.on(TYPE_MESSAGE, ({ data }) => {
    addNewMessage('[Handle message] ' + JSON.stringify(data));
});

client.on(TYPE_OPEN, () => {
    addNewMessage('[Open] Established new connection.');
});

client.on(TYPE_ERROR, () => {
    addNewMessage('[Error] Ops... error.');
});

client.on(TYPE_CLOSE, () => {
    addNewMessage('[Close] Disconnected.');
});

setInterval(() => {
    const payload = getRandomString();

    addNewMessage('[Sending] ' + payload);
    client.send(messageNamespace, payload);
}, intervalTime);
