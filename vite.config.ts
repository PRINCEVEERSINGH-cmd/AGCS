import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// In-memory data store for the dev server
const dataStore = new Map<string, any>();
const otpStore = new Map<string, { code: string; expiresAt: number }>();
const alertLogs: any[] = [];
const WHATSAPP_ALERT_DESTINATION = '+917719445029';

function agcsApiPlugin(): Plugin {
  return {
    name: 'agcs-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, 'http://localhost');
        const pathname = url.pathname;
        const method = req.method;

        // Parse JSON body helper
        const getBody = (): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        const json = (statusCode: number, data: any) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        try {
          // 1. Send OTP
          if (pathname === '/api/auth/send-otp' && method === 'POST') {
            const body = await getBody();
            const phone = (body.phone || '').trim();
            if (!phone) return json(400, { error: 'Phone number required' });

            const code = Math.floor(1000 + Math.random() * 9000).toString();
            otpStore.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });

            // Check if login from different/new number -> trigger WhatsApp alert to +917719445029
            if (phone !== '+919876543210') {
              const alertMsg = `⚠️ AGCS Security Alert: New login OTP requested for mobile number ${phone} at ${new Date().toLocaleTimeString('en-IN')}`;
              alertLogs.unshift({
                id: 'alert-' + Date.now(),
                recipient: WHATSAPP_ALERT_DESTINATION,
                event: 'new_device_login',
                message: alertMsg,
                timestamp: new Date().toISOString(),
                status: 'delivered'
              });
            }

            return json(200, {
              success: true,
              message: `OTP sent to ${phone}`,
              demoCode: code
            });
          }

          // 2. Verify OTP
          if (pathname === '/api/auth/verify-otp' && method === 'POST') {
            const body = await getBody();
            const { phone, code } = body;
            const record = otpStore.get(phone);

            if (code === '1234' || (record && record.code === code)) {
              otpStore.delete(phone);
              const userData = dataStore.get(phone) || null;
              return json(200, {
                success: true,
                verified: true,
                phone,
                existingUser: !!userData,
                userData
              });
            }
            return json(400, {
              success: false,
              error: 'Invalid or expired OTP code. Use demo code 1234 or the generated code.'
            });
          }

          // 3. User Data by Mobile
          if (pathname.startsWith('/api/data/') && method === 'GET') {
            const phone = decodeURIComponent(pathname.replace('/api/data/', ''));
            const data = dataStore.get(phone) || null;
            return json(200, { success: true, data });
          }

          if (pathname.startsWith('/api/data/') && method === 'POST') {
            const phone = decodeURIComponent(pathname.replace('/api/data/', ''));
            const body = await getBody();
            dataStore.set(phone, { ...body, updatedAt: new Date().toISOString() });
            return json(200, { success: true, message: 'Saved successfully' });
          }

          // 4. WhatsApp Alerts
          if (pathname === '/api/alerts/whatsapp') {
            if (method === 'GET') {
              return json(200, { destination: WHATSAPP_ALERT_DESTINATION, alerts: alertLogs });
            }
            if (method === 'POST') {
              const body = await getBody();
              const alert = {
                id: 'alert-' + Date.now(),
                recipient: WHATSAPP_ALERT_DESTINATION,
                event: body.event || 'general_notification',
                message: body.message || `AGCS School Notification to ${WHATSAPP_ALERT_DESTINATION}`,
                timestamp: new Date().toISOString(),
                status: 'delivered'
              };
              alertLogs.unshift(alert);
              return json(200, { success: true, alert });
            }
          }

          // 5. AI Assistant & Leave Letter Drafter
          if (pathname === '/api/ai/coach' && method === 'POST') {
            const body = await getBody();
            const { type, studentName, reason, dates } = body;
            if (type === 'leave_letter') {
              const letter = `To,\nThe Principal,\nAkal Galaxy Convent School,\n\nSubject: Formal Application for Student Leave of Absence - ${studentName || 'Student'}\n\nRespected Ma'am / Sir,\n\nI am writing to formally request leave of absence for my child, ${studentName || 'Guransh Singh'} (Class 8-A), from ${dates || 'tomorrow'} due to ${reason || 'unavoidable health reasons'}.\n\nWe will ensure that all academic missed assignments and class notes are diligently covered upon return. Thank you for your kind consideration.\n\nWarm regards,\nParent / Guardian\nContact: ${WHATSAPP_ALERT_DESTINATION}`;
              return json(200, { success: true, content: letter });
            }

            const feedback = `🌟 AGCS Academic Advisor Report for ${studentName || 'Guransh'}:\n\n` +
              `1. Scholastic Standing: Scored 93.6% in Term 1 (Rank 3 in Class 8-A).\n` +
              `2. Core Strengths: Outstanding proficiency in Mathematics (98/100) and Punjabi (96/100).\n` +
              `3. Recommended Action: Dedicate 20 minutes daily to Social Science map reading and historical dates revision.\n` +
              `4. Attendance Consistency: 94.2% attendance record with zero unexplained leaves in October.`;
            return json(200, { success: true, content: feedback });
          }

          next();
        } catch (err: any) {
          json(500, { error: err.message });
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), agcsApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
