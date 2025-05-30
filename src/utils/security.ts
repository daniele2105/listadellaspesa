// Utility per la sanitizzazione degli input
// Validazione più robusta
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/&/g, '&amp;')
    .trim();
};

// Validazione lunghezza e caratteri
export const isValidListName = (name: string): boolean => {
  const sanitized = sanitizeInput(name);
  return sanitized.length > 0 && sanitized.length <= 100 && 
         /^[a-zA-Z0-9\s\-_àèéìíîòóùúÀÈÉÌÍÎÒÓÙÚ]+$/.test(sanitized);
};

// Validazione prodotti
export const isValidProduct = (product: string): boolean => {
  const sanitized = sanitizeInput(product);
  return sanitized.length > 0 && sanitized.length <= 50;
};

// Rate limiting simulato
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (userId: string, maxRequests = 100, windowMs = 60000): boolean => {
  const now = Date.now();
  const userRequests = requestCounts.get(userId);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(userId, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userRequests.count >= maxRequests) {
    return false;
  }
  
  userRequests.count++;
  return true;
};

// Validazione email più robusta
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && 
         email.length <= 254 && 
         email.length >= 5 &&
         !email.includes('..');
};

// Validazione password sicura
export const isStrongPassword = (password: string): boolean => {
  return password.length >= 12 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /[0-9]/.test(password) &&
         /[!@#$%^&*(),.?":{}|<>]/.test(password);
};

// Prevenzione XSS
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};