<?php
// Set content type to JSON
header('Content-Type: application/json');

// Load configuration
require 'config.php';

// Load PHPMailer
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Get form data (supports two form types: reservation & interest)
$formType = isset($_POST['formType']) ? trim($_POST['formType']) : 'reservation';

if ($formType === 'reservation') {
    $fullName = isset($_POST['fullName']) ? trim($_POST['fullName']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $date = isset($_POST['date']) ? trim($_POST['date']) : '';
    $interest = isset($_POST['interest']) ? trim($_POST['interest']) : '';
    $doctor = isset($_POST['doctor']) ? trim($_POST['doctor']) : '';
    $notes = isset($_POST['notes']) ? trim($_POST['notes']) : '';

    // Validate required fields for reservation
    if (empty($fullName) || empty($email) || empty($phone) || empty($date) || empty($interest)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'All reservation fields are required.']);
        exit;
    }

    $company_subject = 'Pash Medical Solutions - New Reservation';
    $company_body = prepare_company_email_reservation($fullName, $email, $phone, $date, $interest, $doctor, $notes);

} else {
    // interest form
    $fullName = isset($_POST['fullName']) ? trim($_POST['fullName']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $interests = isset($_POST['interests']) && is_array($_POST['interests']) ? $_POST['interests'] : [];
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    if (empty($fullName) || empty($email) || empty($interests)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please provide name, email and at least one interest.']);
        exit;
    }

    $interest_label = implode(', ', $interests);
    $company_subject = 'Pash Medical Solutions - New Interest Submission';
    $company_body = prepare_company_email_interest($fullName, $email, $interest_label, $message);
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address.'
    ]);
    exit;
}

try {
    // Send email to company (both recipients)
    $company_mail = new PHPMailer(true);
    $company_mail->isSMTP();
    $company_mail->Host = 'smtp.gmail.com';
    $company_mail->SMTPAuth = true;
    $company_mail->Username = GMAIL_EMAIL;
    $company_mail->Password = GMAIL_APP_PASSWORD;
    $company_mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $company_mail->Port = 587;

    $company_mail->setFrom(GMAIL_EMAIL, 'Contact Form - ' . COMPANY_NAME);
    
    // Add both recipients
    foreach (RECIPIENT_EMAILS as $recipient_email) {
        $company_mail->addAddress($recipient_email);
    }
    
    $company_mail->addReplyTo($email, $fullName);

    $company_mail->isHTML(true);
    // Subject/body are prepared earlier according to form type
    $company_mail->Subject = $company_subject;
    $company_mail->Body = $company_body;
    $company_mail->AltBody = strip_tags($company_body);

    $company_mail->send();

    // Send confirmation email to user
    $user_mail = new PHPMailer(true);
    $user_mail->isSMTP();
    $user_mail->Host = 'smtp.gmail.com';
    $user_mail->SMTPAuth = true;
    $user_mail->Username = GMAIL_EMAIL;
    $user_mail->Password = GMAIL_APP_PASSWORD;
    $user_mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $user_mail->Port = 587;

    $user_mail->setFrom(COMPANY_EMAIL, COMPANY_NAME);
    $user_mail->addAddress($email, $fullName);

    $user_mail->isHTML(true);
    $user_mail->Subject = 'Thank you for contacting Pash Medical Solutions the powerer of Pash Care!';
    $user_mail->Body = prepare_user_email($fullName);
    $user_mail->AltBody = strip_tags(prepare_user_email($fullName));

    $user_mail->send();

    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We will contact you soon.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send email: ' . $e->getMessage()
    ]);
}

// Function to prepare company email
function prepare_company_email($fullName, $email, $interest, $message) {
    // legacy/generic handler (kept for compatibility) - delegates to interest template
    return prepare_company_email_interest($fullName, $email, $interest, $message);
}

