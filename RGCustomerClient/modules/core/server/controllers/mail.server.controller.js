/* Github page for nodemailer: https://github.com/nodemailer/nodemailer */

var nodemailer = require('nodemailer');
var http = require('http');
var local = require('../../../../config/env/local.js');
var generator = require('xoauth2').createXOAuth2Generator({
  user: local.mailer.user,
  clientId: local.mailer.clientId,
  clientSecret: local.mailer.clientSecret,
  refreshToken: local.mailer.refreshToken,
  accessToken: local.mailer.accessToken
});

var utf8 = require('utf8');
module.exports = {
  sendMail: function(config, callback) {
  	/*
       Example mail options inputs:
    	 config.name = 'Name goes here';
    	 config.invName = 'Name of inviter goes here';
    	 config.project = 'Project string goes here';
    	 config.mailTo = 'Client Name <client@website.com>' Name <Address> format, multiple entries are separated by commas
    */

  	process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

  	var accountValidationUrl = config.emailURL;

    /* Connect transporter object to gmail API using oath2 credentials */
  	var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          xoauth2: generator
      }
    });

    /* Prepare the body of the email */
  	var body =
    (
          '<!DOCTYPE html>' +
          '<html>' +
            '<body>' +
              '<h4>Greetings from RAPiD Genomics,</h4>' +
              '<p>' +
                'You have been invited to participate in a project by ' + config.invitingUser + '.' +
                '<br><br>' +
                'Please click here to accept the invitation and register your user profile.' +
                '<br>' + '<a href="' + accountValidationUrl + '">Log In</a> <br><br>' +
        				'-RAPiD Genomics Team' +
              '</p>' +
            '</body>' +
          '</html>'
    );

  	/* Body is the (long) string that actually goes in the email. It can
  	   take in variables and concatenate them with the rest of the email.
  	   Also, it's parsed as HTML so \n doesn't work but <tags> do. */

  	var mailOptions = {
  	    from: 'RG Dev Team <rapidgenommailer@gmail.com>', // sender address
  	    to: config.mailTo, // list of receivers
  	    subject: 'You have been invited to a RAPiD Genomics Project',
  	    html: body
  	};

    /* Now that we're all configured, send the mail */
  	transporter.sendMail(mailOptions, function(error, info){
  		if(error) {
        console.log('Error mailing: ' + error);
  			callback(error);
  		} else {
        console.log('Success mailing\nInfo: ' + JSON.stringify(info));
        callback(null);
      }
  	});
  },
  passwordMail: function(config, callback) {
    /*
       Example mail options inputs:
       config.name = 'Name goes here';
       config.invName = 'Name of inviter goes here';
       config.project = 'Project string goes here';
       config.mailTo = 'Client Name <client@website.com>' Name <Address> format, multiple entries are separated by commas
    */

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

    var accountValidationUrl = config.emailURL;

    /* Connect transporter object to gmail API using oath2 credentials */
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          xoauth2: generator
      }
    });

    /* Prepare the body of the email */
    var body =
    (
          '<!DOCTYPE html>' +
          '<html>' +
            '<body>' +
              '<h4>Greetings from RAPiD Genomics,</h4>' +
              '<p>' +
                'You have been invited to participate in a project by ' + config.invitingUser + '.' +
                '<br><br>' +
                'Please click here to accept the invitation and register your user profile.' +
                '<br>' + '<a href="' + accountValidationUrl + '">Log In</a> <br><br>' +
                '-RAPiD Genomics Team' +
              '</p>' +
            '</body>' +
          '</html>'
    );

    /* Body is the (long) string that actually goes in the email. It can
       take in variables and concatenate them with the rest of the email.
       Also, it's parsed as HTML so \n doesn't work but <tags> do. */

    var mailOptions = {
        from: 'RG Dev Team <rapidgenommailer@gmail.com>', // sender address
        to: config.mailTo, // list of receivers
        subject: 'You have been invited to a RAPiD Genomics Project',
        html: body
    };

    /* Now that we're all configured, send the mail */
    transporter.sendMail(mailOptions, function(error, info){
      if(error) {
        console.log('Error mailing: ' + error);
        callback(error);
      } else {
        console.log('Success mailing\nInfo: ' + JSON.stringify(info));
        callback(null);
      }
    });
  }
};
