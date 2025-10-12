# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability

We take the security of Dialectica AI seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: [security@yourdomain.com] (replace with your actual email)

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information along with your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

### Preferred Languages

We prefer all communications to be in English.

## Security Measures

### Current Security Features

- Input validation on all Socket.io events
- Room capacity limits to prevent abuse
- CORS configuration for API security
- Environment variable protection for sensitive data

### Best Practices for Contributors

When contributing to Dialectica AI, please keep security in mind:

1. **Input Validation**: Always validate and sanitize user inputs
2. **Authentication**: Properly handle authentication tokens and sessions
3. **SQL Injection**: Use Prisma ORM parameterized queries
4. **XSS Prevention**: Sanitize data before rendering in the frontend
5. **Dependency Security**: Keep dependencies updated and audit regularly
6. **Environment Variables**: Never commit sensitive data to the repository

### Regular Security Tasks

- Dependency vulnerability scanning with `npm audit`
- Regular updates of dependencies
- Code review for security issues
- Monitoring for unusual activity patterns

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any potential similar problems
3. Prepare fixes for all releases still under maintenance
4. Release new versions as soon as possible

## Comments on This Policy

If you have suggestions on how this process could be improved, please submit a pull request or file an issue.

## Recognition

We appreciate the security research community and will acknowledge security researchers who responsibly report vulnerabilities to us. With your permission, we will:

- Acknowledge your responsible disclosure
- Credit you in our security advisory (if desired)
- Keep you informed about the progress of fixing the issue

Thank you for helping keep Dialectica AI and our users safe!
