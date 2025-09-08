
import { sesClient } from "./aws.js";
import { GetTemplateCommand, CreateTemplateCommand } from "@aws-sdk/client-ses";
import Logger from "../utils/logger.js";

import { USER_EMAIL_TEMPLATES, USER_EMAIL_TEMPLATE_NAMES, USER_EMAIL_TEMPLATE_SUBJECTS } from "../controllers/email/emails/user.js";

// ses.deleteTemplate({ TemplateName: 'resetPasswordConfirm' }, (err, data) => {
//   if (err) {
//     console.error("Error deleting template:", err);
//   } else {
//     console.log("Template deleted successfully:", data);
//   }
// });

await Promise.all(Object.keys(USER_EMAIL_TEMPLATE_NAMES).map(async template => {

  const params = {
    TemplateName: template
  };

  try {
    await sesClient.send(new GetTemplateCommand(params));
  } catch (err) {
    Logger.error(`Error retrieving template: ${err}`);

    let templateParams = {
      Template: {
        TemplateName: template,
        HtmlPart: USER_EMAIL_TEMPLATES[template],
        SubjectPart: USER_EMAIL_TEMPLATE_SUBJECTS[template]
      }
    };
    try {
      const data = await sesClient.send(new CreateTemplateCommand(templateParams));
      Logger.info(`Created template: ${data}`);
    } catch (err) {
      Logger.error(`Error creating template: ${err}`);
    }
  }

}));

export default sesClient;
