<?php
/**
 * Add CPT for kidsprogramm
 *
 * @package gemeindetage-anmeldung
 */

namespace gemeindetag\anmeldung;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * register cpt kinderprogramm
 */
function custom_post_type_kinderprogramm() {
	$labels = array(
		'name'               => __( 'Kinderprogramm', 'gemeindetag' ),
		'singular_name'      => __( 'Kinderprogramm', 'gemeindetag' ),
		'menu_name'          => __( 'Kinderprogramm', 'gemeindetag' ),
		'all_items'          => __( 'Alle Programme', 'gemeindetag' ),
		'view_item'          => __( 'Kinderprogramm Anzeigen', 'gemeindetag' ),
		'add_new_item'       => __( 'Neues Kinderprogramm hinzufügen', 'gemeindetag' ),
		'add_new'            => __( 'Neues hinzufügen', 'gemeindetag' ),
		'edit_item'          => __( 'Kinderprogramm bearbeiten', 'gemeindetag' ),
		'update_item'        => __( 'Kinderprogramm Aktualisieren', 'gemeindetag' ),
		'search_items'       => __( 'Kinderprogramm Suchen', 'gemeindetag' ),
		'not_found'          => __( 'Nichts gefunden', 'gemeindetag' ),
		'not_found_in_trash' => __( 'Nichts im Papierkorb gefunden', 'gemeindetag' ),
	);

	$args = array(
		'labels'              => $labels,
		'description'         => __( 'Kinderprogramm', 'gemeindetag' ),
		'menu_icon'           => 'dashicons-buddicons-activity',
		'supports'            => array( 'title', 'editor', 'meta', 'custom-fields' ),
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
		'rest_base'           => 'kinderprogramm',
	);
	register_post_type( 'kinderprogramm', $args );

}
add_action( 'init', __NAMESPACE__ . '\custom_post_type_kinderprogramm', 0 );

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

register_post_meta( 'kinderprogramm', 'tag', $string );
register_post_meta( 'kinderprogramm', 'tageszeit', $string );



