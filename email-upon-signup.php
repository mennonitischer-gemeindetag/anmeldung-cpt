<?php
/**
 * Handle logic to send Emails to customers
 *
 * @package gemeindetage-anmeldung
 */

namespace gemeindetag\anmeldung;

add_action( 'save_post_anmeldung', __NAMESPACE__ . '\send_anmelde_emails', 10, 3 );
/**
 * send anmelde emails
 *
 * @param Integer $post_id    Post ID
 * @param Array   $post Post  Object
 * @param Bolean  $is_update  Weather or not it is an Update
 */
function send_anmelde_emails( $post_id, $post, $is_update ) {
	if ( ! $is_update ) {
		do_action( 'send_signup_mail', $post_id );
	}
}

add_action( 'updated_post_meta', __NAMESPACE__ . '\send_payment_success_emails', 10, 4 );
/**
 * send payment success email
 *
 * @param Integer $meta_id       Meta ID
 * @param Integer $post_id Post  Post ID
 * @param String  $meta_key      meta key
 * @param String  $meta_value    meta value
 */
function send_payment_success_emails( $meta_id, $post_id, $meta_key, $meta_value ) {

	if ( 'status' === $meta_key ) {
		$zahlungsbestaetigung_versand = get_post_meta( $post_id, 'zahlungsbestaetigung_versand', true );
		if ( 'bezahlt' === $meta_value && ! $zahlungsbestaetigung_versand ) {
			do_action( 'send_payment_success_email', $post_id );
		}
	}
}

add_action( 'send_signup_mail', __NAMESPACE__ . '\set_invoice_sent', 0, 1 );
/**
 * set invoice send meta field
 *
 * @param Integer $post_id ID of the post to update
 */
function set_invoice_sent( $post_id ) {
	update_post_meta( $post_id, 'rechnung_versand', true );
};

add_action( 'send_signup_mail', __NAMESPACE__ . '\send_signup_mail', 10, 1 );
/**
 * sending the signup email
 *
 * @param Integer $post_id ID of the post
 */
function send_signup_mail( $post_id ) {

	$invoice = get_invoice( $post_id );

	$email      = get_post_meta( $post_id, 'email', true );
	$invoice_id = $post_id;
	$vorname    = get_post_meta( $post_id, 'vorname', true );
	$nachname   = get_post_meta( $post_id, 'nachname', true );

	$to          = $email;
	$subject     = "Rechnung $invoice_id - Mennonitischer Gemeindetag 2023";
	$attachments = [ $invoice ];
	$body        = "<p>Hallo $vorname,\n \n</p>

	<p>herzlichen Dank für deine Anmeldung zum Gemeindetag 2023 in Neuwied. Im Anhang findest du die Rechnung mit der Auflistung aller von dir ausgewählten Veranstaltungen, an denen du teilnehmen möchtest. Bitte überweise den Betrag auf das in der Rechnung angegebene Konto. Deine Anmeldung wird mit Eingang des Rechnungsbetrages abgeschlossen. Hierüber erhältst du erneut eine Information.\n \n</p>

	<p>Bitte wende dich bei Rückfragen an folgende E.Mail-Adresse: <a href='mailto:gemeindetag@mennoniten.de'>gemeindetag@mennoniten.de</a> oder an 0 152 29388940.</p> 
	\n \n
	<p>Das AMG Gemeindetag 2023-Team wünscht viel Spaß.</p>";

	$headers[] = 'Content-Type: text/html; charset=UTF-8';
	$headers[] = 'Bcc: gemeindetag@mennoniten.de';
	$headers[] = 'From: Gemeindetag 2023 <gemeindetag@mennoniten.de>';

	return wp_mail( $to, $subject, $body, $headers, $attachments );

}

/**
 * get registration object
 *
 * @param int $registration_id registration post id
 */
