const nodemailer = require('nodemailer');

exports.send = function (config, {from_addredd, to_address, subject, mail_text} = sendData) {
  if(!config) throw new Error('config does not exist.');

  const message = { from: from_addredd, to: to_address, subject: subject, html: mail_text };

  const transport = {
    host: config.HOST,
    auth: {
      type: config.TYPE,
      user: config.MAIN_EMAIL,
      clientId: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      refreshToken: config.REFRESH_TOKEN
    }
  };

  const transporter = nodemailer.createTransport(transport);

  // メール送信
  transporter.sendMail(message, function (err, response) {
    console.log(err || response);
  });

  return result;
};