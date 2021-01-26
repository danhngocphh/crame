const nodemailer = require('nodemailer');
const { email } = require('../../config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email.user,
    pass: email.password,
  },
});
let testMailOptions = {
  from: email.user,
  to: 'truongdinhthien260599@gmail.com',
  subject: 'Nodemailer - Test',
  text: '<h1>Hello word</h2>',
};

exports.sendMail = async (template = {}, mailOptions = testMailOptions) => {
  // TODO: handle this
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};
