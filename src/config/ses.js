
import { sesClient } from "./aws.js";
import { GetTemplateCommand, CreateTemplateCommand } from "@aws-sdk/client-ses";
import Logger from "../utils/logger.js";
import Config from "./config.js";

import { USER_EMAIL_TEMPLATES, USER_EMAIL_TEMPLATE_NAMES, USER_EMAIL_TEMPLATE_SUBJECTS } from "../controllers/email/emails/user.js";

// Only initialize SES templates if AWS credentials are properly configured
if (Config.accessKey && Config.secretAccessKey && Config.region) {
  try {
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
  } catch (error) {
    Logger.warn('SES template initialization skipped due to AWS configuration issues');
  }
} else {
  Logger.warn('AWS credentials not configured, skipping SES template initialization');
}

export default sesClient;
