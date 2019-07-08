const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'parag@dev.com',
        subject: 'Parag Developer Team welcomes you!!',
        text: `${name}. Thanks for signing up to one of our application. We are looking forward to serve you best user experience. Please let us know how you get along`
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'parag@dev.com',
        subject: 'Parag Developer Team',
        text: `${name}. We'd be sorry to see you go. Please let us know if there is anything we could have done better. Thanks for the opportunity to serve you.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}