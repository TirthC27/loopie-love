// WebGL Liquid Text Effect
function initLiquidEffect() {
    const canvas = document.getElementById('liquidTextCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const dpr = window.devicePixelRatio || 1;
    const textLines = ['New Crochet Drops,', 'Delivered to Your Inbox'];
    
    // Configuration
    const fontSize = 72 * dpr;
    const lineHeight = fontSize * 1.1;
    const padding = 40 * dpr;
    
    // Set canvas size
    const width = 900 * dpr;
    const height = (textLines.length * lineHeight) + (padding * 2);
    
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = (width / dpr) + 'px';
    canvas.style.height = (height / dpr) + 'px';

    // Get WebGL context
    let gl;
    try {
        gl = canvas.getContext('webgl', { premultipliedAlpha: false }) || 
             canvas.getContext('experimental-webgl', { premultipliedAlpha: false });
    } catch (e) {
        console.error('WebGL context creation failed:', e);
    }
    
    if (!gl) {
        console.error('WebGL not supported - falling back to static text');
        // Fallback: render static text
        const ctx2d = canvas.getContext('2d');
        ctx2d.fillStyle = '#1a1a1a';
        ctx2d.font = `800 ${fontSize}px Inter, sans-serif`;
        ctx2d.textAlign = 'center';
        ctx2d.textBaseline = 'middle';
        textLines.forEach((line, i) => {
            const y = padding + (i * lineHeight) + (lineHeight / 2);
            ctx2d.fillText(line, width / 2, y);
        });
        return;
    }

    // State
    const mouse = { x: -10, y: -10, active: false };
    const wake = [];
    let maskRadius = 0;
    let hovered = false;
    const startTime = Date.now();

    // Create text texture
    const textCanvas = document.createElement('canvas');
    textCanvas.width = width;
    textCanvas.height = height;
    const ctx = textCanvas.getContext('2d');
    
    ctx.fillStyle = '#1a1a1a';
    ctx.font = `800 ${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    textLines.forEach((line, i) => {
        const y = padding + (i * lineHeight) + (lineHeight / 2);
        ctx.fillText(line, width / 2, y);
    });

    // Shaders
    const vertexShaderSource = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision highp float;
        varying vec2 v_uv;
        uniform sampler2D u_image;
        uniform vec2 u_mouse;
        uniform float u_time;
        uniform float u_strength;
        uniform vec2 u_resolution;
        uniform float u_maskRadius;
        #define MAX_WAKE 16
        uniform int u_wakeCount;
        uniform vec3 u_wake[MAX_WAKE];

        void main() {
            vec2 uv = v_uv;
            
            // Wake ripples
            for (int i = 0; i < MAX_WAKE; ++i) {
                if (i >= u_wakeCount) break;
                vec2 w = u_wake[i].xy;
                float t = u_time - u_wake[i].z;
                float dist = distance(uv, w);
                float amp = exp(-dist * 16.0) * exp(-t * 1.2);
                float ripple = sin(32.0 * dist - t * 12.0) * 0.04;
                uv += normalize(uv - w) * ripple * u_strength * amp * 2.0;
            }
            
            // Live mouse ripple
            if (u_mouse.x >= 0.0 && u_mouse.x <= 1.0 && u_mouse.y >= 0.0 && u_mouse.y <= 1.0) {
                float dist = distance(uv, u_mouse);
                float ripple = sin(32.0 * dist - u_time * 12.0) * 0.04;
                float effect = exp(-dist * 12.0);
                uv += normalize(uv - u_mouse) * ripple * u_strength * effect * 2.0;
            }
            
            uv = clamp(uv, 0.0, 1.0);
            vec4 color = texture2D(u_image, uv);
            
            // Grayscale
            float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
            vec3 grayColor = vec3(gray);
            
            // Color reveal mask
            float mask = 0.0;
            if (u_mouse.x >= 0.0 && u_mouse.x <= 1.0 && u_mouse.y >= 0.0 && u_mouse.y <= 1.0 && u_maskRadius > 0.0) {
                float d = distance(uv, u_mouse);
                mask = max(mask, smoothstep(u_maskRadius, u_maskRadius * 0.7, d));
            }
            
            vec3 finalColor = mix(grayColor, color.rgb, mask);
            gl_FragColor = vec4(finalColor, color.a);
        }
    `;

    // Compile shader
    function createShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        return;
    }

    gl.useProgram(program);

    // Quad
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uStrength = gl.getUniformLocation(program, 'u_strength');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uWake = gl.getUniformLocation(program, 'u_wake');
    const uWakeCount = gl.getUniformLocation(program, 'u_wakeCount');
    const uMaskRadius = gl.getUniformLocation(program, 'u_maskRadius');

    // Texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);

    // Mouse events
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouse.x = Math.max(0, Math.min(1, x));
        mouse.y = Math.max(0, Math.min(1, y));
        mouse.active = true;
        hovered = true;
        
        const now = Date.now();
        wake.push({ x: mouse.x, y: mouse.y, t: now });
        if (wake.length > 8) wake.shift();
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.active = false;
        hovered = false;
    });

    // Animate mask radius
    let animStart = null;
    let maskFrom = 0;
    let maskTo = 0;
    let lastHovered = false;

    function animateMask(ts) {
        if (hovered !== lastHovered) {
            lastHovered = hovered;
            animStart = ts;
            maskFrom = maskRadius;
            maskTo = hovered ? 0.25 : 0;
        }
        
        if (animStart !== null) {
            const elapsed = Math.min((ts - animStart) / 650, 1);
            const eased = elapsed < 0.5 ? 4 * elapsed * elapsed * elapsed : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
            maskRadius = maskFrom + (maskTo - maskFrom) * eased;
        }
        
        requestAnimationFrame(animateMask);
    }
    requestAnimationFrame(animateMask);

    // Render loop
    function render() {
        gl.viewport(0, 0, width, height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const now = (Date.now() - startTime) / 1000;
        gl.uniform1f(uTime, now);

        const mx = mouse.active ? mouse.x : -10;
        const my = mouse.active ? 1 - mouse.y : -10;
        gl.uniform2f(uMouse, mx, my);

        gl.uniform1f(uStrength, 0.15);
        gl.uniform2f(uResolution, width, height);
        gl.uniform1f(uMaskRadius, maskRadius);

        // Wake data
        const nowMs = Date.now();
        const wakeData = new Float32Array(16 * 3);
        let count = 0;
        wake.forEach((w, i) => {
            wakeData[i * 3 + 0] = w.x;
            wakeData[i * 3 + 1] = 1 - w.y;
            wakeData[i * 3 + 2] = (w.t - startTime) / 1000;
            count++;
        });
        gl.uniform1i(uWakeCount, count);
        gl.uniform3fv(uWake, wakeData);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
    }
    
    render();
}

