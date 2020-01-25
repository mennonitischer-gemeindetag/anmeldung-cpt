<?php
/**
 * Add CPT Uebernachtungen
 *
 * @package gemeindetage-anmeldung
 */

namespace gemeindetag\anmeldung;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

add_action( 'init', __NAMESPACE__ . '\custom_post_type_uebernachtungen', 0 );

/**
 * Add CPT uebernachtungen
 */
function custom_post_type_uebernachtungen() {
	$labels = array(
		'name'               => __( 'Übernachtungen', 'gemeindetag' ),
		'singular_name'      => __( 'Übernachtung', 'gemeindetag' ),
		'menu_name'          => __( 'Übernachtungen', 'gemeindetag' ),
		'all_items'          => __( 'Alle Übernachtungen', 'gemeindetag' ),
		'view_item'          => __( 'Übernachtung Anzeigen', 'gemeindetag' ),
		'add_new_item'       => __( 'Neues Übernachtung hinzufügen', 'gemeindetag' ),
		'add_new'            => __( 'Neues hinzufügen', 'gemeindetag' ),
		'edit_item'          => __( 'Übernachtung bearbeiten', 'gemeindetag' ),
		'update_item'        => __( 'Übernachtung Aktualisieren', 'gemeindetag' ),
		'search_items'       => __( 'Übernachtung Suchen', 'gemeindetag' ),
		'not_found'          => __( 'Nichts gefunden', 'gemeindetag' ),
		'not_found_in_trash' => __( 'Nichts im Papierkorb gefunden', 'gemeindetag' ),
	);

	$args = array(
		'labels'              => $labels,
		'description'         => __( 'Übernachtungen', 'gemeindetag' ),
		'menu_icon'           => 'dashicons-format-status',
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
		'rest_base'           => 'uebernachtungen',
	);
	register_post_type( 'uebernachtungen', $args );
}

$string           = array(
	'type'         => 'string',
	'single'       => true,
	'show_in_rest' => true,
);
$boolean          = array(
	'type'         => 'boolean',
	'single'       => true,
	'show_in_rest' => true,
);
$number           = array(
	'type'         => 'number',
	'single'       => true,
	'show_in_rest' => true,
);
$multiple_numbers = array(
	'type'         => 'number',
	'single'       => false,
	'show_in_rest' => true,
);


register_post_meta( 'uebernachtungen', 'price', $string );
register_post_meta( 'uebernachtungen', 'max-age', $string );
register_post_meta( 'uebernachtungen', 'valid-for', $multiple_numbers );
