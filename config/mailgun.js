const mailgun = require('mailgun-js')({
    apiKey: 'key-dfdd569fff0c0a2fed851ab37bfc78ca',
    domain: 'sandbox897e8dcc6aa044b0b2e3fa429bee00c9.mailgun.org'
});

const sender = 'dw4157@naver.com';

exports.sendEmail = (recipient, message) => {
    const data = {
        from: `<${sender}>`,
        to: recipient,
        subject: message.subject,
        text: message.text
    };

    mailgun.messages().send(data, (error, body) => {
        console.log(body)
    });
};