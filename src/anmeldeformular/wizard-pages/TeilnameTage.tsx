import { Field, useFormState } from 'react-final-form';
import Wizard from '../Wizard';
import { useContext, useRef, useEffect } from '@wordpress/element';

import { AnmeldungKontext } from '../Anmeldeformular';

import { formatPrice } from '../helper/format-price';
import { getTicketPrice } from '../helper/get-ticket-price';

export default ( { tickets, kinderprogramm } ) => {
	const { age } = useContext( AnmeldungKontext );
	const { values } = useFormState();
	const hasReducedPrice = values.ermaessigt_adult;
	const isHelper = values.ermaessigt_mitarbeiter;

	const headingRef = useRef( null );
	useEffect( () => {
		if ( headingRef.current ) {
			headingRef.current.scrollIntoView();
		}
	}, [] );

	const isKid = age < 12;

	return (
		<Wizard.Page>
			<h2 ref={ headingRef } className={ 'section-heading' }>
				Teilnahmetage
			</h2>
			<Field
				id="mitarbeit-verguenstigung"
				name="ermaessigt_mitarbeiter"
				component="input"
				type="checkbox"
				style={ { marginBottom: '1rem' } }
			/>
			<label htmlFor="mitarbeit-verguenstigung">
				Ich bin vom Programmkomitee von der Teilnahmegebühren befreit
				worden.
			</label>

			<br />

			<section className="teilnametage">
				{ tickets
					.sort( ( a, b ) => a.id > b.id )
					.map( ( ticket ) => (
						<div key={ ticket.id }>
							<Field
								id={ `ticket-${ ticket.id }` }
								name="teilnahmetage"
								component="input"
								type="checkbox"
								value={ `${ ticket.id }` }
							/>
							<label htmlFor={ `ticket-${ ticket.id }` }>{ `${
								ticket.title.rendered
							} - ${ formatPrice(
								getTicketPrice(
									ticket,
									age,
									hasReducedPrice,
									isHelper
								)
							) }` }</label>
						</div>
					) ) }
				<p>
					Für die Teilnahme am Freitag und am Montag werden keine
					Tagungsgebühren erhoben.
				</p>
			</section>
			{ ! isKid && (
				<section className="mitarbeit">
					<h2>Mitarbeit</h2>
					<p>
						Ich möchte gerne freiwillig und ehrenamtlich beim
						Gemeindetag mithelfen:
					</p>
					{ [ 'Freitag', 'Samstag', 'Sonntag', 'Montag' ].map(
						( tag, key ) => (
							<div key={ key }>
								<Field
									id={ `Mitarbeit-${ tag }` }
									name="mitarbeit"
									component="input"
									type="checkbox"
									value={ tag }
								/>
								<label htmlFor={ `Mitarbeit-${ tag }` }>
									{ tag }
								</label>
							</div>
						)
					) }
				</section>
			) }
			{ isKid && (
				<section>
					<h2>Kinderprogramm</h2>
					{ Object.keys( kinderprogramm )
						.reverse()
						.map( ( day ) => (
							<div key={ day }>
								<h3>{ day }</h3>
								{ [ ...kinderprogramm[ day ] ]
									.reverse()
									.map( ( tagesprogramm ) => (
										<div key={ tagesprogramm.id }>
											<Field
												id={ tagesprogramm.id }
												name={ `kinderprogramm` }
												value={ tagesprogramm.id }
												type="checkbox"
												component={ `input` }
											/>
											<label htmlFor={ tagesprogramm.id }>
												{ tagesprogramm.zeit }
											</label>
										</div>
									) ) }
							</div>
						) ) }
					<div className="flex-column">
						<label htmlFor={ `kinderprogramm_bemerkung` }>
							Bemerkung
						</label>
						<Field
							id={ `kinderprogramm_bemerkung` }
							name={ `kinderprogramm_bemerkung` }
							type="text"
							component={ `textarea` }
						/>
					</div>
					<div className="flex-column">
						<label htmlFor={ `kinderprogramm_notfall_nummer` }>
							Notfall Nummer
						</label>
						<Field
							id={ `kinderprogramm_notfall_nummer` }
							name={ `kinderprogramm_notfall_nummer` }
							type="text"
							required={ true }
							component={ `input` }
						/>
					</div>
				</section>
			) }
		</Wizard.Page>
	);
};
