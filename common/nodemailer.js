const nodemailer = require('nodemailer');


// default content of the email
const emailBody = (username, link) => {
  // return plain and html body
  return {
    plain: `Hello ${username}, click here to LogIn: ${link}`,
    html:
      `
        <h3>Hello ${username},</h3>
        <p>We just recieved a LogIn request for your EMail.</p>
        <p>To complete the LogIn just click this <a href= ${link}>LINK</a></p>
      `,
  }
}

module.exports = sendMail = async ({recipient, subject, username, link}) => { 
  console.log(link)
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
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
    text: emailBody(username, link).plain, // plain text body
    html: emailBody(username, link).html, // html body
  });

  if(status) return 'email sent';
  if(!status) return 'email not sent';
}



// create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//   host: "smtp.mail.yahoo.com",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.EMAILADD, // generated yahoo user
//     pass: process.env.EMAILPASS, // generated yahoo password
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// creating an output for the content of the email
// const emailOutput = `
//   <h3>Hello ${req.body.username},</h3>
//   <p>We've just created your account and use this token to keep you logged in for 30 days</p>
//   <p>${token}</p>
//   `;

// send mail with defined transport object
// let info = transporter.sendMail({
//   from: `"TRIVIA" <${process.env.EMAILADD}>`, // sender address
//   to: `${req.body.email}`, // list of receivers
//   subject: "Hello from TRIVIA", // Subject line
//   text: `Hello ${req.body.username}`, // plain text body
//   html: emailOutput, // html body
// });

// console.log("Message sent:");