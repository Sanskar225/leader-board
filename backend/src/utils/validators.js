const validator = require('validator');

const validateUsername = (username) => {
    if (!username || username.length < 3 || username.length > 30) {
        return 'Username must be between 3 and 30 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
};

const validateEmail = (email) => {
    if (!email || !validator.isEmail(email)) {
        return 'Please provide a valid email address';
    }
    return null;
};

const validatePassword = (password) => {
    if (!password || password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    return null;
};

const validateGitHubUsername = (username) => {
    if (!username) return null;
    
    if (username.length > 39) {
        return 'GitHub username cannot exceed 39 characters';
    }
    if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9]))*$/.test(username)) {
        return 'Invalid GitHub username format';
    }
    return null;
};

const validateLeetCodeUsername = (username) => {
    if (!username) return null;
    
    if (username.length > 50) {
        return 'LeetCode username cannot exceed 50 characters';
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
        return 'Invalid LeetCode username format';
    }
    return null;
};

module.exports = {
    validateUsername,
    validateEmail,
    validatePassword,
    validateGitHubUsername,
    validateLeetCodeUsername
};