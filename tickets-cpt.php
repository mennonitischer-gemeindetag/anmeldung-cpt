<?php
/**
 * Add CPT tickets
 *
 * @package gemeindetage-anmeldung
 */

namespace gemeindetag\anmeldung;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

add_action( 'init', __NAMESPACE__ . '\custom_post_type_tickets', 0 );

/**
 * Adding CPT tickets
 */
function custom_post_type_tickets() {
	$labels = [
		'name'               => __( 'Tickets', 'gemeindetag' ),
		'singular_name'      => __( 'Ticket', 'gemeindetag' ),
		'menu_name'          => __( 'Tickets', 'gemeindetag' ),
		'all_items'          => __( 'Alle Tickets', 'gemeindetag' ),
		'view_item'          => __( 'Ticket Anzeigen', 'gemeindetag' ),
		'add_new_item'       => __( 'Neues Ticket hinzufügen', 'gemeindetag' ),
		'add_new'            => __( 'Neues hinzufügen', 'gemeindetag' ),
		'edit_item'          => __( 'Ticket bearbeiten', 'gemeindetag' ),
		'update_item'        => __( 'Ticket Aktualisieren', 'gemeindetag' ),
		'search_items'       => __( 'Ticket Suchen', 'gemeindetag' ),
		'not_found'          => __( 'Nichts gefunden', 'gemeindetag' ),
		'not_found_in_trash' => __( 'Nichts im Papierkorb gefunden', 'gemeindetag' ),
	];

	$args = [
		'labels'              => $labels,
		'description'         => __( 'Tickets', 'gemeindetag' ),
		'menu_icon'           => 'dashicons-tickets',
		'supports'            => [ 'title', 'editor', 'meta', 'custom-fields' ],
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
		'publicly_queryable'  => true,
		'capability_type'     => 'post',
		'show_in_rest'        => true,
		'rest_base'           => 'tickets',
		'template'            => [
			[ 'gemeindetag/ticket' ]
		],
		'template_lock'       => 'all',
	];
	register_post_type( 'tickets', $args );
}

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
	'type'         => 'number',
	'single'       => true,
	'show_in_rest' => true,
];
$multiple_numbers = [
	'type'         => 'number',
	'single'       => false,
	'show_in_rest' => true,
];

register_post_meta( 'tickets', 'price_adult', $string );
register_post_meta( 'tickets', 'price_teen', $string );
register_post_meta( 'tickets', 'price_kid', $string );
