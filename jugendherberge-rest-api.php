<?php
/**
 * Add REST API endpints & manipulations
 *
 * @package gemeindetage-anmeldung
 */

/**
 * checks wether user can edit posts
 */
function jugendherberge_can_edit_posts() {
	return current_user_can( 'edit_others_posts' );
}

add_action( 'rest_api_init', 'register_gemeindetag_jugendherberge_signup_rest_route' );

/**
 * Adding custom rest endpoint to signup
 */
function register_gemeindetag_jugendherberge_signup_rest_route() {
	register_rest_route(
		'gemeindetag/v1',
		'/jugendherberge-signup',
		[
			'methods'  => 'POST',
			'callback' => 'handle_jugendherberge_signup_request',
		]
	);
};

/**
 * handles the signup request
 *
 * @param WP_REST_Request $request request
 */
function handle_jugendherberge_signup_request( $request ) {

	$room_types = [
		'einzelzimmer'   => 'Einzelzimmer',
		'doppelzimmer'   => 'Doppelzimmer',
		'mehrbettzimmer' => 'Mehrbettzimmer',
	];

	$adults   = sanitize_text_field( $request['number_of_adults'] );
	$teenage  = sanitize_text_field( $request['number_of_teenager'] );
	$kids     = sanitize_text_field( $request['number_of_kids'] );
	$toddlers = sanitize_text_field( $request['number_of_toddlers'] );

	$number_of_people = $adults + $teenage + $kids + $toddlers;

	$post    = [
		'post_type'    => 'jugendherberge',
		'post_title'   => sprintf( '%s - %s Personen', $room_types[$request['room_type']], $number_of_people ),
		'post_content' => '<!-- wp:gemeindetag/jugendherberge-anmeldung /--><!-- wp:gemeindetag/send-email /-->',
		'post_status'  => 'publish',
		'meta_input'   => [
			'room_type'                            => sanitize_text_field( $request['room_type'] ),
			'number_of_adults'                     => sanitize_text_field( $request['number_of_adults'] ),
			'number_of_teenager'                   => sanitize_text_field( $request['number_of_teenager'] ),
			'number_of_kids'                       => sanitize_text_field( $request['number_of_kids'] ),
			'number_of_toddlers'                   => sanitize_text_field( $request['number_of_toddlers'] ),
			'names'                                => sanitize_text_field( $request['names'] ),
			'email'                                => sanitize_email( $request['email'] ),
			'bemerkung'                            => sanitize_text_field( $request['bemerkung'] ),
			'datenschutz_akzeptiert'               => $request['datenschutz_akzeptiert'] ? true : false,
			'status'                               => 'wartet auf bestätigung',
			'rechnung_versand'                     => false,
			'zahlungsbestaetigung_versand'         => false,
		],
	];
	$post_id = wp_insert_post( $post );

	if ( isset( $post_id ) ) {
		// Create the response object
		return new WP_REST_Response( $post_id );
	} else {
		return new WP_Error( 'signup-failed', 'signup-failed', [ 'status' => 500 ] );
	}
};

add_filter( 'rest_dispatch_request', 'jugendherberge_handle_dispatch_request', 10, 4 );

/**
 * Forbid the acces to the rest data unless you are logged in
 *
 * @param {} $dispatch_result  dispatch_result
 * @param {} $request          request
 * @param {} $route            route
 * @param {} $handler          handler
 */
function jugendherberge_handle_dispatch_request( $dispatch_result, $request, $route, $handler ) {
	$target_base = '/wp/v2/jugendherberge'; // Edit to your needs

	$pattern1 = untrailingslashit( $target_base ); // e.g. /wp/v2/cards
	$pattern2 = trailingslashit( $target_base ); // e.g. /wp/v2/cards/

	// Target only /wp/v2/cards and /wp/v2/cards/*
	if ( $route !== $pattern1 && substr( $route, 0, strlen( $pattern2 ) ) !== $pattern2 ) {
		return $dispatch_result;
	}

	// Additional permission check
	if ( is_user_logged_in() ) { // or e.g. current_user_can( 'manage_options' )
		return $dispatch_result;
	}

	// Target GET method
	if ( WP_REST_Server::READABLE !== $request->get_method() ) {
		return $dispatch_result;
	}

	return new \WP_Error(
		'rest_forbidden',
		esc_html__( 'Sorry, you are not allowed to do that.', 'wpse' ),
		[ 'status' => 403 ]
	);

};


add_action( 'rest_api_init', 'register_gemeindetag_get_jugendherberge_invoice' );
/**
 * serving Invoice
 */
