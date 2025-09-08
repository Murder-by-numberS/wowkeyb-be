export const USER_EMAIL_TEMPLATE_NAMES = {
  registerUser: 'registerUser',
  confirmUser: 'confirmUser',
  createNewPassword: 'createNewPassword',
  resetPassword: 'resetPassword',
  resetPasswordConfirm: 'resetPasswordConfirm',
  changePassword: 'changePassword'
}
export const USER_EMAIL_TEMPLATE_SUBJECTS = {
  registerUser: 'WOWKEYB: Thank You For Registering',
  confirmUser: 'WOWKYEB: Confirm User',
  createNewPassword: 'createNewPassword',
  resetPassword: 'WOWKEYB: Reset Password',
  resetPasswordConfirm: 'WOWKEYB: Reset Password Confirm',
  changePassword: 'WOWKEYB: Password Changed'
}
export const USER_EMAIL_TEMPLATES = {
  registerUser:
    `<p>Dear {{ email }},</p>
<br>
<p>Thank You for Registering A User Account at WOWKEYB</p>
<br>
<p>You need to confirm your account before you can login.
<p>Click <a href="{{link}}">here</a> to confirm your account.</p>

<p>
If you have any questions or comments, please <a href="mailto:support@wowkeyb.gg" target="_top">contact us.</a>
</p>

Thanks,

<p>WOWKEYB Team</p>`,

  confirmUser: `
<p>Dear {{ email }},</p>
<p>
    Please click this link to confirm creation.
</p>
<a href="{{ resetLink }}">{{ resetLink }}</a>
<p>
    This link will work for 24 hours or until your password is reset.</p>
<p>
    If you have any questions or comments, please <a href="mailto:support@wowkeyb.gg" target="_top">contact
        us.</a>
</p>

Thanks,

<p>WOWKEYB Team</p>`,

  createNewPassword: `
<p>Dear {{ email }},</p>
<p>
    Please create a new password. Click on the link below or paste this into your browser to complete the process:
</p>
<a href="{{ resetLink }}">{{ resetLink }}</a>
<p>
    This link will work for 24 hours or until your password is reset.</p>
<p>
    If you have any questions or comments, please <a href="mailto:support@wowkeyb.gg" target="_top">contact
        us.</a>
</p>

Thanks,

<p>WOWKEYB Team</p>`,

  resetPassword: `
<p>Dear {{ email }},</p>
<p>
    We have received a request to reset the password for your account.
    If you made this request, please click on the link below or paste this into your browser to complete the process:
</p>
<a href="{{ resetLink }}">{{ resetLink }}</a>
<p>
    This link will work for 24 hours or until your password is reset.</p>
<p>
    If you did not ask to change your password, please ignore this email and your account will remain unchanged.
</p>
<p>
    If you have any questions or comments, please <a href="mailto:support@wowkeyb.gg" target="_top">contact
        us.</a>
</p>

Thanks,

<p>WOWKEYB Team</p>`,

  resetPasswordConfirm: `
<p>Dear
    {{ email }},</p>
<p>
    Your Password was successfully changed.
</p>
<p>
    If you didn’t make this request,
    <a href="mailto:support@wowkeyb.gg" target="_top">contact Us</a>
</p>`,

  changePassword: `
<p>Dear
    {{ email }},</p>
<p>
    Your Password was successfully changed.
</p>
<p>
    If you didn’t make this request,
    <a href="mailto:support@wowkeyb.gg" target="_top">contact Us</a>
</p>`
}