function get_registration( $registration_id ) {
	$day_ids                     = get_post_meta( $registration_id, 'teilnahmetage', true );
	$workshops_ids               = get_post_meta( $registration_id, 'workshops', true );
	$trip_ids                    = get_post_meta( $registration_id, 'ausfluege', true );
	$food_ids                    = get_post_meta( $registration_id, 'verpflegung', true );
	$geb_datum                   = get_post_meta( $registration_id, 'geb_datum', true );
	$ermaessigt_adult            = get_post_meta( $registration_id, 'ermaessigt_adult', true );
	$vorname                     = get_post_meta( $registration_id, 'vorname', true );
	$nachname                    = get_post_meta( $registration_id, 'nachname', true );
	$street                      = get_post_meta( $registration_id, 'adresse_straße', true );
	$adresse_ort                 = get_post_meta( $registration_id, 'adresse_ort', true );
	$adresse_plz                 = get_post_meta( $registration_id, 'adresse_plz', true );
	$uebernachtung_and_breakfast = get_post_meta( $registration_id, 'uebernachtung_and_breakfast', true );

	$age               = intval( get_age( $geb_datum ) );
	$days              = get_days_by_ids( $day_ids, $age, $ermaessigt_adult );
	$workshops         = get_workshops_by_ids( $workshops_ids );
	$ausfluege         = get_trips_by_ids( $trip_ids );
	$food              = get_food_by_ids( $food_ids, $age );

	return [
		'id'                          => $registration_id,
		'day_ids'                     => $day_ids,
		'workshops_ids'               => $workshops_ids,
		'trip_ids'                    => $trip_ids,
		'food_ids'                    => $food_ids,
		'geb_datum'                   => $geb_datum,
		'ermaessigt_adult'            => $ermaessigt_adult,
		'vorname'                     => $vorname,
		'nachname'                    => $nachname,
		'street'                      => $street,
		'adresse_ort'                 => $adresse_ort,
		'adresse_plz'                 => $adresse_plz,
		'uebernachtung_and_breakfast' => $uebernachtung_and_breakfast,
		'age'                         => $age,
		'days'                        => $days,
		'workshops'                   => $workshops,
		'ausfluege'                   => $ausfluege,
		'food'                        => $food,
	];
}

/**
 * get days by ids
 *
 * @param array   $ids              array of ids
 * @param int     $age              age of the person
 * @param boolean $ermaessigt_adult whether the person gets a reduced price
 */
function get_days_by_ids( $ids, $age, $ermaessigt_adult ) {
	return $ids ? array_map(
		function( $id ) use ( $age, $ermaessigt_adult ) {
			return [
				'id'    => $id,
				'title' => get_the_title( $id ),
				'price' => get_price(
					$id,
					$age,
					$ermaessigt_adult
				),
			];
		},
		$ids
	) : [];
}

/**
 * get workshops by ids
 *
 * @param array $ids ids
 */
function get_workshops_by_ids( $ids ) {
	return $ids ? array_map(
		function( $id ) {
			$title     = get_the_title( $id );
			$meta_char = get_post_meta( $id, 'character', true );
			$character = $meta_char ? $meta_char : 'W';
			$number    = get_post_meta( $id, 'nr', true );

			return [
				'id'    => $id,
				'title' => "$character$number - $title",
				'price' => get_post_meta( $id, 'preis', true ),
			];
		},
		$ids
	) : [];
}

/**
 * get trips by ids
 *
 * @param array $ids ids
 */
function get_trips_by_ids( $ids ) {
	return $ids ? array_map(
		function( $id ) {
			$title     = get_the_title( $id );
			$meta_char = get_post_meta( $id, 'character', true );
			$character = $meta_char ? $meta_char : 'A';
			$number    = get_post_meta( $id, 'nr', true );

			return [
				'id'    => $id,
				'title' => "$character$number - $title",
				'price' => get_post_meta( $id, 'preis', true ),
			];
		},
		$ids
	) : [];
}

function get_food_price( $id, $age ) {
	$price = get_post_meta( $id, 'price', true );

	if ( $age < 13) {
		return intval( $price ) / 2;
	}

	return $price;
}

/**
 * get food by ids
 *
 * @param array $ids ids
 */
function get_food_by_ids( $ids, $age = 0 ) {
	return $ids ? array_map(
		function( $id ) {
			return [
				'id'    => $id,
				'nr'    => get_post_meta( $id, 'nr', true ),
				'title' => get_the_title( $id ),
				'price' => get_food_price( $id, $age ),
			];
		},
		$ids
	) : [];
}

/**
 * add prices together
 *
 * @param Integer $carry carry
 * @param Integer $item item
 */
function sum( $carry, $item ) {
	$carry += \floatval( $item['price'] );
	return $carry;
}

