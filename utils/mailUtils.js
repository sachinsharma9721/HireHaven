const transporter = require('../config/mailconfig');

const sendMail = async ({ from, to, subject, text, html, attachments, alternatives }) => {

    await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
        attachments,
        alternatives
    });
};

const welcomeMail = async ({
    from,
    to,
    user,
    alternatives,
    html
}) => {

    await sendMail({
        from,
        to,
        subject: `Verification email to ${user.name}`,
        text: `${user.name} welcome to our app`,
        html,
        alternatives,
    });
};

module.exports = {
    sendMail,
    welcomeMail
}