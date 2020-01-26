<?php
/**
 * Add CPT for meals
 *
 * @package gemeindetage-anmeldung
 */

namespace gemeindetag\anmeldung;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * register cpt essen
 */
function custom_post_type_essen() {
	$labels = [
		'name'               => __( 'Essen', 'gemeindetag' ),
		'singular_name'      => __( 'Essen', 'gemeindetag' ),
		'menu_name'          => __( 'Essen', 'gemeindetag' ),
		'all_items'          => __( 'Alle Essen', 'gemeindetag' ),
		'view_item'          => __( 'Essen Anzeigen', 'gemeindetag' ),
		'add_new_item'       => __( 'Neues Essen hinzufügen', 'gemeindetag' ),
		'add_new'            => __( 'Neues hinzufügen', 'gemeindetag' ),
		'edit_item'          => __( 'Essen bearbeiten', 'gemeindetag' ),
		'update_item'        => __( 'Essen Aktualisieren', 'gemeindetag' ),
		'search_items'       => __( 'Essen Suchen', 'gemeindetag' ),
		'not_found'          => __( 'Nichts gefunden', 'gemeindetag' ),
		'not_found_in_trash' => __( 'Nichts im Papierkorb gefunden', 'gemeindetag' ),
	];

	$args = [
		'labels'              => $labels,
		'description'         => __( 'Essen', 'gemeindetag' ),
		'menu_icon'           => 'dashicons-carrot',
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
		'rest_base'           => 'essen',
	];
	register_post_type( 'essen', $args );

}
add_action( 'init', __NAMESPACE__ . '\custom_post_type_essen', 0 );

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

register_post_meta( 'essen', 'price', $string );
register_post_meta( 'essen', 'tag', $string );
register_post_meta( 'essen', 'tageszeit', $string );
