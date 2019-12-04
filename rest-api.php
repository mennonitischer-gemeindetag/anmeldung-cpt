<?php 

/**
 * Adding custom rest endpoint to signup
 */

add_action( 'rest_api_init', 'register_gemeindetag_signup_rest_route');

function register_gemeindetag_signup_rest_route () {
  register_rest_route( 'gemeindetag/v1', '/signup', [
    'methods' => 'POST',
    'callback' => 'handle_signup_request',
   ] );
};

function handle_signup_request(WP_REST_Request $request) {

    $request;
    
    $post = [
        "post_type" => "anmeldung",
        "post_title"   => sprintf("%s %s", sanitize_text_field($request['vorname']), sanitize_text_field($request['nachname'])),
        "post_content" => "<!-- wp:gemeindetag/anmeldung /-->",
        "post_status" => "publish",
        "meta_input" => [
            "nachname" => sanitize_text_field($request['nachname']),
            "vorname" => sanitize_text_field($request['vorname']),
            "geschlecht" => sanitize_text_field($request['geschlecht']),
            "adresse_straße" => sanitize_text_field($request['adresse_straße']),
            "adresse_plz" => sanitize_text_field($request['adresse_plz']),
            "adresse_ort" => sanitize_text_field($request['adresse_ort']),
            "geb_datum" => sanitize_text_field($request['geb_datum']),
            "ermaessigt_adult" => $request['ermaessigt_adult'] ? true : false,
            "telefonnummer" => sanitize_text_field($request['telefonnummer']),
            "email" => sanitize_email($request['email']),
            "teilnahmetage" => $request['teilnahmetage'] ? $request['teilnahmetage'] : [],
            "mitarbeit" => $request['mitarbeit'] ? $request['mitarbeit'] : [],
            "kinderprogramm" => $request['kinderprogramm'] ? $request['kinderprogramm'] : [],
            "kinderprogramm_bemerkung" => sanitize_text_field($request['kinderprogramm_bemerkung']),
            "kinderprogramm_notfall_nummer" => sanitize_text_field($request['kinderprogramm_notfall_nummer']),
            "ausfluege" => $request['ausfluege'] ? $request['ausfluege'] : [],
            "workshops" => $request['workshops'] ? $request['workshops'] : [],
            "uebernachtung_and_breakfast" => $request['uebernachtung_and_breakfast'] ? true : false,
            "uebernachtung" => $request['uebernachtung'] ? $request['uebernachtung'] : [],
            "uebernachtung_zelt_mit" => sanitize_text_field($request['uebernachtung_zelt_mit']),
            "verpflegung" => $request['verpflegung'] ? $request['verpflegung'] : [],
            "datenschutz_akzeptiert" => $request['datenschutz_akzeptiert'] ? true : false,
            "gedrucktes_liederheft" => $request['gedrucktes_liederheft'] ? true : false,
            "gedrucktes_programmheft" => $request['gedrucktes_programmheft'] ? true : false,
            "status" => "wartet auf zahlung",
            "daten_fuer_mitfahrgelegenheit_teilen" => $request['daten_fuer_mitfahrgelegenheit_teilen'] ? true : false
        ]
    ];
    $post_id = wp_insert_post($post);

    if (isset($post_id)) {
        // Create the response object
        return new WP_REST_Response( $post_id );
    } else {
        return new WP_Error( 'signup-failed', 'signup-failed', [ 'status' => 404 ]) ;
    }
 
};

/**
 * Forbid the acces to the rest data unless you are logged in 
 */

add_filter( 'rest_dispatch_request', function( $dispatch_result, $request, $route, $hndlr )
{
    $target_base = '/wp/v2/anmeldung';    // Edit to your needs

    $pattern1 = untrailingslashit( $target_base ); // e.g. /wp/v2/cards
    $pattern2 = trailingslashit( $target_base );   // e.g. /wp/v2/cards/

    // Target only /wp/v2/cards and /wp/v2/cards/*
    if( $pattern1 !== $route && $pattern2 !== substr( $route, 0, strlen( $pattern2 ) ) )
        return $dispatch_result;

    // Additional permission check
    if( is_user_logged_in() )  // or e.g. current_user_can( 'manage_options' )
        return $dispatch_result;

    // Target GET method
    if( WP_REST_Server::READABLE !== $request->get_method() ) 
        return $dispatch_result;

    return new \WP_Error( 
        'rest_forbidden', 
        esc_html__( 'Sorry, you are not allowed to do that.', 'wpse' ), 
        [ 'status' => 403 ] 
    );

}, 10, 4 );








// Serving invoice 

add_action( 'rest_api_init', 'register_gemeindetag_get_invoice');

function register_gemeindetag_get_invoice () {
  register_rest_route( 'gemeindetag/v1', '/invoice/(?P<id>\d+)', [
    'methods' => 'GET',
    'callback' => 'handle_get_invoice',
    'args' => [
      'id' => [
        'validate_callback' => function($param, $request, $key) {
          return is_numeric( $param );
        }
      ],
    ]
   ] );
};


function handle_get_invoice(WP_REST_Request $request) {

    if (!is_user_logged_in()) {
        return new WP_Error( 'not-authorized', 'You need to be logged in to access this file', [ 'status' => 401 ]) ;
    }

    $invoice_id = $request['id'];
    
    $file = ABSPATH . "invoices/rechnung-$invoice_id.pdf";
    $invoice = file_get_contents( $file );
    
    if (isset($invoice_id) && isset( $invoice )) {

        $response = new WP_REST_Response( base64_encode($invoice) );


        return $response;
    } else {
        return new WP_Error( 'get-invoice-failed', "No Invoice was found for the ID: $invoice_id", [ 'status' => 404 ]) ;
    }
 
};