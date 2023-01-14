<?php
/**
 * Add CPT for anmeldungen
 *
 * @package gemeindetage-anmeldung
 */

namespace gemeindetag\jugendherberge_anmeldung;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * register cpt anmeldungen
 */
function custom_post_type_jugendherberge_anmeldung() {
	$labels = array(
		'name'               => __( 'Jugendherberge Anmeldungen', 'gemeindetag' ),
		'singular_name'      => __( 'Jugendherberge Anmeldung', 'gemeindetag' ),
		'menu_name'          => __( 'Jugendherberge Anmeldungen', 'gemeindetag' ),
		'parent_item_colon'  => __( 'Übergeordnete Anmeldung', 'gemeindetag' ),
		'all_items'          => __( 'Alle Jugendherberge Anmeldungen', 'gemeindetag' ),
		'view_item'          => __( 'Jugendherberge Anmeldung Anzeigen', 'gemeindetag' ),
		'add_new_item'       => __( 'Neue Jugendherberge Anmeldung hinzufügen', 'gemeindetag' ),
		'add_new'            => __( 'Neue hinzufügen', 'gemeindetag' ),
		'edit_item'          => __( 'Jugendherberge Anmeldung bearbeiten', 'gemeindetag' ),
		'update_item'        => __( 'Jugendherberge Anmeldung Aktualisieren', 'gemeindetag' ),
		'search_items'       => __( 'Jugendherberge Anmeldung Suchen', 'gemeindetag' ),
		'not_found'          => __( 'Nichts gefunden', 'gemeindetag' ),
		'not_found_in_trash' => __( 'Nichts im Papierkorb gefunden', 'gemeindetag' ),
	);

	$args = [
		'labels'              => $labels,
		'description'         => __( 'Jugendherberge Anmeldungen', 'gemeindetag' ),
		'menu_icon'           => 'dashicons-tickets-alt',
		'supports'            => [ 'title', 'editor', 'meta', 'custom-fields', 'revisions' ],
		'hierarchical'        => false,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'show_in_nav_menus'   => true,
		'show_in_admin_bar'   => true,
		'menu_position'       => 20,
		'can_export'          => true,
		'has_archive'         => false,
		'exclude_from_search' => true,
		'publicly_queryable'  => false,
		'template'            => [
			[ 'gemeindetag/jugendherberge-anmeldung', [ 'isEditing' => true ] ],
			[ 'gemeindetag/send-email', [] ],
		],
		'template_lock'       => 'all', // or 'insert' to allow moving
		'capability_type'     => 'post',
		'show_in_rest'        => true,
		'rest_base'           => 'jugendherberge',
	];
		register_post_type( 'jugendherberge', $args );

}
add_action( 'init', __NAMESPACE__ . '\custom_post_type_jugendherberge_anmeldung', 0 );



/*********************************************************
 * Post Meta
 */



$string           = [
	'type'         => 'string',
	'single'       => true,
	'show_in_rest' => true,
];
$boolean          = [
	'type'         => 'boolean',
	'single'       => true,
	'show_in_rest' => true,
];
$number           = [
	'type'         => 'string',
	'single'       => true,
	'show_in_rest' => true,
];
$multiple_numbers = [
	'show_in_rest' => true,
	'type'         => 'array',
	'single'       => true,
	'show_in_rest' => [
		'schema' => [
			'type'  => 'array',
			'items' => [
				'type' => 'number',
			],
		],
	],
];
$multiple_strings = [
	'show_in_rest' => true,
	'type'         => 'array',
	'single'       => true,
	'show_in_rest' => [
		'schema' => [
			'type'  => 'array',
			'items' => [
				'type' => 'string',
			],
		],
	],
];

register_post_meta( 'jugendherberge', 'bemerkung', $string );
register_post_meta( 'jugendherberge', 'room_type', $string );
register_post_meta( 'jugendherberge', 'datenschutz_akzeptiert', $boolean );
register_post_meta( 'jugendherberge', 'status', $string );
register_post_meta( 'jugendherberge', 'number_of_adults', $string );
register_post_meta( 'jugendherberge', 'number_of_teenager', $string );
register_post_meta( 'jugendherberge', 'number_of_kids', $string );
register_post_meta( 'jugendherberge', 'number_of_toddlers', $string );
register_post_meta( 'jugendherberge', 'names', $string );
register_post_meta( 'jugendherberge', 'email', $string );
register_post_meta( 'jugendherberge', 'rechnung_versand', $boolean );
register_post_meta( 'jugendherberge', 'zahlungsbestaetigung_versand', $boolean );
register_post_meta( 'jugendherberge', 'betrag', $number );


