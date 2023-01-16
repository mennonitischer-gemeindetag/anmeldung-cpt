import { Field, useFormState } from 'react-final-form';
import { useRef, useEffect } from '@wordpress/element';
import Wizard from '../Wizard';

export default function Uebernachtungen() {
	const {
		values: { uebernachtung_and_breakfast: hasUebernachtungAndBreakfast },
	} = useFormState();

	const headingRef = useRef( null );
	useEffect( () => {
		if ( headingRef.current ) {
			headingRef.current.scrollIntoView();
		}
	}, [] );

	return (
		<Wizard.Page>
			<h2 ref={ headingRef } className={ 'section-heading' }>
				Übernachtung
			</h2>
			<p>
				Hotels bitte selbständig buchen. Für Jugendliche, und junge
				Erwachsene steht eine Gruppenunterkunft in einem Massenlager zur
				Verfügung. Der Ort wird noch bekannt gegeben.
			</p>
			<div>
				<Field
					component={ 'input' }
					name={ 'uebernachtung_and_breakfast' }
					type={ 'checkbox' }
					id={ 'uebernachtung_and_breakfast' }
				/>
				<label htmlFor={ 'uebernachtung_and_breakfast' }>
					Massenlager inkl. Frühstück von Freitag (28.04.2023) bis
					Montag (01.05.2023) (15€)
				</label>
			</div>
			<p>
				Anmeldungen für die Jugendherberge Leutesdorf erfolgen auf einer
				<a
					href="https://gemeindetag.mennoniten.de/jugendherberge-leutesdorf/"
					target="_blank"
					rel="noreferrer"
				>
					extra Anmeldeseite
				</a>
			</p>
		</Wizard.Page>
	);
}
