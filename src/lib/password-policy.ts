/**
 * Password Security Policy
 * 
 * Enforces strong passwords to prevent:
 * - Weak password attacks
 * - Dictionary attacks
 * - Common password usage
 */

// ============================================
// PASSWORD POLICY CONFIGURATION
// ============================================

export const PASSWORD_POLICY = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

// Common weak passwords (top 100 most common)
const COMMON_PASSWORDS = [
    'password', '123456', '12345678', 'qwerty', 'abc123',
    'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
    'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
    'bailey', 'passw0rd', 'shadow', '123123', '654321',
    'superman', 'qazwsx', 'michael', 'football', 'password1',
    'password123', 'welcome', 'jesus', 'ninja', 'mustang',
    'password2', 'amanda', 'summer', 'jordan', 'harley',
    'admin', 'admin123', 'root', 'toor', 'administrator',
];

// ============================================
// VALIDATION FUNCTIONS
// ============================================

export interface PasswordValidationResult {
    valid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong' | 'very_strong';
    score: number;
}

/**
 * Validate password against security policy
 */
export function validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];
    let score = 0;

    // Check minimum length
    if (password.length < PASSWORD_POLICY.minLength) {
        errors.push(`Password minimal ${PASSWORD_POLICY.minLength} karakter`);
    } else {
        score += 1;
    }

    // Check maximum length
    if (password.length > PASSWORD_POLICY.maxLength) {
        errors.push(`Password maksimal ${PASSWORD_POLICY.maxLength} karakter`);
    }

    // Check for uppercase
    if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password harus mengandung huruf kapital');
    } else if (/[A-Z]/.test(password)) {
        score += 1;
    }

    // Check for lowercase
    if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password harus mengandung huruf kecil');
    } else if (/[a-z]/.test(password)) {
        score += 1;
    }

    // Check for numbers
    if (PASSWORD_POLICY.requireNumbers && !/\d/.test(password)) {
        errors.push('Password harus mengandung angka');
    } else if (/\d/.test(password)) {
        score += 1;
    }

    // Check for special characters
    const specialCharRegex = new RegExp(`[${PASSWORD_POLICY.specialChars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`);
    if (PASSWORD_POLICY.requireSpecialChars && !specialCharRegex.test(password)) {
        errors.push(`Password harus mengandung karakter khusus (${PASSWORD_POLICY.specialChars})`);
    } else if (specialCharRegex.test(password)) {
        score += 1;
    }

    // Check for common passwords
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
        errors.push('Password terlalu umum, gunakan password yang lebih unik');
        score = 0;
    }

    // Check for sequential characters
    if (/(.)\1{2,}/.test(password)) {
        errors.push('Password tidak boleh mengandung karakter berulang (contoh: aaa)');
        score = Math.max(0, score - 1);
    }

    // Check for sequential numbers
    if (/012|123|234|345|456|567|678|789|890/.test(password)) {
        errors.push('Password tidak boleh mengandung angka berurutan');
        score = Math.max(0, score - 1);
    }

    // Bonus for length
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Determine strength
    let strength: PasswordValidationResult['strength'];
    if (score <= 2) strength = 'weak';
    else if (score <= 4) strength = 'medium';
    else if (score <= 6) strength = 'strong';
    else strength = 'very_strong';

    return {
        valid: errors.length === 0,
        errors,
        strength,
        score: Math.min(score, 7),
    };
}

/**
 * Get strength label in Indonesian
 */
export function getStrengthLabel(strength: PasswordValidationResult['strength']): string {
    const labels = {
        weak: 'Lemah',
        medium: 'Sedang',
        strong: 'Kuat',
        very_strong: 'Sangat Kuat',
    };
    return labels[strength];
}

/**
 * Get strength color for UI
 */
export function getStrengthColor(strength: PasswordValidationResult['strength']): string {
    const colors = {
        weak: '#ef4444',      // red
        medium: '#f59e0b',    // amber
        strong: '#22c55e',    // green
        very_strong: '#059669', // emerald
    };
    return colors[strength];
}
