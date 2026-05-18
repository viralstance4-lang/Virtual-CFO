<?php
error_reporting(0);
ini_set('display_errors', '0');

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

// ── Gmail SMTP credentials ──────────────────────────────────
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'sanamaryam089@gmail.com');
define('SMTP_PASS', 'qklpxxoquyzoikvp');   // app-password spaces removed
define('MAIL_TO',   'viralstance@gmail.com');
// ────────────────────────────────────────────────────────────

/* ── Lightweight SMTP mailer ── */
function smtp_send_mail($to, $subject, $body, $reply_name, $reply_email) {
    $socket = @fsockopen('tcp://' . SMTP_HOST, SMTP_PORT, $errno, $errstr, 15);
    if (!$socket) return ['ok' => false, 'err' => "Connect failed: $errstr ($errno)"];

    // Read one SMTP response (handles multi-line 250- replies)
    $read = function () use ($socket) {
        $out = '';
        while ($line = fgets($socket, 512)) {
            $out .= $line;
            if ($line[3] === ' ') break;   // "250 " = end of response
        }
        return $out;
    };
    $write = function ($cmd) use ($socket, $read) {
        fwrite($socket, $cmd . "\r\n");
        return $read();
    };

    $read();                                              // greeting
    $write('EHLO localhost');
    $r = $write('STARTTLS');
    if (strpos($r, '220') === false) return ['ok' => false, 'err' => "STARTTLS: $r"];

    stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

    $write('EHLO localhost');
    $r = $write('AUTH LOGIN');
    if (strpos($r, '334') === false) return ['ok' => false, 'err' => "AUTH: $r"];

    $write(base64_encode(SMTP_USER));
    $r = $write(base64_encode(SMTP_PASS));
    if (strpos($r, '235') === false) return ['ok' => false, 'err' => "Login failed: $r"];

    $write('MAIL FROM: <' . SMTP_USER . '>');
    $write('RCPT TO: <' . $to . '>');
    $r = $write('DATA');
    if (strpos($r, '354') === false) return ['ok' => false, 'err' => "DATA: $r"];

    $msg  = "From: Virtual CFO Website <" . SMTP_USER . ">\r\n";
    $msg .= "To: $to\r\n";
    $msg .= "Reply-To: $reply_name <$reply_email>\r\n";
    $msg .= "Subject: $subject\r\n";
    $msg .= "MIME-Version: 1.0\r\n";
    $msg .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $msg .= "\r\n";
    $msg .= $body . "\r\n.";

    $r = $write($msg);
    $write('QUIT');
    fclose($socket);

    return strpos($r, '250') !== false
        ? ['ok' => true,  'err' => '']
        : ['ok' => false, 'err' => "Send failed: $r"];
}

/* ── Validate request ── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}

/* ── Collect inputs ── */
$name          = trim(strip_tags($_POST['name']          ?? ''));
$email         = trim(strip_tags($_POST['email']         ?? ''));
$phone         = trim(strip_tags($_POST['phone']         ?? ''));
$company       = trim(strip_tags($_POST['company']       ?? ''));
$business_size = trim(strip_tags($_POST['business_size'] ?? ''));
$message_body  = trim(strip_tags($_POST['message']       ?? ''));
$services      = (!empty($_POST['services']) && is_array($_POST['services']))
                 ? implode(', ', array_map('strip_tags', $_POST['services']))
                 : 'Not specified';

/* ── Validate ── */
if ($name === '' || $email === '' || $message_body === '') {
    echo json_encode(['success' => false, 'message' => 'Please fill all required fields (Name, Email, Message).']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

/* ── Build email body ── */
$subject = "New Enquiry from $name – Virtual CFO Website";
$body    = "New enquiry via Virtual CFO website:\r\n\r\n"
         . "Name:          $name\r\n"
         . "Email:         $email\r\n"
         . "Phone:         $phone\r\n"
         . "Company:       $company\r\n"
         . "Services:      $services\r\n"
         . "Business Size: $business_size\r\n\r\n"
         . "Message:\r\n$message_body\r\n";

/* ── Save to log (backup) ── */
$log = date('Y-m-d H:i:s') . " | $name | $email | $phone | $services | " . substr($message_body, 0, 200) . PHP_EOL;
@file_put_contents(__DIR__ . '/submissions.log', $log, FILE_APPEND | LOCK_EX);

/* ── Send via Gmail SMTP ── */
$result = smtp_send_mail(MAIL_TO, $subject, $body, $name, $email);

if ($result['ok']) {
    echo json_encode(['success' => true,  'message' => 'Thank you! Your message has been received. We will contact you within 24 hours.']);
} else {
    // Log the SMTP error for debugging
    @file_put_contents(__DIR__ . '/smtp_errors.log', date('Y-m-d H:i:s') . ' ' . $result['err'] . PHP_EOL, FILE_APPEND | LOCK_EX);
    echo json_encode(['success' => false, 'message' => 'Email delivery failed. Please WhatsApp us at +971 56 507 5253.']);
}
exit;
