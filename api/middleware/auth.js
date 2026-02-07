// WebKurierSecurity/api/middleware/auth.js

/**
 * Authentication Middleware
 * Secure authentication for API access
 */

export class AuthMiddleware {
  constructor() {
    this.tokens = new Map();
    this.sessionStore = new Map();
    this.tokenExpiry = 3600000; // 1 hour
  }

  /**
   * Generate secure authentication token
   * @param {Object} userData - User data
   * @returns {string} Generated token
   */
  generateToken(userData) {
    const token = this.createSecureToken();
    const expiry = Date.now() + this.tokenExpiry;
    
    this.tokens.set(token, {
      ...userData,
      createdAt: Date.now(),
      expiresAt: expiry
    });
    
    return token;
  }

  /**
   * Verify authentication token
   * @param {string} token - Token to verify
   * @returns {Object|null} User data or null if invalid
   */
  verifyToken(token) {
    if (!token) return null;
    
    const tokenData = this.tokens.get(token);
    if (!tokenData) return null;
    
    if (Date.now() > tokenData.expiresAt) {
      this.tokens.delete(token); // Clean up expired token
      return null;
    }
    
    return tokenData;
  }

  /**
   * Create secure random token
   * @returns {string} Secure token
   */
  createSecureToken() {
    // In production, use crypto module for truly random tokens
    return `webkurier_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Middleware function for Express.js
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware function
   */
  middleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header'
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const userData = this.verifyToken(token);
    
    if (!userData) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }
    
    req.user = userData;
    next();
  }

  /**
   * Revoke token
   * @param {string} token - Token to revoke
   */
  revokeToken(token) {
    this.tokens.delete(token);
  }

  /**
   * Get active tokens count
   * @returns {number} Active tokens count
   */
  getActiveTokensCount() {
    // Clean up expired tokens first
    const now = Date.now();
    for (const [token, data] of this.tokens.entries()) {
      if (now > data.expiresAt) {
        this.tokens.delete(token);
      }
    }
    
    return this.tokens.size;
  }
}

export const authMiddleware = new AuthMiddleware();