// Reservation email builder
function prepare_company_email_reservation($fullName, $email, $phone, $date, $service, $doctor, $notes) {
    $fullName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $phone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
    $date = htmlspecialchars($date, ENT_QUOTES, 'UTF-8');
    $service = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
    $doctor = htmlspecialchars($doctor, ENT_QUOTES, 'UTF-8');
    $notes = htmlspecialchars($notes, ENT_QUOTES, 'UTF-8');
    $notes = nl2br($notes);

    return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: 'Open Sans', Arial, sans-serif; color: #2d3748; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #1b5e20 0%, #388e3c 100%); color: white; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px; }
        .content { background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .field { margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; }
        .label { font-weight: 600; color: #1b5e20; margin-bottom: 5px; }
        .value { color: #555; word-break: break-word; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Reservation Request</h2>
            <p>A user submitted a reservation via the website.</p>
        </div>
        <div class='content'>
            <div class='field'><div class='label'>Full Name</div><div class='value'>{$fullName}</div></div>
            <div class='field'><div class='label'>Email</div><div class='value'><a href='mailto:{$email}'>{$email}</a></div></div>
            <div class='field'><div class='label'>Phone</div><div class='value'>{$phone}</div></div>
            <div class='field'><div class='label'>Reservation Date</div><div class='value'>{$date}</div></div>
            <div class='field'><div class='label'>Service</div><div class='value'>{$service}</div></div>
            <div class='field'><div class='label'>Selected Doctor</div><div class='value'>{$doctor}</div></div>
            <div class='field'><div class='label'>Notes</div><div class='value'>{$notes}</div></div>
        </div>
        <div class='footer'><p>This is an automated email from your contact form.</p></div>
    </div>
</body>
</html>
HTML;
}

// Interest email builder
function prepare_company_email_interest($fullName, $email, $interest_label, $message) {
    $fullName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $interest_label = htmlspecialchars($interest_label, ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $message = nl2br($message);

    return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: 'Open Sans', Arial, sans-serif; color: #2d3748; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #1b5e20 0%, #388e3c 100%); color: white; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px; }
        .content { background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .field { margin-bottom: 15px; border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; }
        .label { font-weight: 600; color: #1b5e20; margin-bottom: 5px; }
        .value { color: #555; word-break: break-word; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Interest Submission</h2>
            <p>A visitor expressed interest via the website.</p>
        </div>
        <div class='content'>
            <div class='field'><div class='label'>Full Name</div><div class='value'>{$fullName}</div></div>
            <div class='field'><div class='label'>Email</div><div class='value'><a href='mailto:{$email}'>{$email}</a></div></div>
            <div class='field'><div class='label'>Interests</div><div class='value'>{$interest_label}</div></div>
            <div class='field'><div class='label'>Message</div><div class='value'>{$message}</div></div>
        </div>
        <div class='footer'><p>This is an automated email from your contact form.</p></div>
    </div>
</body>
</html>
HTML;
}

// Function to prepare user confirmation email
function prepare_user_email($fullName) {
    $fullName = htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8');

    return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: 'Open Sans', Arial, sans-serif; color: #2d3748; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }
        .header { background: linear-gradient(135deg, #1b5e20 0%, #388e3c 100%); color: white; padding: 20px; border-radius: 5px; text-align: center; margin-bottom: 20px; }
        .content { background-color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .footer { text-align: center; color: #999; font-size: 12px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Thank You, {$fullName}!</h2>
        </div>
        
        <div class='content'>
            <p>Thank you for reaching out to Pash Care. We have received your message and will get back to you as soon as possible.</p>
            
            <p>Our team will review your inquiry and contact you within 24-48 hours.</p>
            
            <p>Best regards,<br><strong>Pash Medical Solutions Team</strong></p>
        </div>
        
        <div class='footer'>
            <p>&copy; 2025 Pash Medical Solutions. All rights reserved.</p>
            <p><a href='https://pashmedinnov.com'>Visit our website</a></p>
        </div>
    </div>
</body>
</html>
HTML;
}
?>
