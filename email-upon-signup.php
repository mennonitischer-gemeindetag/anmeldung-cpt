<?php 

namespace gemeindetag\anmeldung;


add_action(  'save_post_anmeldung',  __NAMESPACE__.'\send_anmelde_emails', 10, 3 );

function send_anmelde_emails(  $post_ID, $post, $is_update ) {
	if (!$is_update) {
		send_signup_mail( $post_ID );
		update_post_meta($post_ID, 'rechnung_versand', 1);
	}
	
	$status = $post->status;
	$zahlungsbestaetigung_versand = $post->zahlungsbestaetigung_versand;

	if ($is_update && $status === "bezahlt" && !$zahlungsbestaetigung_versand) {
		send_payment_success_email( $post_ID );
		update_post_meta($post_ID, 'zahlungsbestaetigung_versand', 1);
	}	
}


function send_signup_mail( $post_ID ) {

	$incoive = get_invoice( $post_ID );

	$email = get_post_meta($post_ID, 'email', true);
	$rechnungs_ID = $post_ID;
	$vorname = get_post_meta($post_ID, 'vorname', true);
	$nachname = get_post_meta($post_ID, 'nachname', true);


	$to = $email;
	$subject = "Rechnung $rechnungs_ID - Mennonitischer Gemeindetag 2020";
	$attachments = [$incoive];
	$body = "<p>Hallo $vorname,\n \n</p>

	<p>herzlichen Dank für deine Anmeldung zum Gemeindetag 2020 auf dem Weierhof. Im Anhang findest du die Rechnung mit der Auflistung aller von dir ausgewählten Veranstaltungen, an denen du teilnehmen möchtest. Bitte überweise den Betrag auf das in der Rechnung angegebene Konto. Deine Anmeldung wird mit Eingang des Rechnungsbetrages abgeschlossen. Hierüber erhältst du erneut eine Information.\n \n</p>

	<p>Bitte wende dich bei Rückfragen an folgende E.Mail-Adresse: <a href='mailto:gemeindetag@mennoniten.de'>gemeindetag@mennoniten.de</a> oder an 0 152 29388940.</p> 
	\n \n
	<p>Das AMG Gemeindetag 2020-Team wünscht viel Spaß.</p>";

	$headers[] = 'Content-Type: text/html; charset=UTF-8';
	$headers[] = 'From: Gemeindetag 2020 <gemeindetag@mennoniten.de>';
	
	return wp_mail( $to, $subject, $body, $headers, $attachments );

}

