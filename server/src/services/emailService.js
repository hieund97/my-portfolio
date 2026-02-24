import nodemailer from 'nodemailer';

// Email transport configuration
const createTransport = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const templates = {
    contact: (data) => ({
        subject: `[Portfolio] New Contact Message: ${data.subject || 'No Subject'}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">New Contact Submission</h2>
                <div style="margin: 20px 0;">
                    <p><strong>From:</strong> ${data.name} (${data.email})</p>
                    <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-top: 10px; line-height: 1.6;">
                        <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
                    </div>
                </div>
                <p style="font-size: 12px; color: #64748b; margin-top: 30px; border-top: 1px solid #eee; pt: 10px;">
                    This message was sent from your portfolio website contact form.
                </p>
            </div>
        `
    }),
    quote: (data) => {
        // Parse the summary message if it's a quote
        const lines = data.message.split('\n');
        const rows = lines.map(line => {
            const [label, ...val] = line.split(':');
            if (!val.length) return '';
            return `<tr><td style="padding: 8px 0; font-weight: bold; width: 150px; color: #64748b;">${label.trim()}</td><td style="padding: 8px 0; color: #1e293b;">${val.join(':').trim()}</td></tr>`;
        }).join('');

        return {
            subject: `[Portfolio] Project Inquiry - ${data.name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">New Project Inquiry</h2>
                    <div style="margin: 20px 0;">
                        <p><strong>Client:</strong> ${data.name} (<a href="mailto:${data.email}">${data.email}</a>)</p>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            ${rows}
                        </table>
                    </div>
                    <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
                        <p style="margin: 0; font-size: 14px; color: #1e40af;">Check your admin dashboard for more details.</p>
                    </div>
                </div>
            `
        };
    }
};

export const sendAdminEmail = async (data) => {
    const adminEmail = process.env.ADMIN_EMAIL_ADDRESS;
    if (!adminEmail || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('Email config missing. Skipping admin notification.');
        return;
    }

    try {
        const transporter = createTransport();
        const isQuote = data.subject && data.subject.startsWith('Project Inquiry:');
        const template = isQuote ? templates.quote(data) : templates.contact(data);

        await transporter.sendMail({
            from: `"Portfolio Website" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            subject: template.subject,
            html: template.html,
        });

        console.log(`Email notification sent to ${adminEmail}`);
    } catch (error) {
        console.error('Error sending admin email:', error);
    }
};
