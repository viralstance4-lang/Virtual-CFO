<?php
echo json_encode([
    'php_version' => PHP_VERSION,
    'server'      => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
    'mail_enabled'=> function_exists('mail'),
    'log_writable'=> is_writable(__DIR__),
    'status'      => 'PHP is working correctly'
]);
