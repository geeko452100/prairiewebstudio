import cors from 'cors';
import express from 'express';
import { Resend } from 'resend';

const app = express();
const port = Number(process.env.PORT) || 3000;

const contactTo = process.env.CONTACT_TO || 'ggriffith@snapload-digital.com';
const fromEmail = process.env.FROM_EMAIL || 'Snap Load Digital <contact@snapload-digital.com>';
const resendApiKey = process.env.RESEND_API_KEY;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const planLabels = {
  ownership: 'Own It Outright — 2 × $750 + care ($150/yr or $12.50/mo)',
  subscription: 'Launch & Support — 2 × $249 + support ($150/yr or $12.50/mo)',
  unsure: 'Not sure yet',
};

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitize(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.length === 0) return true;
  return allowedOrigins.includes(origin);
}

app.use(express.json({ limit: '32kb' }));

app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['POST', 'OPTIONS'],
  })
);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  if (!resend) {
    res.status(503).json({ error: 'Email service is not configured.' });
    return;
  }

  const { name, email, plan, message, 'bot-field': botField } = req.body || {};

  if (botField) {
    res.status(200).json({ ok: true });
    return;
  }

  const cleanName = sanitize(name, 100);
  const cleanEmail = sanitize(email, 254);
  const cleanPlan = sanitize(plan, 32);
  const cleanMessage = sanitize(message, 2000);

  if (cleanName.length < 2) {
    res.status(400).json({ error: 'Please enter your full name.' });
    return;
  }

  if (!isValidEmail(cleanEmail)) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(planLabels, cleanPlan)) {
    res.status(400).json({ error: 'Please choose a plan option.' });
    return;
  }

  if (cleanMessage.length < 10) {
    res.status(400).json({ error: 'Please include a brief message.' });
    return;
  }

  const planLabel = planLabels[cleanPlan];
  const subject = `New contact form — ${cleanName}`;
  const text = [
    'New message from snapload-digital.com',
    '',
    `Name: ${cleanName}`,
    `Email: ${cleanEmail}`,
    `Preferred plan: ${planLabel}`,
    '',
    'Message:',
    cleanMessage,
  ].join('\n');

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [contactTo],
      replyTo: cleanEmail,
      subject,
      text,
    });

    if (error) {
      console.error('Resend error:', error);
      res.status(502).json({ error: 'Unable to send message right now.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Unable to send message right now.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Contact API listening on port ${port}`);
});