// Initialize on load
window.addEventListener('DOMContentLoaded', initLiquidEffect);

// Smooth scroll for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Update active state
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Scroll behavior
        if (targetId.startsWith('#')) {
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ===================================
// WAITLIST EMAIL SYSTEM
// ===================================

// API Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:4000'
    : 'https://loopie-love-backend.vercel.app';

const API_ENDPOINT = window.location.hostname === 'localhost'
    ? '/test-store'
    : '/api/waitlist';

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

// Show message to user
function showMessage(message, isSuccess = true) {
    const messageEl = document.getElementById('signupMessage');
    const inputWrapper = document.querySelector('.input-wrapper');
    
    messageEl.textContent = message;
    messageEl.style.color = isSuccess ? '#10b981' : '#ef4444';
    messageEl.style.opacity = '1';
    messageEl.style.marginTop = '1rem';
    messageEl.style.fontSize = '0.95rem';
    messageEl.style.fontWeight = '500';
    
    if (isSuccess) {
        inputWrapper.style.border = '2px solid #10b981';
        setTimeout(() => {
            inputWrapper.style.border = 'none';
        }, 3000);
    }
}

// Submit to waitlist
async function submitToWaitlist(email) {
    const btn = document.getElementById('waitlistBtn');
    const input = document.getElementById('waitlistEmail');
    
    // Disable button and show loading state
    btn.disabled = true;
    btn.textContent = 'Joining...';
    btn.style.opacity = '0.7';
    
    try {
        const response = await fetch(`${API_URL}${API_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success - show appropriate message
            if (data.alreadyExists) {
                showMessage("You're already part of the Loppi Circle 💗", true);
            } else {
                showMessage("You're in 💗 Welcome to the Loppi Circle", true);
            }
            input.value = '';
        } else {
            // Error from backend
            showMessage(data.error || 'Something went wrong. Please try again.', false);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Network error. Please check your connection.', false);
    } finally {
        // Re-enable button
        btn.disabled = false;
        btn.textContent = 'Join the Circle';
        btn.style.opacity = '1';
        
        // Clear message after 5 seconds
        setTimeout(() => {
            const messageEl = document.getElementById('signupMessage');
            messageEl.style.opacity = '0';
        }, 5000);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('waitlistEmail');
    const submitBtn = document.getElementById('waitlistBtn');
    
    if (submitBtn && emailInput) {
        submitBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            
            if (!email) {
                showMessage('Please enter your email address', false);
                return;
            }
            
            if (!validateEmail(email)) {
                showMessage('Please enter a valid email address', false);
                return;
            }
            
            submitToWaitlist(email);
        });
        
        // Allow Enter key to submit
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitBtn.click();
            }
        });
    }
});
