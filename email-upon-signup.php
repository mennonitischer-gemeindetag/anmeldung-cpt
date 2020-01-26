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
		send_signup_mail( $post_id );
		update_post_meta( $post_id, 'rechnung_versand', 1 );
	}

	$status                       = $post->status;
	$zahlungsbestaetigung_versand = $post->zahlungsbestaetigung_versand;

	if ( $is_update && 'bezahlt' === $status && ! $zahlungsbestaetigung_versand ) {
		send_payment_success_email( $post_id );
		update_post_meta( $post_id, 'zahlungsbestaetigung_versand', 1 );
	}
}

/**
 * sending the signup email
 *
 * @param Integer $post_id ID of the post
 */
function send_signup_mail( $post_id ) {

	$incoive = get_invoice( $post_id );

	$email        = get_post_meta( $post_id, 'email', true );
	$rechnungs_id = $post_id;
	$vorname      = get_post_meta( $post_id, 'vorname', true );
	$nachname     = get_post_meta( $post_id, 'nachname', true );

	$to          = $email;
	$subject     = "Rechnung $rechnungs_id - Mennonitischer Gemeindetag 2020";
	$attachments = [ $incoive ];
	$body        = "<p>Hallo $vorname,\n \n</p>

	<p>herzlichen Dank für deine Anmeldung zum Gemeindetag 2020 auf dem Weierhof. Im Anhang findest du die Rechnung mit der Auflistung aller von dir ausgewählten Veranstaltungen, an denen du teilnehmen möchtest. Bitte überweise den Betrag auf das in der Rechnung angegebene Konto. Deine Anmeldung wird mit Eingang des Rechnungsbetrages abgeschlossen. Hierüber erhältst du erneut eine Information.\n \n</p>

	<p>Bitte wende dich bei Rückfragen an folgende E.Mail-Adresse: <a href='mailto:gemeindetag@mennoniten.de'>gemeindetag@mennoniten.de</a> oder an 0 152 29388940.</p> 
	\n \n
	<p>Das AMG Gemeindetag 2020-Team wünscht viel Spaß.</p>";

	$headers[] = 'Content-Type: text/html; charset=UTF-8';
	$headers[] = 'From: Gemeindetag 2020 <gemeindetag@mennoniten.de>';

	return wp_mail( $to, $subject, $body, $headers, $attachments );

}

/**
 * get the invoice from API
 *
 * @param Integer $post_id ID of Post
 */
