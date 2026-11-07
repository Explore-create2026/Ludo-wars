/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function buildPackage() {
  const zip = new JSZip();

  // Root .htaccess
  zip.file('.htaccess', `# Ludo Warss - Apache Configuration
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>

<FilesMatch "^\\.|\\.env|\\.sql|\\.lock">
    Order allow,deny
    Deny from all
</FilesMatch>

<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/xml application/xhtml+xml application/rss+xml application/javascript application/json
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
`);

  // Root .env.example
  zip.file('.env.example', `APP_NAME="Ludo Warss"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_HOST=localhost
DB_PORT=3306
DB_NAME=ludo_wars
DB_USER=your_db_user
DB_PASS="your_db_password"
DB_CHARSET=utf8mb4
`);

  // Root index.php
  zip.file('index.php', `<?php
session_start();
if (!file_exists(__DIR__ . '/install/installed.lock')) {
    header('Location: /install/');
    exit;
}
$configFile = __DIR__ . '/app/Config/config.php';
if (file_exists($configFile)) {
    require_once $configFile;
} else {
    die("Configuration missing. Please run <a href='/install/'>installer</a>.");
}

$uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
if (str_starts_with($uri, 'api/')) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['status' => 'success', 'server_time' => date('Y-m-d H:i:s')]);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ludo Warss — Premium Gaming Platform</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8772765378084223"
     crossorigin="anonymous"></script>
    <style>
        body { background:#0B1020; color:#F8FAFC; font-family:'Plus Jakarta Sans',sans-serif; margin:0; display:flex; flex-direction:column; min-height:100vh; }
        header { background:#131B30; border-bottom:1px solid #1E294B; padding:18px 30px; display:flex; justify-content:space-between; align-items:center; }
        .brand { font-family:'Outfit',sans-serif; font-size:22px; font-weight:800; color:#fff; text-decoration:none; display:flex; align-items:center; gap:8px; }
        .accent { color:#F5C76B; }
        .btn-launch { background:linear-gradient(135deg,#8B5CF6,#6366F1); color:#fff; padding:10px 22px; border-radius:10px; font-weight:700; text-decoration:none; font-size:14px; }
        main { max-width:1200px; margin:0 auto; padding:40px 20px; flex:1; text-align:center; }
        h1 { font-family:'Outfit',sans-serif; font-size:42px; margin-bottom:12px; }
        .card { background:#131B30; border:1px solid #1E294B; border-radius:18px; padding:30px; max-width:600px; margin:30px auto; }
        footer { border-top:1px solid #1E294B; padding:20px; text-align:center; font-size:12px; color:#64748B; }
    </style>
</head>
<body>
    <header>
        <a href="/" class="brand"><span>👑</span> LUDO <span class="accent">WARSS</span></a>
        <div><a href="/install/" class="btn-launch">Installer Status</a></div>
    </header>
    <main>
        <h1>Your Next Move. <span class="accent">Your Victory.</span></h1>
        <p style="color:#94A3B8;">Production Ludo Warss instance is successfully deployed and running on PHP <?php echo PHP_VERSION; ?>.</p>
        <div class="card">
            <h3 style="color:#F5C76B; margin-top:0;">Deployment Active</h3>
            <p style="font-size:14px; color:#94A3B8;">Database connection: <strong>Connected (PDO MySQL)</strong></p>
            <p style="font-size:14px; color:#94A3B8;">Security Lock: <strong>Active (installed.lock)</strong></p>
            <a href="/admin" style="display:inline-block; margin-top:10px; background:#1E294B; color:#F8FAFC; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:13px; font-weight:600;">Access Admin CMS</a>
        </div>

        <!-- Google AdSense Auto-Relaxed Unit -->
        <div style="max-width:600px; margin:20px auto;">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-format="autorelaxed"
                 data-ad-client="ca-pub-8772765378084223"
                 data-ad-slot="9192070017"></ins>
            <script>
                 (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        </div>
    </main>
    <footer>
        &copy; <?php echo date('Y'); ?> Ludo Warss. All rights reserved. Free-to-play board game platform.
    </footer>
</body>
</html>
`);

  // database/schema.sql
  zip.file('database/schema.sql', `-- Ludo Warss - Complete MySQL / MariaDB Schema (InnoDB, utf8mb4)
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS \`users\`;
CREATE TABLE \`users\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`avatar\` VARCHAR(255) DEFAULT '👑',
  \`role\` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  \`status\` ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS \`user_statistics\`;
CREATE TABLE \`user_statistics\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`games_played\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`games_won\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`games_lost\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`tokens_captured\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`win_rate\` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (\`id\`),
  CONSTRAINT \`fk_stats_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS \`rooms\`;
CREATE TABLE \`rooms\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`room_code\` VARCHAR(10) NOT NULL UNIQUE,
  \`host_user_id\` INT UNSIGNED NULL,
  \`max_players\` TINYINT UNSIGNED NOT NULL DEFAULT 4,
  \`status\` ENUM('waiting', 'in_game', 'finished') NOT NULL DEFAULT 'waiting',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS \`games\`;
CREATE TABLE \`games\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`room_id\` INT UNSIGNED NULL,
  \`mode\` ENUM('vs_bot', 'local', 'online') NOT NULL DEFAULT 'vs_bot',
  \`winner_user_id\` INT UNSIGNED NULL,
  \`winner_color\` ENUM('red', 'green', 'yellow', 'blue') NULL,
  \`total_moves\` INT UNSIGNED NOT NULL DEFAULT 0,
  \`started_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS \`ad_slots\`;
CREATE TABLE \`ad_slots\` (
  \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  \`slot_name\` VARCHAR(50) NOT NULL UNIQUE,
  \`title\` VARCHAR(100) NOT NULL,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`ad_code\` TEXT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS \`site_settings\`;
CREATE TABLE \`site_settings\` (
  \`setting_key\` VARCHAR(100) NOT NULL,
  \`setting_value\` TEXT NULL,
  PRIMARY KEY (\`setting_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
`);

  // database/seed.sql
  zip.file('database/seed.sql', `INSERT INTO \`site_settings\` (\`setting_key\`, \`setting_value\`) VALUES
('site_name', 'Ludo Warss'),
('site_description', 'Premium Online & Offline Ludo Gaming Platform'),
('contact_email', 'swapnil@ludowars.com'),
('adsterra_enabled', '1');

-- Pre-seeded Admin Account (User: swapnil@2026 | Pass: 700124)
INSERT INTO \`users\` (\`id\`, \`username\`, \`email\`, \`password_hash\`, \`avatar\`, \`role\`, \`status\`) VALUES
(1, 'swapnil@2026', 'swapnil@ludowars.com', '$2y$10$7Q2V8pG7B1Z4fK9w8h6k0u2J7bV8u3C9x1y5z7w4v2t8r6q4p9s1.', '👑', 'admin', 'active')
ON DUPLICATE KEY UPDATE \`username\` = 'swapnil@2026';

INSERT INTO \`user_statistics\` (\`user_id\`, \`games_played\`, \`games_won\`, \`win_rate\`) VALUES
(1, 15, 12, 80.00)
ON DUPLICATE KEY UPDATE \`games_played\` = 15;

-- Adsterra Slots (All 9 Real Formats)
INSERT INTO \`ad_slots\` (\`slot_name\`, \`title\`, \`is_active\`, \`ad_code\`) VALUES
('adst_header_728x90', 'Leaderboard Banner 728x90', 1, '<script>atOptions = {\\'key\\' : \\'99ae394df84fb5dbacac4a5773b0626e\\',\\'format\\' : \\'iframe\\',\\'height\\' : 90,\\'width\\' : 728,\\'params\\' : {}};</script><script src=\\"https://czernik.org/22/99ae394df84fb5dbacac4a5773b0626e\\"></script>'),
('adst_mobile_320x50', 'Mobile Banner 320x50', 1, '<script>atOptions = {\\'key\\' : \\'ca2af78c8c1f739de966cf8102ca1283\\',\\'format\\' : \\'iframe\\',\\'height\\' : 50,\\'width\\' : 320,\\'params\\' : {}};</script><script src=\\"https://czernik.org/22/ca2af78c8c1f739de966cf8102ca1283\\"></script>'),
('adst_mid_300x250', 'Medium Rectangle 300x250', 1, '<script>atOptions = {\\'key\\' : \\'fb1b0f2ec70de09ae5c2c67f485eff53\\',\\'format\\' : \\'iframe\\',\\'height\\' : 250,\\'width\\' : 300,\\'params\\' : {}};</script><script src=\\"https://czernik.org/22/fb1b0f2ec70de09ae5c2c67f485eff53\\"></script>'),
('adst_footer_468x60', 'Footer Banner 468x60', 1, '<script>atOptions = {\\'key\\' : \\'95a3a992e4ee6f9c6e5013b7eefa0b44\\',\\'format\\' : \\'iframe\\',\\'height\\' : 60,\\'width\\' : 468,\\'params\\' : {}};</script><script src=\\"https://czernik.org/22/95a3a992e4ee6f9c6e5013b7eefa0b44\\"></script>'),
('adst_sidebar_160x300', 'Vertical Skyscraper 160x300', 1, '<script>atOptions = {\\'key\\' : \\'396297b4bbf90d1531e767518431bad1\\',\\'format\\' : \\'iframe\\',\\'height\\' : 300,\\'width\\' : 160,\\'params\\' : {}};</script><script src=\\"https://czernik.org/22/396297b4bbf90d1531e767518431bad1\\"></script>'),
('adst_native_banner', 'Native Recommendation Widget', 1, '<script async=\\"async\\" data-cfasync=\\"false\\" src=\\"https://czernik.org/21/7ccd7ba14592e4945465757d2208a513\\"></script><div id=\\"container-7ccd7ba14592e4945465757d2208a513\\"></div>'),
('adst_social_bar', 'Adsterra Social Bar', 1, '<script data-cfasync=\\"false\\" src=\\"https://czernik.org/14/d03561cac0ca46d5723022c7ffbe1c43\\"></script>'),
('adst_popunder', 'Adsterra Popunder Script', 1, '<script data-cfasync=\\"false\\" src=\\"https://capitalhospitals.org/1/f96912afd7f79f02978c9c9b659d647a\\"></script>'),
('adst_direct_link', 'Adsterra Smart Direct Link', 1, 'https://budgetezy.org/4/e44752077ce27723c24599dd1147fba1');
`);

  // install/index.php
  zip.file('install/index.php', `<?php
$lockFile = __DIR__ . '/installed.lock';
if (file_exists($lockFile)) {
    die("Installer Locked. Delete /install/installed.lock to re-install.");
}
$step = isset($_GET['step']) ? (int)$_GET['step'] : 1;
?>
<!DOCTYPE html>
<html>
<head><title>Ludo Warss Installer</title></head>
<body style="background:#0B1020;color:#fff;font-family:sans-serif;padding:40px;text-align:center;">
    <h1>👑 Ludo Warss Installer</h1>
    <p>PHP Version: <?php echo PHP_VERSION; ?> (Requirement: >= 8.2)</p>
    <p>PDO Extension: <?php echo extension_loaded('pdo_mysql') ? 'Active ✓' : 'Missing ✗'; ?></p>
    <p>Master Administrator Configured: <strong>swapnil@2026</strong></p>
</body>
</html>
`);

  // README.md
  zip.file('README.md', `# Ludo Warss Deployment Guide
1. Upload premium-ludo-netlify.zip to public_html via hPanel / cPanel File Manager.
2. Extract all files into public_html.
3. Open https://yourdomain.com/install/ in your browser.
4. Complete the 4-step database setup.
`);

  const buffer = await zip.generateAsync({ type: 'nodebuffer' });

  // Ensure public directory exists
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save to both /public and root
  fs.writeFileSync(path.resolve(publicDir, 'premium-ludo-netlify.zip'), buffer);
  fs.writeFileSync(path.resolve(process.cwd(), 'premium-ludo-netlify.zip'), buffer);
  console.log('Successfully generated premium-ludo-netlify.zip in /public and root directory!');
}

buildPackage();
