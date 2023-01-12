import { useRef, useEffect } from '@wordpress/element';

export default function Success( props ) {
	const headingRef = useRef( null );
	useEffect( () => {
		if ( headingRef.current ) {
			headingRef.current.scrollIntoView();
		}
	}, [] );
	return (
		<div>
			<h2 ref={ headingRef } className={ 'section-heading' }>
				Vielen Dank!
			</h2>
			<div>
				Deine Anmeldung ({ props.signUpID }) zum AMG-Gemeindetag 2023 in
				Neuwied ist eingegangen. Du solltest in den nächsten Minuten
				eine E-Mail von{ ' ' }
				<a href="mailto:gemeindetag@mennoniten.de">
					gemeindetag@mennoniten.de
				</a>{ ' ' }
				bekommen.{ '\n' }
				Sollte dies nicht der Fall sein, kontrolliere deinen SPAM
				Ordner. Sollte nach 24 Stunden keine E-Mail eingegangen sein,
				wende dich an{ ' ' }
				<a href="mailto:gemeindetag@mennoniten.de">
					gemeindetag@mennoniten.de
				</a>
				.
				<button
					type="button"
					onClick={ () => {
						window.location.reload();
					} }
				>
					Weitere Anmeldung ausfüllen
				</button>
			</div>
		</div>
	);
}
