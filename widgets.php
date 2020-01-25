<?php
/**
 * Add CPT Uebernachtungen
 *
 * @package gemeindetage-anmeldung
 */

namespace gemeindetag\anmeldung;

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

add_action( 'wp_dashboard_setup', __NAMESPACE__ . '\create_anmeldungen_stats_dashboard_widget' );

/**
 * create widgets
 */
function create_anmeldungen_stats_dashboard_widget() {
	wp_add_dashboard_widget(
		'anmeldungen_stats_dashboard_widget',
		'Anmeldungen',
		__NAMESPACE__ . '\render_anmeldungen_stats_dashboard_widget'
	);
}

function render_anmeldungen_stats_dashboard_widget() {
	echo '<div id="anmeldungen-stats-widget"  class="gemeindetag-stats-widget">Loading...</div>';
}



add_action( 'wp_dashboard_setup', __NAMESPACE__.'\create_workshops_stats_dashboard_widget' );
function create_workshops_stats_dashboard_widget() {
	wp_add_dashboard_widget( 
		'workshops_stats_dashboard_widget', 
		'Workshop Anmeldungen', 
		__NAMESPACE__.'\render_workshops_stats_dashboard_widget' 
	);
}

function render_workshops_stats_dashboard_widget() {
	echo '<div id="workshops-stats-widget"  class="gemeindetag-stats-widget">Loading...</div>';
}



add_action( 'wp_dashboard_setup', __NAMESPACE__.'\create_ausfluege_stats_dashboard_widget' );
function create_ausfluege_stats_dashboard_widget() {
	wp_add_dashboard_widget( 
		'ausfluege_stats_dashboard_widget', 
		'Ausflug Anmeldungen', 
		__NAMESPACE__.'\render_ausfluege_stats_dashboard_widget' 
	);
}

function render_ausfluege_stats_dashboard_widget() {
	echo '<div id="ausfluege-stats-widget" class="gemeindetag-stats-widget">Loading...</div>';
}




add_action( 'wp_dashboard_setup', __NAMESPACE__.'\create_essen_stats_dashboard_widget' );
function create_essen_stats_dashboard_widget() {
	wp_add_dashboard_widget( 
		'essen_stats_dashboard_widget', 
		'Essen Anmeldungen', 
		__NAMESPACE__.'\render_essen_stats_dashboard_widget' 
	);
}

function render_essen_stats_dashboard_widget() {
	echo '<div id="essen-stats-widget" class="gemeindetag-stats-widget">Loading...</div>';
}




add_action( 'wp_dashboard_setup', __NAMESPACE__.'\create_tickets_stats_dashboard_widget' );
function create_tickets_stats_dashboard_widget() {
	wp_add_dashboard_widget( 
		'tickets_stats_dashboard_widget', 
		'Anmeldungen pro Tag', 
		__NAMESPACE__.'\render_tickets_stats_dashboard_widget' 
	);
}

function render_tickets_stats_dashboard_widget() {
	echo '<div id="tickets-stats-widget" class="gemeindetag-stats-widget">Loading...</div>';
}




add_action( 'wp_dashboard_setup', __NAMESPACE__.'\create_printed_stats_dashboard_widget' );
function create_printed_stats_dashboard_widget() {
	wp_add_dashboard_widget( 
		'printed_stats_dashboard_widget', 
		'Druckprodukte', 
		__NAMESPACE__.'\render_printed_stats_dashboard_widget' 
	);
}

function render_printed_stats_dashboard_widget() {
	echo '<div id="printed-stats-widget" class="gemeindetag-stats-widget">Loading...</div>';
}




add_action( 'wp_dashboard_setup', __NAMESPACE__.'\create_age_stats_dashboard_widget' );
function create_age_stats_dashboard_widget() {
	wp_add_dashboard_widget( 
		'age_stats_dashboard_widget', 
		'Alter der Anmeldungen', 
		__NAMESPACE__.'\render_age_stats_dashboard_widget' 
	);
}

function render_age_stats_dashboard_widget() {
	echo '<div id="age-stats-widget" class="gemeindetag-stats-widget">Loading...</div>';
}