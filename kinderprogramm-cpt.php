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
	$labels = [
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
	];

	$args = [
		'labels'              => $labels,
		'description'         => __( 'Kinderprogramm', 'gemeindetag' ),
		'menu_icon'           => 'dashicons-buddicons-activity',
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
		'rest_base'           => 'kinderprogramm',
	];
	register_post_type( 'kinderprogramm', $args );

}
add_action( 'init', __NAMESPACE__ . '\custom_post_type_kinderprogramm', 0 );

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

register_post_meta( 'kinderprogramm', 'tag', $string );
register_post_meta( 'kinderprogramm', 'tageszeit', $string );




/**
 * A filter to add custom columns and remove built-in
 * columns from the edit.php screen.
 *
 * @access public
 * @param Array $columns The existing columns
 * @return Array $filtered_columns The filtered columns
 */
function kinderprogramm_modify_columns( $columns ) {

	// New columns to add to table
	$new_columns = [
		'anmeldungen' => 'Anmeldungen',
	];

	// Remove unwanted publish date column
	unset( $columns['date'] );

	// rename columns
	$columns['title'] = 'Kinderprogramm';

	// Combine existing columns with new columns
	$filtered_columns = array_merge( $columns, $new_columns );

	// Return our filtered array of columns
	return $filtered_columns;
}

// Let WordPress know to use our filter
add_filter( 'manage_kinderprogramm_posts_columns', __NAMESPACE__ . '\kinderprogramm_modify_columns' );


/**
 * Render custom column content within edit.php
 * table on kinderprogramm post types.
 *
 * @access public
 * @param String $column The name of the column being acted upon
 * @return void
 */
function kinderprogramm_custom_column_content( $column ) {

	// Get the post object for this row so we can output relevant data
	global $post;

	// Check to see if $column matches our custom column names
	switch ( $column ) {

		case 'anmeldungen':
			$post_id = $post->ID;
			$query   = new \WP_Query(
				[
					'post_type'      => 'anmeldung',
					'posts_per_page' => -1,
					'meta_query'     => [
						'relation' => 'AND',
						[
							'key'     => 'kinderprogramm',
							'value'   => $post_id,
							'compare' => 'LIKE',
						],
						[
							'key'     => 'status',
							'value'   => 'storniert',
							'compare' => '!=',
						],
					],
				]
			);

			echo esc_attr( $query->found_posts );
			break;

	}
}

// Let WordPress know to use our action
add_action( 'manage_kinderprogramm_posts_custom_column', __NAMESPACE__ . '\kinderprogramm_custom_column_content' );
