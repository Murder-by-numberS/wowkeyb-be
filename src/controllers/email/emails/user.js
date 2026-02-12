import Config from "../../../config/config.js";

export const USER_EMAIL_TEMPLATE_NAMES = {
  registerUser: 'registerUser',
  confirmUser: 'confirmUser',
  createNewPassword: 'createNewPassword',
  resetPassword: 'resetPassword',
  resetPasswordConfirm: 'resetPasswordConfirm',
  changePassword: 'changePassword'
}

export const USER_EMAIL_TEMPLATE_SUBJECTS = {
  registerUser: 'WoWKeyb - Welcome! Confirm Your Account',
  confirmUser: 'WoWKeyb - Confirm Your Account',
  createNewPassword: 'WoWKeyb - Create Your New Password',
  resetPassword: 'WoWKeyb - Password Reset Request',
  resetPasswordConfirm: 'WoWKeyb - Password Successfully Changed',
  changePassword: 'WoWKeyb - Password Successfully Changed'
}

// Branded email layout wrapper
const logoUrl = Config.emailLogoUrl || `${Config.feURL}/images/logo/logo-text-on-dark.png`;
const siteUrl = Config.feURL;

function wrapInLayout(bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WoWKeyb</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #0f172a; border-radius: 12px 12px 0 0; padding: 32px 40px;">
              <a href="${siteUrl}" style="text-decoration: none;">
                <img src="${logoUrl}" alt="WoWKeyb" width="180" style="display: block; max-width: 180px; height: auto;" />
              </a>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: #ffffff; padding: 40px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
              ${bodyContent}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; border-radius: 0 0 12px 12px; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} WoWKeyb &mdash; Your World of Warcraft Keybinding Companion
              </p>
              <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.5;">
                Questions? <a href="mailto:support@wowkeyb.gg" style="color: #60a5fa; text-decoration: none;">support@wowkeyb.gg</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 28px auto;">
  <tr>
    <td align="center" style="background-color: #2563eb; border-radius: 8px;">
      <a href="${href}" style="display: inline-block; padding: 14px 32px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; letter-spacing: 0.3px;">
        ${label}
      </a>
    </td>
  </tr>
</table>`;
}

export const USER_EMAIL_TEMPLATES = {
  registerUser: wrapInLayout(`
              <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #1e293b; line-height: 1.3;">
                Welcome to WoWKeyb!
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Hey {{ email }},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Thanks for creating an account! You're one step away from optimizing your World of Warcraft keybindings.
              </p>
              <p style="margin: 0 0 8px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Please confirm your email address to activate your account:
              </p>
              ${ctaButton('{{link}}', 'Confirm My Account')}
              <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{link}}" style="color: #3b82f6; word-break: break-all;">{{link}}</a>
              </p>
  `),

  confirmUser: wrapInLayout(`
              <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #1e293b; line-height: 1.3;">
                Confirm Your Account
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Hey {{ email }},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Please confirm your account by clicking the button below.
              </p>
              ${ctaButton('{{ resetLink }}', 'Confirm Account')}
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8; line-height: 1.5; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ resetLink }}" style="color: #3b82f6; word-break: break-all;">{{ resetLink }}</a>
              </p>
              <div style="margin-top: 24px; padding: 16px; background-color: #fefce8; border: 1px solid #fef08a; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #854d0e; line-height: 1.5;">
                  &#9202; This link will expire in 24 hours.
                </p>
              </div>
  `),

  createNewPassword: wrapInLayout(`
              <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #1e293b; line-height: 1.3;">
                Create Your New Password
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Hey {{ email }},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                You need to create a new password for your account. Click the button below to set up your new password:
              </p>
              ${ctaButton('{{ resetLink }}', 'Create New Password')}
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8; line-height: 1.5; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ resetLink }}" style="color: #3b82f6; word-break: break-all;">{{ resetLink }}</a>
              </p>
              <div style="margin-top: 24px; padding: 16px; background-color: #fefce8; border: 1px solid #fef08a; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #854d0e; line-height: 1.5;">
                  &#9202; This link will expire in 24 hours.
                </p>
              </div>
  `),

  resetPassword: wrapInLayout(`
              <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #1e293b; line-height: 1.3;">
                Password Reset Request
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Hey {{ email }},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                We received a request to reset the password for your WoWKeyb account. Click the button below to choose a new password:
              </p>
              ${ctaButton('{{ resetLink }}', 'Reset My Password')}
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #94a3b8; line-height: 1.5; text-align: center;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="{{ resetLink }}" style="color: #3b82f6; word-break: break-all;">{{ resetLink }}</a>
              </p>
              <div style="margin-top: 24px; padding: 16px; background-color: #fefce8; border: 1px solid #fef08a; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #854d0e; line-height: 1.5;">
                  &#9202; This link will expire in 24 hours.
                </p>
              </div>
              <div style="margin-top: 16px; padding: 16px; background-color: #f1f5f9; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                  Didn't request this? No worries &mdash; you can safely ignore this email and your password will remain unchanged.
                </p>
              </div>
  `),

  resetPasswordConfirm: wrapInLayout(`
              <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #1e293b; line-height: 1.3;">
                Password Changed Successfully
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Hey {{ email }},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Your password has been successfully updated. You can now log in with your new password.
              </p>
              ${ctaButton(`${siteUrl}/sign-in`, 'Go to WoWKeyb')}
              <div style="margin-top: 24px; padding: 16px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #991b1b; line-height: 1.5;">
                  &#9888; If you didn't make this change, please <a href="mailto:support@wowkeyb.gg" style="color: #dc2626; font-weight: 600;">contact us immediately</a>.
                </p>
              </div>
  `),

  changePassword: wrapInLayout(`
              <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 700; color: #1e293b; line-height: 1.3;">
                Password Changed Successfully
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Hey {{ email }},
              </p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Your password has been successfully changed. You're all set to continue using WoWKeyb with your new password.
              </p>
              ${ctaButton(`${siteUrl}/sign-in`, 'Go to WoWKeyb')}
              <div style="margin-top: 24px; padding: 16px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
                <p style="margin: 0; font-size: 13px; color: #991b1b; line-height: 1.5;">
                  &#9888; If you didn't make this change, please <a href="mailto:support@wowkeyb.gg" style="color: #dc2626; font-weight: 600;">contact us immediately</a>.
                </p>
              </div>
  `)
}
