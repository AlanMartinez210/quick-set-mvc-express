const nodemailer = require('nodemailer');
const enumContactType = require("../../services/c2link4DiService").enumContactType();


exports.send = async function (contactData) {
  // お問い合わせ種別の名前をコードから取得
  const target = enumContactType.getEnum().find((enumContactType) => {
    return (enumContactType.code == contactData.contact_type);
  });
  const mailText = "■お問い合わせ種別：<br>" + target.name +
    "<br>■問い合わせ内容：<br>" + contactData.contact_text +
    "<br>■ユーザーID：<br>" + contactData.user_id +
    "<br>■返答用メールアドレス：<br>" + contactData.contact_email;
  var message = {
    to: 'types.main.mail@gmail.com',
    subject: '【c2link】お問い合わせ',
    html: mailText
  };

  var transport = {
    host: "smtp.gmail.com",
    auth: {
      type: "OAuth2",
      user: "types.main.mail@gmail.com",
      clientId: "958994192447-ebp70no2eqd2sl56ukvq2bc6jlk93qd2.apps.googleusercontent.com",
      clientSecret: "jYLA0TYZyVXKf9NcbUnz-Wd3",
      refreshToken: "1/4-1r6Key93lQNpkwV4VZncgKRdboe_BDTiDDZrXNeh4"
    }
  };

  var transporter = nodemailer.createTransport(transport);
  // メール送信
  transporter.sendMail(message, function (err, response) {
    console.log(err || response);
  });
};