<?php

namespace gemeindetag\anmeldung;

//  Exit if accessed directly.
defined('ABSPATH') || exit;

function custom_post_type_anmeldung() {
	$labels = array(
		'name'                => __( 'Anmeldungen', 'gemeindetag'),
		'singular_name'       => __( 'Anmeldung', 'gemeindetag'),
		'menu_name'           => __( 'Anmeldungen', 'gemeindetag'),
		'parent_item_colon'   => __( 'Übergeordneter Anmeldung', 'gemeindetag'),
		'all_items'           => __( 'Alle Anmeldungen', 'gemeindetag'),
		'view_item'           => __( 'Anmeldung Anzeigen', 'gemeindetag'),
		'add_new_item'        => __( 'Neuen Anmeldung hinzufügen', 'gemeindetag'),
		'add_new'             => __( 'Neuen hinzufügen', 'gemeindetag'),
		'edit_item'           => __( 'Anmeldung bearbeiten', 'gemeindetag'),
		'update_item'         => __( 'Anmeldung Aktualisieren', 'gemeindetag'),
		'search_items'        => __( 'Anmeldung Suchen', 'gemeindetag'),
		'not_found'           => __( 'Nichts gefunden', 'gemeindetag'),
		'not_found_in_trash'  => __( 'Nichts im Papierkorb gefunden', 'gemeindetag')
	);
    
	$args = array(
		'labels'              => $labels,
		'description'         => __( 'Anmeldungen', 'gemeindetag'),
		'menu_icon'           => 'dashicons-money',
		'supports'            => array( 'title', 'editor', 'meta', 'custom-fields'),
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
    'template' => [
      [ 'gemeindetag/anmeldung', [] ],
		],
    'template_lock' => 'all', // or 'insert' to allow moving
		'capability_type'     => 'post',
        'show_in_rest'        => true,
        'rest_base'           => 'anmeldung',
    	
	);
    register_post_type( 'anmeldung', $args );

}
add_action( 'init', __NAMESPACE__.'\custom_post_type_anmeldung', 0 );

    
$string = [
  'type' => 'string',
  'single' => true,
  'show_in_rest' => true,
];
$boolean = [
  'type' => 'boolean',
  'single' => true,
  'show_in_rest' => true,
];
$number = [
  'type' => 'string',
  'single' => true,
  'show_in_rest' => true,
];
$multiple_numbers = [
  'show_in_rest' => true,
  'type' => 'array',
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
  'type' => 'array',
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

register_post_meta( 'anmeldung', 'nachname', $string );
register_post_meta( 'anmeldung', 'vorname', $string );
register_post_meta( 'anmeldung', 'geschlecht', $string );
register_post_meta( 'anmeldung', 'adresse_straße', $string );
register_post_meta( 'anmeldung', 'adresse_plz', $number );
register_post_meta( 'anmeldung', 'adresse_ort', $string );
register_post_meta( 'anmeldung', 'geb_datum', $string );
register_post_meta( 'anmeldung', 'ermaessigt_adult', $boolean );
register_post_meta( 'anmeldung', 'telefonnummer', $string );
register_post_meta( 'anmeldung', 'email', $string );
register_post_meta( 'anmeldung', 'teilnahmetage', $multiple_numbers );
register_post_meta( 'anmeldung', 'mitarbeit', $multiple_strings );
register_post_meta( 'anmeldung', 'kinderprogramm', $multiple_numbers );
register_post_meta( 'anmeldung', 'kinderprogramm_bemerkung', $string );
register_post_meta( 'anmeldung', 'kinderprogramm_notfall_nummer', $string );
register_post_meta( 'anmeldung', 'ausfluege', $multiple_numbers );
register_post_meta( 'anmeldung', 'workshops', $multiple_numbers );
register_post_meta( 'anmeldung', 'uebernachtung_and_breakfast', $boolean );
register_post_meta( 'anmeldung', 'uebernachtung_zelt_mit', $boolean );
register_post_meta( 'anmeldung', 'uebernachtung', $multiple_numbers );
register_post_meta( 'anmeldung', 'verpflegung', $multiple_numbers );
register_post_meta( 'anmeldung', 'bemerkung', $string );
register_post_meta( 'anmeldung', 'allergien', $string );
register_post_meta( 'anmeldung', 'datenschutz_akzeptiert', $boolean );
register_post_meta( 'anmeldung', 'daten_fuer_mitfahrgelegenheit_teilen', $boolean );
register_post_meta( 'anmeldung', 'gedrucktes_programmheft', $boolean );
register_post_meta( 'anmeldung', 'gedrucktes_liederheft', $boolean );
register_post_meta( 'anmeldung', 'status', $string );
register_post_meta( 'anmeldung', 'rechnung_versand', $boolean );
register_post_meta( 'anmeldung', 'betrag', $number );
register_post_meta( 'anmeldung', 'zahlungsbestaetigung_versand', $boolean );


/**
 * A filter to add custom columns and remove built-in
 * columns from the edit.php screen.
 * 
 * @access public
 * @param Array $columns The existing columns
 * @return Array $filtered_columns The filtered columns
 */
function modify_columns( $columns ) {

    // New columns to add to table
    $new_columns =[
      'status' => 'Status',
      'name' => 'Name',
      'invoice_id' => 'Rechnungs Nummer'
    ];
      
    // Remove unwanted publish date column
    unset( $columns['date'] );
    $columns[ 'title' ] = 'Anmeldung'; 
    
    // Combine existing columns with new columns
    $filtered_columns = array_merge( $columns, $new_columns );
  
    // Return our filtered array of columns
    return $filtered_columns;
  }
  
  // Let WordPress know to use our filter
  add_filter('manage_anmeldung_posts_columns' , __NAMESPACE__.'\modify_columns');




/**
 * Render custom column content within edit.php 
 * table on anmeldung post types.
 * 
 * @access public
 * @param String $column The name of the column being acted upon
 * @return void
 */
function custom_column_content( $column ) {
  
  // Get the post object for this row so we can output relevant data
  global $post;
  
  // Check to see if $column matches our custom column names
  switch ( $column ) {

    case 'status' :
      // Retrieve post meta
      $start = get_post_meta( $post->ID, 'status', true );
      
      // Echo output and then include break statement
      echo ( !empty( $start ) ? $start : '' );
      break;

    case 'name' :
      // Retrieve post meta
      $vorname = get_post_meta( $post->ID, 'vorname', true );
      $nachname = get_post_meta( $post->ID, 'nachname', true );
      
      // Echo output and then include break statement
      echo ( !empty( $vorname ) ? "$vorname $nachname" : '' );
      break;

    case 'invoice_id' :
      // Echo output and then include break statement
      echo ( "$post->ID" );
      break;
      
  }
}

// Let WordPress know to use our action
add_action( 'manage_anmeldung_posts_custom_column', __NAMESPACE__.'\custom_column_content' );


/**
 * Make custom columns sortable.
 * 
 * @access public
 * @param Array $columns The original columns
 * @return Array $columns The filtered columns
 */
function custom_columns_sortable( $columns ) {
  
    // Add our columns to $columns array
    $columns['status'] = 'status';
    $columns['name'] = 'name';
    $columns['invoice_id'] = 'invoice_id';

    return $columns;
}

// Let WordPress know to use our filter
add_filter( 'manage_edit-anmeldung_sortable_columns', __NAMESPACE__.'\custom_columns_sortable' );
