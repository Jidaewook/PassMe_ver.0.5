const mailgun = require('mailgun-js')({
    apiKey: '46de09a436eb3c7dda5c4c969a59c2a2-9a235412-3b366777',
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