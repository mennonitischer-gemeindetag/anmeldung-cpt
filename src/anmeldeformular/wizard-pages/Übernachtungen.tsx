import { Field, useFormState } from 'react-final-form';
import Wizard from '../Wizard';

export default function Uebernachtungen() {
	const {
		values: { uebernachtung_and_breakfast: hasUebernachtungAndBreakfast },
	} = useFormState();

	return (
		<Wizard.Page>
			<h2 className={ 'section-heading' }>Übernachtung</h2>
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
					Montag (01.05.2023)
				</label>
			</div>
			<p>
				Anmeldungen für die Jugendherberge Leutesdorf erfolgen auf einer
				extra Anmeldeseite
			</p>
		</Wizard.Page>
	);
}
