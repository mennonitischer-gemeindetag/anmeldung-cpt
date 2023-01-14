<?php
/**
 * Handle logic to send Emails to customers
 *
 * @package gemeindetage-anmeldung
 */

namespace gemeindetag\jugendherberge_anmeldung;

add_action( 'save_post_jugendherberge', __NAMESPACE__ . '\send_anmelde_emails', 10, 3 );
/**
 * send anmelde emails
 *
 * @param Integer $post_id    Post ID
 * @param Array   $post Post  Object
 * @param Bolean  $is_update  Weather or not it is an Update
 */
function send_anmelde_emails( $post_id, $post, $is_update ) {
	if ( ! $is_update ) {
		do_action( 'send_jugendherberge_signup_mail', $post_id );
	}
}

add_action( 'send_jugendherberge_signup_mail', __NAMESPACE__ . '\send_jugendherberge_signup_mail', 10, 1 );
/**
 * sending the signup email
 *
 * @param Integer $post_id ID of the post
 */
function send_jugendherberge_signup_mail( $post_id ) {

	$email      = get_post_meta( $post_id, 'email', true );
	$invoice_id = $post_id;
	
	$adults    = get_post_meta( $invoice_id, 'number_of_adults', true );
	$teenage   = get_post_meta( $invoice_id, 'number_of_teenager', true );
	$kids      = get_post_meta( $invoice_id, 'number_of_kids', true );
	$toddlers  = get_post_meta( $invoice_id, 'number_of_toddlers', true );
	$room_type = get_post_meta( $invoice_id, 'room_type', true );

	$number_of_people = $adults + $teenage + $kids + $toddlers;

	$room_types = [
		'einzelzimmer'   => 'Einzelzimmer',
		'doppelzimmer'   => 'Doppelzimmer',
		'mehrbettzimmer' => 'Mehrbettzimmer',
	];

	$room_type = $room_types[ $room_type ];

	$to          = $email;
	$subject     = "Jugendherberge Anfrage Eingangsbestätigung $invoice_id - Mennonitischer Gemeindetag 2023";
	$body        = "<p>Hallo,\n \n</p>

	<p>Deine Anfrage für ein $room_type für $number_of_people Personen ist bei uns eingegangen. Wir werden uns bei dir melden sobald wir die Anfrage bearbeitet haben.\n \n</p>

	<p>Bitte wende dich bei Rückfragen an folgende E.Mail-Adresse: <a href='mailto:gemeindetag@mennoniten.de'>gemeindetag@mennoniten.de</a> oder an 0 152 29388940.</p> 
	\n \n
	<p>Das AMG Gemeindetag 2023-Team.</p>";

	$headers[] = 'Content-Type: text/html; charset=UTF-8';
	$headers[] = 'From: Gemeindetag 2023 <gemeindetag@mennoniten.de>';

	return wp_mail( $to, $subject, $body, $headers );

}