/*********************************************************
 * Admin Columns
 */


/**
 * A filter to add custom columns and remove built-in
 * columns from the edit.php screen.
 *
 * @access public
 * @param Array $columns The existing columns
 * @return Array $filtered_columns The filtered columns
 */
function jugendherberge_modify_columns( $columns ) {

	// New columns to add to table
	$new_columns = [
		'status'                       => 'Status',
		'invoice_id'                   => 'Rechnungs Nummer',
		'betrag'                       => 'Betrag',
		'anmeldedatum'                 => 'Datum',
		'rechnung_versand'             => 'Rechnung Versand',
		'zahlungsbestaetigung_versand' => 'Bestätigung Versand',
	];

	// Remove unwanted publish date column
	unset( $columns['date'] );
	$columns['title'] = 'Anmeldung';

	// Combine existing columns with new columns
	$filtered_columns = array_merge( $columns, $new_columns );

	// Return our filtered array of columns
	return $filtered_columns;
}

// Let WordPress know to use our filter
add_filter( 'manage_jugendherberge_posts_columns', __NAMESPACE__ . '\jugendherberge_modify_columns' );




/**
 * Render custom column content within edit.php
 * table on anmeldung post types.
 *
 * @access public
 * @param String $column The name of the column being acted upon
 * @return void
 */
function jugendherberge_custom_column_content( $column ) {

	// Get the post object for this row so we can output relevant data
	global $post;

	// Check to see if $column matches our custom column names
	switch ( $column ) {

		case 'status':
			$start = get_post_meta( $post->ID, 'status', true );

			echo ! empty( $start ) ? esc_attr( $start ) : '';
			break;

		case 'name':
			$vorname  = get_post_meta( $post->ID, 'vorname', true );
			$nachname = get_post_meta( $post->ID, 'nachname', true );

			echo ( ! empty( $vorname ) ? esc_attr( "$vorname $nachname" ) : '' );
			break;

		case 'invoice_id':
			echo esc_attr( "$post->ID" );
			break;

		case 'betrag':
			$betrag = get_post_meta( $post->ID, 'betrag', true );
			echo ! empty( $betrag ) ? esc_attr( "$betrag €" ) : '';
			break;

		case 'anmeldedatum':
			echo esc_attr( get_the_date() );
			break;

		case 'alter':
			$geb_date = get_post_meta( $post->ID, 'geb_datum', true );
			echo esc_attr( get_age( $geb_date ) );
			break;

		case 'rechnung_versand':
			$rechnung_versand = get_post_meta( $post->ID, 'rechnung_versand', true );
			$bool             = filter_var( $rechnung_versand, FILTER_VALIDATE_BOOLEAN );
			$checked          = $bool ? 'checked' : '';
			echo sprintf( '<input type="checkbox" %s disabled></input>', esc_attr( $checked ) );
			break;

		case 'zahlungsbestaetigung_versand':
			$zahlungsbestaetigung_versand = get_post_meta( $post->ID, 'zahlungsbestaetigung_versand', true );
			$bool                         = filter_var( $zahlungsbestaetigung_versand, FILTER_VALIDATE_BOOLEAN );
			$checked                      = $bool ? 'checked' : '';
			echo sprintf( '<input type="checkbox" %s disabled></input>', esc_attr( $checked ) );
			break;
	}
}

// Let WordPress know to use our action
add_action( 'manage_jugendherberge_posts_custom_column', __NAMESPACE__ . '\jugendherberge_custom_column_content' );


/**
 * Make custom columns sortable.
 *
 * @access public
 * @param Array $columns The original columns
 * @return Array $columns The filtered columns
 */
function jugendherberge_custom_columns_sortable( $columns ) {

		// Add our columns to $columns array
		$columns['status']       = 'status';
		$columns['invoice_id']   = 'invoice_id';
		$columns['anmeldedatum'] = 'anmeldedatum';
		$columns['alter']        = 'alter';

		return $columns;
}

