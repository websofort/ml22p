<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'msg' => 'Method not allowed.',
        'redirect_to' => '',
    ]);
    exit;
}

function respond(bool $success, string $message, string $redirectTo = ''): void
{
    echo json_encode([
        'success' => $success,
        'msg' => $message,
        'redirect_to' => $redirectTo,
    ]);
    exit;
}

// Honeypot field for basic spam protection.
if (!empty($_POST['_gotcha'])) {
    respond(true, 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.');
}

$email = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
if (!$email) {
    respond(false, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
}

$name = trim((string) ($_POST['name'] ?? ''));
$firstName = trim((string) ($_POST['first_name'] ?? ''));
$lastName = trim((string) ($_POST['last_name'] ?? ''));

if ($name === '' && ($firstName !== '' || $lastName !== '')) {
    $name = trim($firstName . ' ' . $lastName);
}

$message = trim((string) ($_POST['message'] ?? ''));
if ($message === '') {
    respond(false, 'Bitte geben Sie eine Nachricht ein.');
}

$to = 'info@ml22p.at';
$subject = trim((string) ($_POST['email_subject'] ?? ''));
if ($subject === '') {
    $subject = 'Neue Kontaktanfrage von ML22P';
}

$source = trim((string) ($_POST['source_link'] ?? ''));

$bodyLines = [
    'Name: ' . ($name !== '' ? $name : 'Nicht angegeben'),
    'E-Mail: ' . $email,
];

if ($source !== '') {
    $bodyLines[] = 'Quelle: ' . $source;
}

$bodyLines[] = '';
$bodyLines[] = 'Nachricht:';
$bodyLines[] = $message;

$body = implode("\n", $bodyLines);
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$headers = [
    'From: ML22P Kontaktformular <noreply@ml22p.at>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
];

$sent = mail($to, $encodedSubject, $body, implode("\r\n", $headers));

if ($sent) {
    respond(true, 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.');
}

respond(
    false,
    'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@ml22p.at.'
);
