const nodemailer = require('nodemailer');


// default content of the email
const buildBody = ({purpose, username, link, value, message}) => {
  switch(purpose){
    case 'login':
      return {
        plain: `Hello ${username}, click here to LogIn: ${link}`,
        html:
        `
          <h3>Hello ${username},</h3>
          <p>We just recieved a LogIn request for your EMail.</p>
          <p>To complete the LogIn just click this <a href= ${link}>LINK</a></p>
        `,
      };

    case 'feedback':
      return {
        plain: `We recieved feedback with a rating of ${value} and the message: ${message}`,
        html:
        `
          <h3>We recieved Feedback!</h3>
          <h4>Value:</h4>
          <p>${value}</p>
          <h4>Message:</h4>
          <p>${message}</p>
        `,
      }
  }
}

module.exports = sendMail = async ({purpose, recipient, subject, body}) => { 
  let emailBody;
  switch(purpose){
    case 'login':
      emailBody = buildBody({purpose, username: body.username, link: body.link});
      break;
    case 'feedback':
      emailBody = buildBody({purpose, value: body.value, message: body.message});
      break;
  }

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADD,
      pass: process.env.EMAIL_PASS,
    },
  });

  // send mail with defined transport object
  const status = await transporter.sendMail({
    from: process.env.EMAIL_ADD,
    to: recipient,
    subject: subject,
    text: emailBody.plain, // plain text body
    html: emailBody.html, // html body
  });

  if(!status) return 'email not sent';
  return 'email sent';
}
