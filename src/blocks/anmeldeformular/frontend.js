import { render } from '@wordpress/element';
import Anmeldeformular from './Anmeldeformular';
import domReady from '@wordpress/dom-ready';
import ErrorBoundary from './components/ErrorBoundary';

domReady( function() {
	const root = document.querySelector( '.wp-block-gemeindetag-anmeldeformular' );
	if ( root ) {
		render(
			<ErrorBoundary>
				<Anmeldeformular />
			</ErrorBoundary>,
			root,
			null
		);
	}
} );
