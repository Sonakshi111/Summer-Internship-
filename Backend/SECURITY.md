# Secure Credentials Management

## Overview
This document explains how to securely manage credentials in this project.

## Credentials File
- Never commit real credentials to version control
- Use `credentials.template.json` as a template
- Create your actual credentials file as `credentials.json`
- Add `credentials.json` to your `.gitignore` file

## Security Best Practices
1. Never share your credentials with anyone
2. Keep your private key secure
3. Regularly rotate your credentials
4. Use environment variables for production deployments
5. Never commit the actual credentials.json file to version control

## Setup Instructions
1. Copy `credentials.template.json` to `credentials.json`
2. Fill in your actual credentials in `credentials.json`
3. Ensure `credentials.json` is in your `.gitignore` file
4. Delete the template file after copying if you don't need it anymore

## Environment Variables (Optional)
For additional security, consider using environment variables for:
- API keys
- Private keys
- Database credentials
- Passwords

Example:
```bash
# .env file (should also be in .gitignore)
API_KEY=your_api_key
PRIVATE_KEY=your_private_key
DB_PASSWORD=your_db_password
```

## Security Checks
- Verify your `.gitignore` file contains:
  - credentials.json
  - .env
- Never commit credentials to version control
- Regularly check for accidental commits of credentials
