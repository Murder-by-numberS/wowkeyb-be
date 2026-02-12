
import { sesClient } from "./aws.js";
import { GetTemplateCommand, CreateTemplateCommand, UpdateTemplateCommand } from "@aws-sdk/client-ses";
import Logger from "../utils/logger.js";
import Config from "./config.js";

import { USER_EMAIL_TEMPLATES, USER_EMAIL_TEMPLATE_NAMES, USER_EMAIL_TEMPLATE_SUBJECTS } from "../controllers/email/emails/user.js";

// Only initialize SES templates if AWS credentials are properly configured
if (Config.accessKey && Config.secretAccessKey && Config.region) {
  try {
    await Promise.all(Object.keys(USER_EMAIL_TEMPLATE_NAMES).map(async template => {

      const templateData = {
        Template: {
          TemplateName: template,
          HtmlPart: USER_EMAIL_TEMPLATES[template],
          SubjectPart: USER_EMAIL_TEMPLATE_SUBJECTS[template]
        }
      };

      try {
        await sesClient.send(new GetTemplateCommand({ TemplateName: template }));
        // Template exists — update it to ensure latest version
        try {
          await sesClient.send(new UpdateTemplateCommand(templateData));
          Logger.info(`Updated SES template: ${template}`);
        } catch (updateErr) {
          Logger.error(`Error updating template ${template}: ${updateErr}`);
        }
      } catch (err) {
        // Template doesn't exist — create it
        try {
          await sesClient.send(new CreateTemplateCommand(templateData));
          Logger.info(`Created SES template: ${template}`);
        } catch (createErr) {
          Logger.error(`Error creating template ${template}: ${createErr}`);
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
