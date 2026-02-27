import nodemailer from 'nodemailer';

// Инициализируем транспортер один раз
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Отправляет код активации на email пользователя
 * @param email - Email адрес получателя
 * @param code - Код активации (6 символов)
 * @throws {Error} Если отправка не удалась
 */
export async function sendActivationCode(
  email: string,
  code: string,
): Promise<void> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Код активации вашего аккаунта',
      html: `
        <h2>Активация аккаунта</h2>
        <p>Ваш код активации:</p>
        <h1 style="color: #007bff; letter-spacing: 5px; font-family: monospace;">
          ${code}
        </h1>
        <p>Код действителен в течение 5 минут.</p>
        <p>Если это были не вы, игнорируйте это письмо.</p>
      `,
      text: `Ваш код активации: ${code}\n\nКод действителен в течение 5 минут.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email отправлен:', info.response);
  } catch (error) {
    console.error('Ошибка при отправке email:', error);
    throw new Error(
      `Не удалось отправить код на email: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}

/**
 * Проверяет доступность SMTP сервера
 */
export async function verifyEmailConnection(): Promise<void> {
  try {
    await transporter.verify();
    console.log('SMTP соединение успешно установлено');
  } catch (error) {
    console.error('Ошибка подключения к SMTP серверу:', error);
    throw new Error(
      `Email сервис недоступен: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
