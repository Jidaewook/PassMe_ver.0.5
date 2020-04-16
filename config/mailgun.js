const mailgun = require('mailgun-js')({
    apiKey: '035de80b312abe8ee683a231aeafa247-915161b7-9c943b31',
    domain: 'sandbox67853608049b4f6095db8b486fdf19a2.mailgun.org'
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