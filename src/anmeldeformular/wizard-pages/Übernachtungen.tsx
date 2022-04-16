import { Field, useFormState } from 'react-final-form';
import Wizard from '../Wizard';

export default function Uebernachtungen() {
	const {
		values: { uebernachtung_and_breakfast },
	} = useFormState();

	return (
		<Wizard.Page>
			<h2 className={ 'section-heading' }>Übernachtung</h2>
			<p>
				Unterkünfte bitte selbständig buchen. Für Jugendliche,
				Studierende, Azubis und FSJler*innen steht eine
				Gruppenunterkunft in der Turnhalle des Gymnasium Weierhof zur
				Verfügung (Lageplan Nr. 7).
			</p>
			<div>
				<Field
					component={ 'input' }
					name={ 'uebernachtung_and_breakfast' }
					type={ 'checkbox' }
					id={ 'uebernachtung_and_breakfast' }
				/>
				<label htmlFor={ 'uebernachtung_and_breakfast' }>
					Jugend Übernachtung mit Frühstück - 15€
				</label>
			</div>
			{ uebernachtung_and_breakfast && (
				<section>
					<div>
						<Field
							component={ 'input' }
							name={ 'uebernachtung' }
							value={ 'Turnhalle' }
							type={ 'radio' }
							id={ 'uebernachtung-turnhalle' }
						/>
						<label htmlFor={ 'uebernachtung-turnhalle' }>
							Übernachtung in der Turnhalle des Gymnasium Weierhof
							mit Frühstück (08:00 – 9:00 Uhr) von Donnerstag
							(21.05.2020) bis Sonntag (24.05.2020)
						</label>
					</div>
					<div>
						<Field
							component={ 'input' }
							name={ 'uebernachtung' }
							value={ 'Eigenes Zelt' }
							type={ 'radio' }
							id={ 'uebernachtung-eigenes-zelt' }
						/>
						<label htmlFor={ 'uebernachtung-eigenes-zelt' }>
							Ich bringe mein eigenes Zelt mit
						</label>
					</div>
					<div>
						<Field
							component={ 'input' }
							name={ 'uebernachtung' }
							value={ 'Im Zelt mit...' }
							type={ 'radio' }
							id={ 'uebernachtung-zelt-mit-checkbox' }
						/>
						<label htmlFor={ 'uebernachtung-zelt-mit-checkbox' }>
							Übernachtung im Zelt mit ...
						</label>
						<Field
							component={ 'input' }
							name={ 'uebernachtung_zelt_mit' }
							type={ 'text' }
							id={ 'uebernachtung-zelt-mit' }
						/>
					</div>
				</section>
			) }
		</Wizard.Page>
	);
};
