def get_missing_scraper_template(site):
    """Template for missing scraper configuration"""
    return f"""
    <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px;">
                <h3 style="color: #856404; margin: 0 0 10px 0;">Scraper Not Configured</h3>
                <p style="margin: 5px 0;"><strong>Source:</strong> {site}</p>
                <p style="margin: 5px 0; color: #666;">
                    No scraping functionality has been implemented for this news source yet.
                </p>
                <hr style="border: none; border-top: 1px solid #ffc107; margin: 10px 0;">
                <p style="margin: 5px 0; font-size: 12px; color: #856404;">
                    <strong>Action Required:</strong> Add custom scraper logic for this site in services.py
                </p>
            </div>
        </body>
    </html>
    """


def get_failed_scraper_template(site, error):
    """Template for scraping error"""
    return f"""
    <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; border-radius: 4px;">
                <h3 style="color: #721c24; margin: 0 0 10px 0;">Scraping Error Detected</h3>
                <p style="margin: 5px 0;"><strong>Source:</strong> {site}</p>
                <p style="margin: 5px 0;"><strong>Error:</strong> <code style="background: #f5c6cb; padding: 2px 6px; border-radius: 3px;">{str(error)}</code></p>
                <hr style="border: none; border-top: 1px solid #dc3545; margin: 10px 0;">
                <p style="margin: 5px 0; color: #721c24;">
                    <strong>Possible Causes:</strong>
                </p>
                <ul style="margin: 5px 0; padding-left: 20px; color: #666;">
                    <li>Website structure has changed</li>
                    <li>CSS selectors are outdated</li>
                    <li>Site is temporarily unavailable</li>
                    <li>Anti-scraping measures detected</li>
                </ul>
                <p style="margin: 10px 0 5px 0; font-size: 12px; color: #721c24;">
                    <strong>Action Required:</strong> Review and update scraper logic for {site}
                </p>
            </div>
        </body>
    </html>
    """


def get_welcome_email_template(username):
    """Template for welcome email to new users"""
    return f"""
    <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Welcome to Sentinel Digest, {username}!</h2>
            <p>Thank you for registering with us.</p>
            <p>Start exploring the latest news articles from trusted sources.</p>
            <a href="https://sentineldigest.com" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Get Started</a>
        </body>
    </html>
    """


def get_password_reset_email_template(reset_link):
    """Template for password reset email"""
    return f"""
    <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Click the link below:</p>
            <a href="{reset_link}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p><small>This link expires in 24 hours.</small></p>
        </body>
    </html>
    """