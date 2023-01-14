import { render } from '@wordpress/element';
import { Anmeldeformular } from './Anmeldeformular.tsx';
import domReady from '@wordpress/dom-ready';
import ErrorBoundary from './../anmeldeformular/components/ErrorBoundary';

domReady( function () {
	const root = document.querySelector(
		'.wp-block-gemeindetag-jugendherberge-anmeldeformular'
	);
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