// Let WordPress know to use our filter
add_filter( 'manage_edit-jugendherberge_sortable_columns', __NAMESPACE__ . '\jugendherberge_custom_columns_sortable' );

/**
 * function to order the columns by
 *
 * @param WP_Query $query wp query
 */
function jugendherberge_orderby_colums( $query ) {
	if ( ! is_admin() ) {
		return;
	}

	$orderby = $query->get( 'orderby' );

	if ( 'alter' === $orderby ) {
		$query->set( 'meta_key', 'geb_datum' );
		$query->set( 'orderby', 'meta_value_num' );
	}
}
add_action( 'pre_get_posts', __NAMESPACE__ . '\jugendherberge_orderby_colums' );



/*********************************************************
 * Bulk Actions
 */

add_filter( 'bulk_actions-edit-jugendherberge_anmeldung', __NAMESPACE__ . '\register_jugendherberge_anmeldung_actions' );
/**
 * register set status payed bulk action
 *
 * @param {} $bulk_actions bulk actions
 */
function register_jugendherberge_anmeldung_actions( $bulk_actions ) {
	$bulk_actions['regenerate_invoice'] = 'Rechnung neu Generieren';
	$bulk_actions['set_status_payed'] = 'Status auf Bezahlt setzen';
	return $bulk_actions;
}

add_filter( 'handle_bulk_actions-edit-jugendherberge_anmeldung', __NAMESPACE__ . '\jugendherberge_anmeldung_actions_handler', 10, 3 );
/**
 * handler for set status to payed
 *
 * @param {} $redirect_to URL to Redirect to
 * @param {} $doaction handle of action to execute
 * @param {} $post_ids array of post id's that the handler is called on
 */
function jugendherberge_anmeldung_actions_handler( $redirect_to, $doaction, $post_ids ) {
	if ( 'set_status_payed' === $doaction ) {
		foreach ( $post_ids as $post_id ) {
			// Perform action for each post.
			update_post_meta(
				$post_id,
				'status',
				'bezahlt',
				'wartet auf zahlung'
			);
		}
		$redirect_to = add_query_arg( 'bulk_set_status_to_payed_posts', count( $post_ids ), $redirect_to );
		return $redirect_to;
	}

	if ( 'regenerate_invoice' === $doaction ) {
		foreach ( $post_ids as $post_id ) {
			// Perform action for each post.
			$registration = get_registration( $post_id );
			get_invoice_pdf_from_api( $registration );
		}

		$redirect_to = add_query_arg( 'bulk_regenerated_invoices', count( $post_ids ), $redirect_to );
		return $redirect_to;
	}
}


add_action( 'admin_notices', __NAMESPACE__ . '\jugendherberge_anmeldung_actions_admin_notice' );
/**
 * show notice upon completing the bulk action
 */
function jugendherberge_anmeldung_actions_admin_notice() {
	if ( ! empty( $_REQUEST['bulk_set_status_to_payed_posts'] ) ) {
		$updated_posts_count = intval( $_REQUEST['bulk_set_status_to_payed_posts'] );
		printf(
			'<div class="notice notice-success is-dismissible"><p>' .
				_n(
					'Status von %s Anmeldung in Bezahlt geändert.',
					'Status von %s Anmeldungen in Bezahlt geändert.',
					$updated_posts_count
				) . '</p>
				<button type="button" class="notice-dismiss">
					<span class="screen-reader-text">Dismiss this notice.</span>
				</button>
			</div>',
			1 === $updated_posts_count ? 'einer' : esc_attr( $updated_posts_count )
		);
	}

	if ( ! empty( $_REQUEST['bulk_bulk_regenerated_invoice'] ) ) {
		$updated_posts_count = intval( $_REQUEST['bulk_regenerated_invoices'] );
		printf(
			'<div class="notice notice-success is-dismissible"><p>' .
				_n(
					'Rechnung von %s Anmeldung neu generiert.',
					'Rechnung von %s Anmeldungen neu generiert.',
					$updated_posts_count
				) . '</p>
				<button type="button" class="notice-dismiss">
					<span class="screen-reader-text">Dismiss this notice.</span>
				</button>
			</div>',
			1 === $updated_posts_count ? 'einer' : esc_attr( $updated_posts_count )
		);
	}
};
