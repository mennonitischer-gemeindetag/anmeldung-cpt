import { Component } from '@wordpress/element';
import * as Sentry from '@sentry/browser';

Sentry.init( {
	dsn: 'https://53d712b40e404b9480666991a74dfdb6@sentry.io/1834033',
} );

class ErrorBoundary extends Component {
	constructor( props ) {
		super( props );
		this.state = { eventId: null };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch( error, errorInfo ) {
		Sentry.withScope( ( scope ) => {
			scope.setExtras( errorInfo );
			const eventId = Sentry.captureException( error );
			this.setState( { eventId } );
		} );
	}

	render() {
		if ( this.state.hasError ) {
			//render fallback UI
			return (
				<>
					<h2 className={ 'section-heading' }>
						Leider ist ein Fehler aufgetreten.
					</h2>
					<div>
						Bitte versuche es in einigen Minuten erneut. Sollte der
						Fehler mehrfach auftreten, melde dich bitte unter
						folgender E-Mail-Adresse bei uns:{ ' ' }
						<a href="mailto:gemeindetag@mennoniten.de">
							gemeindetag@mennoniten.de
						</a>
						. Danke für dein Verständnis!
					</div>
					<button
						onClick={ () =>
							Sentry.showReportDialog( {
								eventId: this.state.eventId,
							} )
						}
					>
						Report feedback
					</button>
				</>
			);
		}

		//when there's not an error, render children untouched
		return this.props.children;
	}
}

export default ErrorBoundary;
