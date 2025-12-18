// Vercel Serverless Function - Waitlist API
const admin = require('firebase-admin');

// Simple in-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute

function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];
    
    // Filter out old requests outside the time window
    const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
    
    if (recentRequests.length >= RATE_LIMIT_MAX) {
        return false; // Rate limit exceeded
    }
    
    // Add current request
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    
    // Clean up old entries periodically
    if (rateLimitMap.size > 1000) {
        for (const [key, value] of rateLimitMap.entries()) {
            if (value.every(time => now - time > RATE_LIMIT_WINDOW)) {
                rateLimitMap.delete(key);
            }
        }
    }
    
    return true;
}

// Initialize Firebase Admin (singleton pattern)
if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY
            ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            : undefined;

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
        });
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

const db = admin.firestore();

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Add contact to Brevo
async function addToBrevo(email, source) {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID;

    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
        console.error('Brevo credentials missing');
        return { success: false, error: 'Configuration error' };
    }

    try {
        const response = await fetch('https://api.brevo.com/v3/contacts', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'api-key': BREVO_API_KEY,
            },
            body: JSON.stringify({
                email: email,
                attributes: {
                    BRAND: 'loppi-love',
                    SOURCE: source,
                },
                listIds: [parseInt(BREVO_LIST_ID)],
                updateEnabled: true,
            }),
        });


    // Rate limiting
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     req.socket.remoteAddress || 
                     'unknown';
    
    if (!checkRateLimit(clientIp)) {
        return res.status(429).json({ 
            error: 'Too many requests. Please try again in a minute.' 
        });
    }
        const data = await response.json();

        if (response.ok || response.status === 400) {
            // 400 might mean contact already exists - still success
            return { success: true };
        }

        console.error('Brevo API error:', data);
        return { success: false, error: 'Email service error' };
    } catch (error) {
        console.error('Brevo request failed:', error);
        return { success: false, error: 'Email service unavailable' };
    }
}

// Main handler
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with your domain in production
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, source = 'unknown' } = req.body;

        // Validate email
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        const sanitizedEmail = email.toLowerCase().trim();

        // Check if email already exists in Firestore
        const usersRef = db.collection('waitlist_users');
        const existingUser = await usersRef.where('email', '==', sanitizedEmail).limit(1).get();

        if (!existingUser.empty) {
            // Email already exists - return success (don't reveal this to potential scrapers)
            return res.status(200).json({
                success: true,
                message: "You're already part of the Loppi Circle",
                alreadyExists: true,
            });
        }

        // Add to Firestore
        await usersRef.add({
            email: sanitizedEmail,
            source: source,
            brand: 'loppi-love',
            subscribed: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Add to Brevo (triggers Automation ID 1)
        const brevoResult = await addToBrevo(sanitizedEmail, source);

        if (!brevoResult.success) {
            // Log error but don't fail the request
            console.error('Brevo integration failed for:', sanitizedEmail);
        }

        // Return success
        return res.status(200).json({
            success: true,
            message: "You're in 💗 Welcome to the Loppi Circle",
            alreadyExists: false,
        });
    } catch (error) {
        console.error('Waitlist error:', error);
        return res.status(500).json({
            error: 'Something went wrong. Please try again.',
        });
    }
}