function get_invoice($post_ID) {

	$teilnahmetage_IDs = get_post_meta($post_ID, 'teilnahmetage', true);
	$workshops_IDs = get_post_meta($post_ID, 'workshops', true);
	$ausfluege_IDs = get_post_meta($post_ID, 'ausfluege', true);
	$verpflegung_IDs = get_post_meta($post_ID, 'verpflegung', true);
	$age = get_age(get_post_meta($post_ID, 'geb_datum', true));
	$ermaessigt_adult = get_post_meta($post_ID, 'ermaessigt_adult', true);
	$isFreeKidMeal = $age <= 9;

	$teilnametage = $teilnahmetage_IDs ? array_map( function($teilnahmetag_ID) use ($age, $ermaessigt_adult){
		return [
			"id" => $teilnahmetag_ID,
			"title" => get_the_title($teilnahmetag_ID),
			"price" => get_price($teilnahmetag_ID, $age, $ermaessigt_adult)
		];
	}, $teilnahmetage_IDs ): [];

	$workshops = $workshops_IDs ? array_map(function($workshop_ID) {
		$title = get_the_title($workshop_ID);
		$metaChar = get_post_meta($workshop_ID, "character", true);
		$character = $metaChar ? $metaChar : "W";
		$number = get_post_meta($workshop_ID, "nr", true);
		return [
			"id" => $workshop_ID,
			"title" => "$character$number - $title",
			"price" => get_post_meta($workshop_ID, 'preis', true)
		];
	}, $workshops_IDs): [];

	$ausfluege = $ausfluege_IDs ? array_map( function($ausflug_ID) {
		$title = get_the_title($ausflug_ID);
		$metaChar = get_post_meta($ausflug_ID, "character", true);
		$character = $metaChar ? $metaChar : "A";
		$number = get_post_meta($ausflug_ID, "nr", true);
		return [
			"id" => $ausflug_ID,
			"title" => "$character$number - $title",
			"price" => get_post_meta($ausflug_ID, 'preis', true)
		];
	}, $ausfluege_IDs) : [];

	$verpflegung = $verpflegung_IDs ? array_map( function( $verpflegung_ID ) use ($isFreeKidMeal) {
		return [
			"id" => $verpflegung_ID,
			"nr" => get_post_meta($verpflegung_ID, 'nr', true),
			"title" => get_the_title($verpflegung_ID),
			"price" => $isFreeKidMeal ? 0 : get_post_meta($verpflegung_ID, 'price', true)
		];
	}, $verpflegung_IDs ) : [];


	$vorname = get_post_meta($post_ID, 'vorname', true);
	$nachname = get_post_meta($post_ID, 'nachname', true);
	$adresse_strasse = get_post_meta($post_ID, 'adresse_straße', true);
	$adresse_ort = get_post_meta($post_ID, 'adresse_ort', true);
	$adresse_plz = get_post_meta($post_ID, 'adresse_plz', true);
	$uebernachtung_and_breakfast = get_post_meta($post_ID, 'uebernachtung_and_breakfast', true);

	$late_payment = calculate_late_payment();

	function sum($carry, $item) {
		$carry += \floatval($item["price"]);
		return $carry;
	}

	$isFreeKidMeal = $age <= 9;

	$betrag = 
		array_reduce( $workshops, __NAMESPACE__.'\sum', 0 ) + 
		array_reduce( $ausfluege, __NAMESPACE__.'\sum', 0 ) + 
		($isFreeKidMeal ? 0 : array_reduce( $verpflegung, __NAMESPACE__.'\sum', 0 ) ) + 
		array_reduce( $teilnametage, __NAMESPACE__.'\sum', 0 ) +
		($uebernachtung_and_breakfast ? 15 : 0) +
		$late_payment;
	;

	add_post_meta( $post_ID, 'betrag', $betrag, true );
	
	$data = [
		"id" => $post_ID,
		"vorname" => $vorname,
		"nachname" => $nachname,
		"late_payment_aufschlag" => $late_payment,
		"adresse_straße" => $adresse_strasse,
		"adresse_ort" => $adresse_ort,
		"adresse_plz" => $adresse_plz,
		"teilnahmetage" => $teilnametage,
		"workshops" => $workshops,
		"ausfluege" => $ausfluege,
		"verpflegung" => $verpflegung,
		"uebernachtung_and_breakfast" => $uebernachtung_and_breakfast ? [
			"title" => "Jugend-Übernachtung & Frühstück",
			"price" => 15,
		] : null,
		"betrag" => $betrag
	];

	$json_data = wp_json_encode($data);

	$url = "http://gemeindetag-rechnungen.fabian-kaegy.de/invoice";
	
	$post_request_options = [
		'method' => 'POST',
		'timeout' => 100,
		'blocking'    => true,
		'headers' => ["Content-Type"=>"application/json"],
		'body' => $json_data,
	];

	$response = wp_remote_post( $url, $post_request_options);
	if (is_wp_error($response)) {

		// log to sentry
		if ( function_exists( 'wp_sentry_safe' ) ) {
			wp_sentry_safe( function ( \Sentry\State\HubInterface $client ) use ( $response ) {
				$client->captureException( $response );
			} );
		}

		// try again once if it doesn't work
		$response = wp_remote_post( $url, $post_request_options);
	}

	$pdf_data = wp_remote_retrieve_body($response);

	header('Content-type: application/pdf');

	$file_path = ABSPATH."/invoices/rechnung-$post_ID.pdf";

	$file = \fopen($file_path, 'w');
	$bites_written = file_put_contents( $file_path, $pdf_data );

	return $file_path;

}



function get_age( $geb_date ) {

	$d1 = new \DateTime($geb_date);
	$d2 = new \DateTime('25.05.2020');

	$diff = $d2->diff($d1);

	return $diff->y;
}

function get_price( $post_ID, $age, $ermaessigt_adult = false ) {
	$key = "price_adult";
	$meta_values = get_post_meta( $post_ID );

	
	if ($age <= 18 || $ermaessigt_adult) {
		$key = "price_teen";
	}
	
	if ($age <= 13 && $age >= 3) {
		$key = "price_kid";
	}
	
	return get_post_meta($post_ID, $key, true);
	

}


function calculate_late_payment() {
	$first_stage = new \DateTime("01-03-2020");
	$seccond_stage = new \DateTime("15-04-2020");
	$now = new \DateTime();

	$fee = 0;

	if($first_stage < $now) {
		$fee = 10;
	}
	if($seccond_stage < $now) {
		$fee = 20;
	}

	return $fee;
}



function send_payment_success_email( $post_ID ) {

	$email = get_post_meta($post_ID, 'email', true);
	$rechnungs_ID = $post_ID;
	$vorname = get_post_meta($post_ID, 'vorname', true);


	$to = $email;
	$subject = "Zahlungsbestätigung - Mennonitischer Gemeindetag 2020";
	$body = "<p>Hallo $vorname,\n \n</p>

	<p>vielen Dank für die Überweisung von Rechnung $rechnungs_ID\n \n</p>

	<p>Hiermit ist die Anmeldung zum Gemeindetag 2020 bestätigt. Wir freuen uns, Dich zum Gemeindetag auf dem Weierhof begrüßen zu dürfen.</p>";
	$headers[] = 'Content-Type: text/html; charset=UTF-8';
	$headers[] = 'From: Gemeindetag 2020 <gemeindetag@mennoniten.de>';
	
	return wp_mail( $to, $subject, $body, $headers );
}