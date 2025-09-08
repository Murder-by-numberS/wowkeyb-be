import ses from "../../config/ses.js";

// Function to send an email with a templated HTML body
export async function sendEmailWithTemplate(templateName, to, data) {

  console.log('data', data);

  let sendTemplatedEmailParams = {
    Source: 'mail@wowkeyb.gg', //TODO: set this in config?
    Destination: {
      ToAddresses: [to]
    },
    Template: templateName,
    TemplateData: JSON.stringify(data)
  };
  console.log('sendTemplatedEmailParams', sendTemplatedEmailParams);

  ses.sendTemplatedEmail(sendTemplatedEmailParams, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });

}
