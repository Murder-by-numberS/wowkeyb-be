import sesClient from "../../config/ses.js";
import { SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import Logger from "../../utils/logger.js";

// Function to send an email with a templated HTML body
export async function sendEmailWithTemplate(templateName, to, data) {

  console.log('data', data);

  const sendTemplatedEmailParams = {
    Source: 'mail@wowkeyb.gg', //TODO: set this in config?
    Destination: {
      ToAddresses: [to]
    },
    Template: templateName,
    TemplateData: JSON.stringify(data)
  };
  console.log('sendTemplatedEmailParams', sendTemplatedEmailParams);

  try {
    const command = new SendTemplatedEmailCommand(sendTemplatedEmailParams);
    const result = await sesClient.send(command);
    Logger.info('Email sent successfully:', result);
    console.log('Email sent successfully:', result);
    return result;
  } catch (err) {
    Logger.error('Error sending email:', err);
    console.log(err, err.stack);
    throw err;
  }

}