/**
 * get total price of registration
 *
 * @param array $registration registration object
 */
function get_total_price( $registration ) {
	$workshops_total = array_reduce( $registration['workshops'] ?? [], __NAMESPACE__ . '\sum', 0 );
	$trips_total     = array_reduce( $registration['ausfluege'] ?? [], __NAMESPACE__ . '\sum', 0 );
	$food_total      = array_reduce( $registration['food'] ?? [], __NAMESPACE__ . '\sum', 0 );
	$days_total      = array_reduce( $registration['days'] ?? [], __NAMESPACE__ . '\sum', 0 );

	$is_sleeping_on_site = $registration['uebernachtung_and_breakfast'] ?? false;

	if ( $is_sleeping_on_site ) {
		$days_total += 15;
	}

	return $workshops_total + $trips_total + $food_total + $days_total;
}

/**
 * get json data to send to pdf generator api
 *
 * @param array $registration registration object
 */
function get_registration_data_for_api( $registration ) {
	$data = [
		'id'                          => $registration['id'],
		'vorname'                     => $registration['vorname'],
		'nachname'                    => $registration['nachname'],
		'adresse_straße'              => $registration['street'],
		'adresse_ort'                 => $registration['adresse_ort'],
		'adresse_plz'                 => $registration['adresse_plz'],
		'teilnahmetage'               => $registration['days'],
		'workshops'                   => $registration['workshops'],
		'ausfluege'                   => $registration['ausfluege'],
		'verpflegung'                 => $registration['food'],
		'uebernachtung_and_breakfast' => $registration['uebernachtung_and_breakfast'] ? [
			'title' => 'Massenlager inkl. Frühstück von Freitag (28.04.2023) bis
			Montag (01.05.2023)',
			'price' => 15,
		] : null,
		'betrag'                      => get_total_price( $registration ),
	];

	return wp_json_encode( $data );
}

/**
 * get invoice pdf from api
 *
 * @param array $registration registration object
 */
function get_invoice_pdf_from_api( $registration ) {

	$url = 'http://invoice-generator.fabian-kaegy.com/invoice';

	$post_request_options = [
		'method'   => 'POST',
		'timeout'  => 100,
		'blocking' => true,
		'headers'  => [ 'Content-Type' => 'application/json' ],
		'body'     => get_registration_data_for_api( $registration ),
	];

	$response = wp_remote_post( $url, $post_request_options );
	if ( is_wp_error( $response ) ) {

		// log to sentry
		if ( function_exists( 'wp_sentry_safe' ) ) {
			wp_sentry_safe(
				function ( \Sentry\State\HubInterface $client ) use ( $response ) {
					$client->captureException( $response );
				}
			);
		}

		// try again once if it doesn't work
		$response = wp_remote_post( $url, $post_request_options );
	}

	$pdf_data = wp_remote_retrieve_body( $response );

	header( 'Content-type: application/pdf' );

	$registration_id = $registration['id'];

	$file_path = ABSPATH . "/invoices/rechnung-$registration_id.pdf";

	$file          = \fopen( $file_path, 'w' );
	$bites_written = file_put_contents( $file_path, $pdf_data );

	return $file_path;
}

/**
 * adds total price to registration post meta
 *
 * @param array $registration registration
 */
function add_total_price_to_registration( $registration ) {
	$total_price = get_total_price( $registration );
	add_post_meta( $registration['id'], 'betrag', $total_price, true );
}

/**
 * get the invoice from API
 *
 * @param Integer $registration_id ID of Post
 */
function get_invoice( $registration_id ) {
	$registration = get_registration( $registration_id );

	add_total_price_to_registration( $registration );
	return get_invoice_pdf_from_api( $registration );
}

/**
 * is date
 *
 * @param String $date date string
 */
function is_date( $date ) {
	return 1 === preg_match(
		'~^(((0[1-9]|[12]\\d|3[01])\\.(0[13578]|1[02])\\.((19|[2-9]\\d)\\d{2}))|((0[1-9]|[12]\\d|30)\\.(0[13456789]|1[012])\\.((19|[2-9]\\d)\\d{2}))|((0[1-9]|1\\d|2[0-8])\\.02\\.((19|[2-9]\\d)\\d{2}))|(29\\.02\\.((1[6-9]|[2-9]\\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$~',
		$date
	);
}

