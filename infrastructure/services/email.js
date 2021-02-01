const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { email } = require('../../config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email.user,
    pass: email.password,
  },
});

const options = {
  viewEngine: {
    layoutsDir: __dirname + '/../../templates/layouts',
    extname: '.hbs',
  },
  extName: '.hbs',
  viewPath: 'templates',
};

transporter.use('compile', hbs(options));

const testMailOptions = {
  from: email.user,
  to: 'truongdinhthien260599@gmail.com',
  subject: 'Nodemailer - Test',
  template: 'testHell',
  context: {
    name: 'TruongThien',
  },
};

exports.sendMailConfirmUser = async ({ email, emailToken }) => {
  try {
    const info = await transporter.sendMail({
      from: email.user,
      to: email,
      subject: 'Xác thực tài khoản shopping now',
      template: 'userConfirmation',
      context: {
        email,
        emailToken,
      },
    });
    return info;
  } catch (error) {
    throw error;
  }
};
