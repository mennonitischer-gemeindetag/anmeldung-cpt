<?php
/**
 * enqueue scripts
 *
 * @package gemeindetage-anmeldung
 */

namespace gemeindetag\anmeldung;

add_action( 'init', __NAMESPACE__ . '\register_block_assets' );

/**
 * register block assets
 */
function register_block_assets() {

	$block_path          = '/build/index.js';
	$script_dependencies = ( include _get_plugin_directory() . '/build/index.asset.php' );
	wp_register_script(
		'gemeindetag-anmeldung-blocks',
		_get_plugin_url() . $block_path,
		array_merge( $script_dependencies['dependencies'], [] ),
		$script_dependencies['version'],
		false
	);

	$style_path = '/style.css';
	wp_register_style(
		'gemeindetag-anmeldung-blocks-styles',
		_get_plugin_url() . $style_path,
		[],
		$script_dependencies['version']
	);

	$editor_path = '/editor.css';
	wp_register_style(
		'gemeindetag-anmeldung-blocks-editor-styles',
		_get_plugin_url() . $editor_path,
		[],
		$script_dependencies['version']
	);

	register_block_type(
		'gemeindetag/anmeldung',
		[
			'editor_script' => 'gemeindetag-anmeldung-blocks',
			'editor_style'  => 'gemeindetag-anmeldung-blocks-editor-styles',
			'style'         => 'gemeindetag-anmeldung-blocks-styles',
		]
	);
}

add_action( 'init', __NAMESPACE__ . '\enqueue_frontend_assets' );

/**
 * enqueue frontend assets
 */
function enqueue_frontend_assets() {

	// If in the backend, bail out.
	if ( is_admin() ) {
		return;
	}

	$frontend_path         = '/build/frontend.js';
	$frontend_dependencies = ( include _get_plugin_directory() . '/build/frontend.asset.php' );
	wp_enqueue_script(
		'gemeindetag-anmeldung-blocks-frontend',
		_get_plugin_url() . $frontend_path,
		array_merge( $frontend_dependencies['dependencies'], [] ),
		$frontend_dependencies['version'],
		false
	);
}


add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_widget_assets' );

/**
 * enqueue widget assets
 */
function enqueue_widget_assets() {
	$screen = get_current_screen();
	if ( 'dashboard' === $screen->id ) {

		$widgets_path         = '/build/widgets.js';
		$widgets_dependencies = ( include _get_plugin_directory() . '/build/widgets.asset.php' );

		wp_enqueue_script(
			'gemeindetag-anmeldung-dashboard-widgets',
			_get_plugin_url() . $widgets_path,
			array_merge( $widgets_dependencies['dependencies'], [ 'postbox', 'wp-data' ] ),
			$widgets_dependencies['version'],
			false
		);

		wp_enqueue_style(
			'gemeindetag-anmeldung-dashboard-widgets-style',
			_get_plugin_url() . '/widgets.css',
			[ 'wp-components' ],
			$widgets_dependencies['version']
		);
	}
}