/**
 * calculates the Age
 *
 * @param String $geb_date dd.mm.yyyy
 * @throws WP_Error Error when not a Date
 */
function get_age( $geb_date ) {

	$is_valid_date = is_date( $geb_date );

	if ( ! $is_valid_date ) {
		error_log('Fehler im Geburtsdatum');
		return 'Fehler im Geburtsdatum';
	}

	$d1 = new \DateTime( $geb_date );
	$d2 = new \DateTime( '28.02.2023' );

	$diff = $d2->diff( $d1 );

	return $diff->y;

}

/**
 * gets the price of a given anmeldung
 *
 * @param Integer $post_id ID of Post
 * @param Integer $age Age
 * @param Boolean $ermaessigt_adult lower rate
 */
function get_price( $post_id, $age, $ermaessigt_adult = false ) {
	$key         = 'price_adult';
	$meta_values = get_post_meta( $post_id );

	if ( $age <= 18 || $ermaessigt_adult ) {
		$key = 'price_teen';
	}

	if ( $age <= 13 && $age >= 3 ) {
		$key = 'price_kid';
	}

	if ( $age < 3 ) {
		return 0;
	}

	return get_post_meta( $post_id, $key, true );
}

/**
 * calculate amount of late payment
 */
function get_late_payment_fee_amount() {

	// 2023 there is no late payment fee
	return 0;

	$first_stage  = new \DateTime( '01-03-2022' );
	$second_stage = new \DateTime( '15-04-2022' );
	$now          = new \DateTime();

	$fee = 0;

	if ( $first_stage < $now ) {
		$fee = 10;
	}
	if ( $second_stage < $now ) {
		$fee = 20;
	}

	return $fee;
}


add_action( 'send_payment_success_email', __NAMESPACE__ . '\send_payment_success_email', 10, 1 );
/**
 * send payment success email
 *
 * @param Integer $post_id ID of Post
 */
function send_payment_success_email( $post_id ) {

	$email      = get_post_meta( $post_id, 'email', true );
	$invoice_id = $post_id;
	$vorname    = get_post_meta( $post_id, 'vorname', true );
	$to         = $email;
	$headers[]  = 'Bcc: gemeindetag@mennoniten.de';
	$headers[]  = 'Content-Type: text/html; charset=UTF-8';
	$headers[]  = 'From: Gemeindetag 2023 <gemeindetag@mennoniten.de>';
	$subject    = 'Zahlungsbestätigung - Mennonitischer Gemeindetag 2023';
	$body       = "<p>Hallo $vorname,\n \n</p>

	<p>vielen Dank für die Überweisung von Rechnung $invoice_id\n \n</p>

	<p>Hiermit ist die Anmeldung zum Gemeindetag 2023 bestätigt. Wir freuen uns, Dich zum Gemeindetag in Neuwied begrüßen zu dürfen.</p>";

	return wp_mail( $to, $subject, $body, $headers );
}

add_action( 'send_payment_success_email', __NAMESPACE__ . '\set_payment_success', 15, 1 );
/**
 * set payment success meta field
 *
 * @param Integer $post_id ID of the post to update
 */
function set_payment_success( $post_id ) {
	$updated = update_post_meta( $post_id, 'zahlungsbestaetigung_versand', 'true' );
	return $updated;
};


add_action( 'send_email', __NAMESPACE__ . '\send_email', 15, 3 );

/**
 * send email
 *
 * @param Number $post_id ID of the anmeldung that the email should be send to
 * @param String $subject Subject of the mail
 * @param String $message Content of the mail
 */
function send_email( $post_id, $subject, $message ) {

	$email   = get_post_meta( $post_id, 'email', true );
	$vorname = get_post_meta( $post_id, 'vorname', true );

	$to           = $email;
	$headers[]    = 'Bcc: gemeindetag@mennoniten.de';
	$headers[]    = 'Content-Type: text/html; charset=UTF-8';
	$headers[]    = 'From: Gemeindetag 2023 <gemeindetag@mennoniten.de>';
	$mail_subject = "$subject - Mennonitischer Gemeindetag 2023";
	$body         = "<p>Hallo $vorname,\n \n</p> <p>$message</p>";

	return wp_mail( $to, $subject, $body, $headers );

};
