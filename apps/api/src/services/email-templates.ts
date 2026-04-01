interface ResetPasswordTemplateParams {
  userName: string;
  resetUrl: string;
}

export function getResetPasswordEmail({ userName, resetUrl }: ResetPasswordTemplateParams) {
  return {
    subject: 'Restablecer tu contrasena - RumboApp',
    html: `
      <h2>Hola ${userName},</h2>
      <p>Recibimos una solicitud para restablecer tu contrasena.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">Restablecer contrasena</a></p>
      <p>Si no solicitaste esto, puedes ignorar este correo.</p>
      <p>Este enlace expira en 1 hora.</p>
    `,
  };
}

interface VerifyEmailTemplateParams {
  userName: string;
  verifyUrl: string;
}

export function getVerifyEmailTemplate({ userName, verifyUrl }: VerifyEmailTemplateParams) {
  return {
    subject: 'Verifica tu email - RumboApp',
    html: `
      <h2>Bienvenido a RumboApp, ${userName}!</h2>
      <p>Verifica tu direccion de correo para empezar a usar la app.</p>
      <p><a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">Verificar email</a></p>
      <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
    `,
  };
}
