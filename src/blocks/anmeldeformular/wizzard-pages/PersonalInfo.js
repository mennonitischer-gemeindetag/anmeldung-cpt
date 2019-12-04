import { Field } from 'react-final-form-html5-validation';
import Wizzard from '../Wizzard';
import { useContext } from '@wordpress/element';
import { OnChange } from 'react-final-form-listeners';
import { AnmeldungKontext } from '../Anmeldeformular';

export default ( { setAge } ) => {
	const { age } = useContext( AnmeldungKontext );
	const isAdult = age >= 18;

	return (
		<Wizzard.Page>
			<h2 className={ 'section-heading' }>Anmeldung</h2>
			<div className="vorname">
				<Field
					component="input"
					type={ 'text' }
					id="vorname"
					name={ 'vorname' }
					required
				>
					{ ( { input, meta } ) => (
						<>
							<label htmlFor="vorname">Vorname</label>
							<input
								{ ...input }
								placeholder={ 'Max' }
								autoComplete="given-name"
								required={ true }
							></input>
							{ meta.error && meta.touched && <span>{ meta.error }</span> }
						</>
					) }
				</Field>
			</div>
			<div className="nachname">
				<label htmlFor="nachname">Nachname</label>
				<Field
					component="input"
					id="nachname"
					type={ 'text' }
					placeholder={ 'Mustermann' }
					name={ 'nachname' }
					autoComplete="family-name"
					required
				/>
			</div>
			<div className="straße">
				<label htmlFor="strasse">Straße</label>
				<Field
					component="input"
					id="strasse"
					type={ 'text' }
					placeholder={ 'Musterstraße 6a' }
					name={ 'adresse_straße' }
					autoComplete="address-line1"
					required
				/>
			</div>
			<div className={ 'ort-container' }>
				<label htmlFor="plz">Plz</label>
				<Field
					component="input"
					id="plz"
					type={ 'text' }
					placeholder={ '67295' }
					name={ 'adresse_plz' }
					autoComplete="postal-code"
					required
				/>
				<label htmlFor="ort">Ort</label>
				<Field
					component="input"
					id="ort"
					type={ 'text' }
					placeholder={ 'Musterstadt' }
					name={ 'adresse_ort' }
					autoComplete="address-level2"
					required
				/>
			</div>
			<div className="geburtstag">
				<label htmlFor="geburtstag">Geburtstag</label>
				<Field
					component="input"
					id="geburtstag"
					type={ 'text' }
					placeholder={ 'dd.mm.yyyy' }
					name={ 'geb_datum' }
					autoComplete="bday"
					required
				/>
				<OnChange name="geb_datum">
					{ ( value ) => {
						setAge( value );
					} }
				</OnChange>
			</div>
			{ isAdult && (
				<div className="geburtstag">
					<Field
						component="input"
						id="geburtstag_ermaessigt"
						type={ 'checkbox' }
						name={ 'ermaessigt_adult' }
					/>
					<label htmlFor="geburtstag_ermaessigt">
            Studierend, Arbeitslos, Azubi, FSJler
					</label>
				</div>
			) }
			<div className="telefonnummer">
				<label htmlFor="telefonnummer">Telefonnummer</label>
				<Field
					component="input"
					id="telefonnummer"
					type={ 'tel' }
					placeholder={ '+49 123 45678912' }
					name={ 'telefonnummer' }
					autoComplete="tel"
				/>
			</div>
			<div className="email">
				<label htmlFor="email">Email</label>
				<Field
					component="input"
					id="email"
					type={ 'email' }
					placeholder={ 'max@mustermann.de' }
					name={ 'email' }
					autoComplete="email"
					required
				/>
			</div>
			<div className="geschlecht">
				<label htmlFor="geschlecht">Geschlecht:</label>
				<Field
					name="geschlecht"
					component="select"
					id="geschlecht"
					required={ true }
				>
					<option />
					<option value="männlich">Männlich</option>
					<option value="weiblich">Weiblich</option>
					<option value="divers">Divers</option>
				</Field>
			</div>
		</Wizzard.Page>
	);
};
