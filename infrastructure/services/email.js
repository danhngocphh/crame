const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const { email: emailConfig } = require('../../config');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailConfig.user,
    pass: emailConfig.password,
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
  from: emailConfig.user,
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
      from: emailConfig.user,
      to: email,
      subject: 'Xác thực tài khoản shopping now',
      template: emailConfig.template.userConfirmation,
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

exports.sendMailForgetPassword = async ({ email, emailToken }) => {
  try {
    const info = await transporter.sendMail({
      from: emailConfig.user,
      to: email,
      subject: 'Quên mất khẩu shopping now',
      template: emailConfig.template.forgetPassword,
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