<?php 
/**
 * Plugin Name: Gemeindetage Anmeldung
 * Description: Anmeldung für den Mennonitischen Gemeindetag Weierhof 2020.
 * Author: Fabian Kägy
 * Author URI: fabian-kaegy.de
 * Version: 1.0.0
 */

namespace gemeindetag\anmeldung;

//  Exit if accessed directly.
defined('ABSPATH') || exit;

function _get_plugin_directory() {
	return __DIR__;
}

function _get_plugin_url() {
	static $plugin_url;

	if ( empty( $plugin_url ) ) {
		$plugin_url = plugins_url( null, __FILE__ );
	}

	return $plugin_url;
}

add_filter( 'rest_anmeldung_collection_params', function ( $params, $post_type ) {
	if ( 'anmeldung' === $post_type->name && isset( $params['per_page'] ) ) {
		$params['per_page']['maximum'] = 5000;
	}

	return $params;
}, 10, 2 );

include _get_plugin_directory() . '/anmeldungen-cpt.php';
include _get_plugin_directory() . '/email-upon-signup.php';
include _get_plugin_directory() . '/tickets-cpt.php';
include _get_plugin_directory() . '/essen-cpt.php';
include _get_plugin_directory() . '/kinderprogramm-cpt.php';
include _get_plugin_directory() . '/rest-api.php';
include _get_plugin_directory() . '/lib/enqueue-scripts.php';
include _get_plugin_directory() . '/widgets.php';

