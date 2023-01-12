<?php
/**
 * Plugin Name: Gemeindetage Anmeldung
 * Description: Anmeldung für den Mennonitischen Gemeindetag Weierhof 2023.
 * Author: Fabian Kägy
 * Author URI: fabian-kaegy.de
 * Version: 1.0.0
 *
 * @package gemeindetage-anmeldung
 */

namespace gemeindetag\anmeldung;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

/**
 * get plugin directory
 */
function _get_plugin_directory() {
	return __DIR__;
}

/**
 * get plugin url
 */
function _get_plugin_url() {
	static $plugin_url;

	if ( empty( $plugin_url ) ) {
		$plugin_url = plugins_url( null, __FILE__ );
	}

	return $plugin_url;
}

add_filter(
	'rest_anmeldung_collection_params',
	function ( $params, $post_type ) {
		if ( 'anmeldung' === $post_type->name && isset( $params['per_page'] ) ) {
			$params['per_page']['maximum'] = 5000;
		}
		return $params;
	},
	10,
	2
);

add_action( 'init', __NAMESPACE__ . '\register_blocks' );

/**
 * register block assets
 */
function register_blocks() {

	register_block_type( _get_plugin_directory() . '/build/anmeldeformular' );
	register_block_type( _get_plugin_directory() . '/build/send-email' );
	register_block_type( _get_plugin_directory() . '/build/callout' );
	register_block_type( _get_plugin_directory() . '/build/anmeldung' );
	register_block_type( _get_plugin_directory() . '/build/anmeldungen' );
	register_block_type( _get_plugin_directory() . '/build/card' );
	register_block_type( _get_plugin_directory() . '/build/ticket' );
}

require _get_plugin_directory() . '/anmeldungen-cpt.php';
require _get_plugin_directory() . '/email-upon-signup.php';
require _get_plugin_directory() . '/tickets-cpt.php';
require _get_plugin_directory() . '/essen-cpt.php';
require _get_plugin_directory() . '/kinderprogramm-cpt.php';
require _get_plugin_directory() . '/rest-api.php';