function register_gemeindetag_get_jugendherberge_invoice() {
	register_rest_route(
		'gemeindetag/v1',
		'/invoice/(?P<id>\d+)',
		[
			'methods'             => 'GET',
			'callback'            => 'handle_get_jugendherberge_invoice',
			'permission_callback' => 'jugendherberge_can_edit_posts',
			'args'                => [
				'id' => [
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
				],
			],
		]
	);
};

/**
 * Handle get invoice
 *
 * @param WP_REST_Request $request request
 */
function handle_get_jugendherberge_invoice( $request ) {

	$invoice_id = $request['id'];

	$file    = ABSPATH . "invoices/rechnung-$invoice_id.pdf";
	$invoice = file_get_contents( $file );

	if ( isset( $invoice_id ) && isset( $invoice ) ) {

		$response = new WP_REST_Response( base64_encode( $invoice ) );

		return $response;
	} else {
		return new WP_Error( 'get-invoice-failed', "No Invoice was found for the ID: $invoice_id", [ 'status' => 404 ] );
	}
};


add_action( 'rest_api_init', 'register_gemeindetag_jugendherberge_payment_confirmation_rest_route' );
/**
 * Adding custom rest endpoint to send payment confirmation
 */
function register_gemeindetag_jugendherberge_payment_confirmation_rest_route() {
	register_rest_route(
		'gemeindetag/v1',
		'/send-payment-confirmation/(?P<id>\d+)',
		[
			'methods'             => 'POST',
			'callback'            => 'handle_jugendherberge_send_payment_confirmation_request',
			'permission_callback' => 'jugendherberge_can_edit_posts',
			'args'                => [
				'id' => [
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
				],
			],
		]
	);
};

/**
 * Handle payment success request
 *
 * @param WP_REST_Request $request request
 */
function handle_jugendherberge_send_payment_confirmation_request( $request ) {

	$anmeldugs_id = $request['id'];

	do_action( 'send_payment_success_email', $anmeldugs_id );

	return new WP_REST_Response( 'Confirmation Email sent' );

};


add_action( 'rest_api_init', 'register_gemeindetag_send_jugendherberge_invoice_rest_route' );
/**
 * Adding custom rest endpoint to send payment confirmation
 */
function register_gemeindetag_send_jugendherberge_invoice_rest_route() {
	register_rest_route(
		'gemeindetag/v1',
		'/send-invoice/(?P<id>\d+)',
		[
			'methods'             => 'POST',
			'callback'            => 'handle_jugendherberge_send_invoice_request',
			'permission_callback' => 'jugendherberge_can_edit_posts',
			'args'                => [
				'id' => [
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
				],
			],
		]
	);
};

/**
 * Handle payment success request
 *
 * @param WP_REST_Request $request request
 */
function handle_jugendherberge_send_invoice_request( $request ) {

	$anmeldugs_id = $request['id'];

	do_action( 'send_signup_mail', $anmeldugs_id );

	return new WP_REST_Response( 'Invoice Email sent' );

};




add_action( 'rest_api_init', 'register_gemeindetag_send_jugendherberge_registered_users_email' );
/**
 * Adding custom rest endpoint to send payment confirmation
 */
function register_gemeindetag_send_jugendherberge_registered_users_email() {
	register_rest_route(
		'gemeindetag/v1',
		'/send-mail/(?P<id>\d+)',
		[
			'methods'             => 'POST',
			'callback'            => 'handle_send_jugendherberge_registered_users_email_request',
			'permission_callback' => 'jugendherberge_can_edit_posts',
			'args'                => [
				'id' => [
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
				],
			],
		]
	);
};

/**
 * Handle payment success request
 *
 * @param WP_REST_Request $request request
 */
function handle_send_jugendherberge_registered_users_email_request( $request ) {

	$post_id = $request['id'];

	$current_post = get_post( $post_id );
	$post_type    = get_post_type( $current_post );

	$subject = $request['subject'];
	$message = $request->get_body();

	if ( 'anmeldung' === $post_type ) {
		do_action( 'send_email', $post_id, $subject, $message );
		return new WP_REST_Response( 'Email sent' );
	}

	$query_args = [
		'post_type'      => 'anmeldung',
		'posts_per_page' => -1,
		'meta_query'     => [
			[
				'key'     => $post_type,
				'value'   => $post_id,
				'compare' => 'LIKE',
			],
		],
	];

	$anmeldungen = new WP_Query( $query_args );

	foreach ( $anmeldungen->posts as &$post ) {
		do_action( 'send_email', $post->ID, $subject, $message );
	}

	return new WP_REST_Response( 'Email sent' );

};
