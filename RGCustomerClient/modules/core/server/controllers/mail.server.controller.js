// var nodemailer = require('nodemailer');
// var http = require('http');
// var mailer = require('../../../../env/local.js'); // If this doesn't work it's Chris' fault.
//
// module.exports = send_email(name, invName, project, mailTo, securityString) {
// 	/* Example function parameter inputs */
// 	// name = 'Name goes here';
// 	// invName = 'Name of inviter goes here';
// 	// project = 'Project string goes here';
// 	// mailTo = 'A Client <client@website.com>' // Follow the syntax exactly. Note below.
//
// 	process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
// 	var url = 'http://localhost:3000/login' + securityString;
//
// 	// securityString = 'AxFvsE42Fr6gfFG5herf34#$gergg34rFDSFFB';
//   // The security string is a 127 character randomly generated password created outside of the mailer
//
// 	var transporter = nodemailer.createTransport(mailer.url);
// 	// This is a "connection url" to gmail's smtp server (Send mail transfer protocol)
// 	// Syntax:   'smtps://<Username@gmail.com>:password@smtp.gmail.com'
//
// 	// The Transport object uses these credentials to connect to google's smtp server.
// 	// SMTP stands for "Simple Mail Transfer Protocol."
// 	// It's just a simple server google has that lets you push email through it.
//
// 	// var transporter = nodemailer.createTransport({ service: "gmail", auth: { user: "rapidgenommailer@gmail.com", pass: "" } });
// 	// alternate syntax to connect to transporter, more transparent
//
// 	// IMPORTANT: For both the to and from, you need a specific syntax.
// 	//            This is required directly by the google smtp server.
// 	// 			  'Name <someone@website.com>' name is any string, <> are required.
//
// 	var body = 	name + ',\n\nYou have been invited to a RAPiD Genomics project by '
// 				+ invName + '.\n Project details: ' + project + '.\n\nPlease click here ' +
// 				'to accept the invitation and register your user profile.\n\n' + url +
// 				'\n\n- The RAPiD Genomics Team';
// 	// Body is the (long) string that actually goes in the email. It can
// 	// take in variables and concatenate them with the rest of the email.
// 	// Also, it's parsed as HTML so \n doesn't work but <tags> do.
//
// 	/* var body = '<h2>' + name + '<h2>,\n\nYou have been invited to a RAPiD Genomics project by '
// 				+ invName + '.\n Project details: ' + project + '.\n\nPlease click here ' +
// 				'to accept the invitation and register your user profile.\n\n' + url +
// 				'\n\n- The RAPiD Genomics Team';
// 	*/ // WIP
//
// 	var mailOptions = {
// 	    from: 'RG Mailer <rapidgenommailer@gmail.com>', // sender address
// 	    to: mailTo, // list of receivers
// 	    subject: 'You have been invited to a RAPiD Genomics Project', // Subject line
// 	    html: body // html body
// 		// This is just a big string that is parsed as an html.
// 		// We can use variables from above, which can be set from a webpage and such.
// 	};
//
// 	transporter.sendMail(mailOptions, function(error, info){
// 		if(error) {
// 			return console.log(error);
// 		}
// 	});
//
// }; // End of send_email() function.
//
// // DEBUG info
// // Self signed certificate error: allow unauthorized access
// // 			in windows node js prompt: SET NODE_TLS_REJECT_UNAUTHORIZED=0
// // Not signed in error. It will give you a wall of text and URLs. Try signing into RGmailer
// // 			on your (chrome?) browser and try again.
// // Response 555 error: This means there is a syntax error with the receive email or sender email.
//
// // send_email(); // REMOVE THIS when we get it working with html requests.
