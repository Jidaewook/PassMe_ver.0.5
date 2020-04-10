const mailgun = require('mailgun-js')({
    apiKey: 'bc1eb477959f11ff4248438ef966a145-73ae490d-e68ea21d',
    domain: 'https://api.mailgun.net/v3/sandbox3f2081ddd8754254acc2227066c9bd13.mailgun.org'
});

const sender = 'dw4157@#naver.com';

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