function get_invoice( $post_id ) {

	$teilnahmetage_ids = get_post_meta( $post_id, 'teilnahmetage', true );
	$workshops_ids     = get_post_meta( $post_id, 'workshops', true );
	$ausfluege_ids     = get_post_meta( $post_id, 'ausfluege', true );
	$verpflegung_ids   = get_post_meta( $post_id, 'verpflegung', true );
	$age               = get_age( get_post_meta( $post_id, 'geb_datum', true ) );
	$ermaessigt_adult  = get_post_meta( $post_id, 'ermaessigt_adult', true );
	$is_free_kids_meal = $age <= 9;

	$teilnametage = $teilnahmetage_ids ? array_map(
		function( $teilnahmetag_id ) use ( $age, $ermaessigt_adult ) {
			return [
				'id'    => $teilnahmetag_id,
				'title' => get_the_title( $teilnahmetag_id ),
				'price' => get_price(
					$teilnahmetag_id,
					$age,
					$ermaessigt_adult
				),
			];
		},
		$teilnahmetage_ids
	) : [];

	$workshops = $workshops_ids ? array_map(
		function( $workshop_id ) {
			$title     = get_the_title( $workshop_id );
			$meta_char = get_post_meta( $workshop_id, 'character', true );
			$character = $meta_char ? $meta_char : 'W';
			$number    = get_post_meta( $workshop_id, 'nr', true );

			return [
				'id'    => $workshop_id,
				'title' => "$character$number - $title",
				'price' => get_post_meta( $workshop_id, 'preis', true ),
			];
		},
		$workshops_ids
	) : [];

	$ausfluege = $ausfluege_ids ? array_map(
		function( $ausflug_id ) {
			$title     = get_the_title( $ausflug_id );
			$meta_char = get_post_meta( $ausflug_id, 'character', true );
			$character = $meta_char ? $meta_char : 'A';
			$number    = get_post_meta( $ausflug_id, 'nr', true );

			return [
				'id'    => $ausflug_id,
				'title' => "$character$number - $title",
				'price' => get_post_meta( $ausflug_id, 'preis', true ),
			];
		},
		$ausfluege_ids
	) : [];

	$verpflegung = $verpflegung_ids ? array_map(
		function( $verpflegung_id ) use ( $is_free_kids_meal ) {
			return [
				'id'    => $verpflegung_id,
				'nr'    => get_post_meta( $verpflegung_id, 'nr', true ),
				'title' => get_the_title( $verpflegung_id ),
				'price' => $is_free_kids_meal ? 0 : get_post_meta( $verpflegung_id, 'price', true ),
			];
		},
		$verpflegung_ids
	) : [];

	$vorname                     = get_post_meta( $post_id, 'vorname', true );
	$nachname                    = get_post_meta( $post_id, 'nachname', true );
	$adresse_strasse             = get_post_meta( $post_id, 'adresse_straße', true );
	$adresse_ort                 = get_post_meta( $post_id, 'adresse_ort', true );
	$adresse_plz                 = get_post_meta( $post_id, 'adresse_plz', true );
	$uebernachtung_and_breakfast = get_post_meta( $post_id, 'uebernachtung_and_breakfast', true );

	$late_payment = calculate_late_payment();

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

	$is_free_kids_meal = $age <= 9;

	$betrag =
		array_reduce( $workshops, __NAMESPACE__ . '\sum', 0 ) +
		array_reduce( $ausfluege, __NAMESPACE__ . '\sum', 0 ) +
		( $is_free_kids_meal ? 0 : array_reduce( $verpflegung, __NAMESPACE__ . '\sum', 0 ) ) +
		array_reduce( $teilnametage, __NAMESPACE__ . '\sum', 0 ) +
		( $uebernachtung_and_breakfast ? 15 : 0 ) +
		$late_payment;

	add_post_meta( $post_id, 'betrag', $betrag, true );

	$data = [
		'id'                          => $post_id,
		'vorname'                     => $vorname,
		'nachname'                    => $nachname,
		'late_payment_aufschlag'      => $late_payment,
		'adresse_straße'              => $adresse_strasse,
		'adresse_ort'                 => $adresse_ort,
		'adresse_plz'                 => $adresse_plz,
		'teilnahmetage'               => $teilnametage,
		'workshops'                   => $workshops,
		'ausfluege'                   => $ausfluege,
		'verpflegung'                 => $verpflegung,
		'uebernachtung_and_breakfast' => $uebernachtung_and_breakfast ? [
			'title' => 'Jugend-Übernachtung & Frühstück',
			'price' => 15,
		] : null,
		'betrag'                      => $betrag,
	];

	$json_data = wp_json_encode( $data );

	$url = 'http://gemeindetag-rechnungen.fabian-kaegy.de/invoice';

	$post_request_options = [
		'method'   => 'POST',
		'timeout'  => 100,
		'blocking' => true,
		'headers'  => [ 'Content-Type' => 'application/json' ],
		'body'     => $json_data,
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

	$file_path = ABSPATH . "/invoices/rechnung-$post_id.pdf";

	$file          = \fopen( $file_path, 'w' );
	$bites_written = file_put_contents( $file_path, $pdf_data );

	return $file_path;

}

/**
 * calculates the Age
 *
 * @param String $geb_date dd.mm.yyyy
 */
function get_age( $geb_date ) {

	$d1 = new \DateTime( $geb_date );
	$d2 = new \DateTime( '25.05.2020' );

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

	return get_post_meta( $post_id, $key, true );
}

/**
 * calculate amout of late payment
 */
function calculate_late_payment() {
	$first_stage   = new \DateTime( '01-03-2020' );
	$seccond_stage = new \DateTime( '15-04-2020' );
	$now           = new \DateTime();

	$fee = 0;

	if ( $first_stage < $now ) {
		$fee = 10;
	}
	if ( $seccond_stage < $now ) {
		$fee = 20;
	}

	return $fee;
}


/**
 * send payment success email
 *
 * @param Integer $post_id ID of Post
 */
function send_payment_success_email( $post_id ) {

	$email        = get_post_meta( $post_id, 'email', true );
	$rechnungs_id = $post_id;
	$vorname      = get_post_meta( $post_id, 'vorname', true );
	$to           = $email;
	$headers[]    = 'Content-Type: text/html; charset=UTF-8';
	$headers[]    = 'From: Gemeindetag 2020 <gemeindetag@mennoniten.de>';
	$subject      = 'Zahlungsbestätigung - Mennonitischer Gemeindetag 2020';
	$body         = "<p>Hallo $vorname,\n \n</p>

	<p>vielen Dank für die Überweisung von Rechnung $rechnungs_id\n \n</p>

	<p>Hiermit ist die Anmeldung zum Gemeindetag 2020 bestätigt. Wir freuen uns, Dich zum Gemeindetag auf dem Weierhof begrüßen zu dürfen.</p>";

	return wp_mail( $to, $subject, $body, $headers );
}
