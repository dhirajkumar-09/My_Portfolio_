import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const OWNER_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'dhirajku00021@gmail.com';

export const isEmailJSConfigured = Boolean(
  SERVICE_ID &&
  TEMPLATE_ID &&
  PUBLIC_KEY &&
  SERVICE_ID !== 'your_service_id'
);

export const sendNotificationEmail = async ({ name, email, subject, message }) => {
  if (isEmailJSConfigured) {
    try {
      const templateParams = {
        to_email: OWNER_EMAIL,
        from_name: name,
        from_email: email,
        subject: subject || `New Portfolio Message from ${name}`,
        message: message,
        reply_to: email,
        timestamp: new Date().toLocaleString()
      };

      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );
      return { success: true, result };
    } catch (err) {
      console.error('EmailJS sending failed:', err);
      // Return success false but allow form to proceed since Firestore recorded it
      return { success: false, error: err };
    }
  } else {
    // Simulated delivery for development/demo
    console.info(`[Email Service Simulated] Would send message to ${OWNER_EMAIL}:`, {
      from: `${name} <${email}>`,
      subject,
      message
    });
    return { success: true, simulated: true };
  }
};
