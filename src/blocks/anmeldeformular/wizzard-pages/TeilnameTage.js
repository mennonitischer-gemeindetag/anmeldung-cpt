import { Field, useFormState } from 'react-final-form';
import Wizzard from '../Wizzard';
import { useContext } from '@wordpress/element';
import { AnmeldungKontext } from '../Anmeldeformular';

import { formatPrice } from '../helper/format-price';

export const getPrice = ( ticket, age ) => {
	const { price_adult, price_teen, price_kid } = ticket.meta;
	const { values } = useFormState();

	if ( age === 0 ) {
		return price_adult;
	}

	if ( age <= 3 ) {
		return price_kid;
	}

	if ( age <= 18 || values.ermaessigt_adult ) {
		return price_teen;
	}

	return price_adult;
};

export default ( { tickets, kinderprogramm } ) => {
	const { age } = useContext( AnmeldungKontext );

	const isKid = age <= 13;

	return (
		<Wizzard.Page>
			<h2 className={ 'section-heading' }>Teilnahmetage</h2>
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
							} - ${ formatPrice( getPrice( ticket, age ) ) }` }</label>
						</div>
					) ) }
				<p>
          Für die Teilnahme am Donnerstag und am Sonntag werden keine
          Tagungsgebühren erhoben.
				</p>
			</section>
			{ ! isKid && (
				<section className="mitarbeit">
					<h2>Mitarbeit</h2>
					<p>
            Ich möchte gerne freiwillig und ehrenamtlich beim Gemeindetag
            mithelfen:
					</p>
					{ [ 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag' ].map( ( tag, key ) => (
						<div key={ key }>
							<Field
								id={ `Mitarbeit-${ tag }` }
								name="mitarbeit"
								component="input"
								type="checkbox"
								value={ tag }
							/>
							<label htmlFor={ `Mitarbeit-${ tag }` }>{ tag }</label>
						</div>
					) ) }
				</section>
			) }
			{ isKid && (
				<section>
					<h2>Kinderprogramm</h2>
					{ Object.keys( kinderprogramm )
						.reverse()
						.map( ( day ) => (
							<div>
								<h3>{ day }</h3>
								{ [ ...kinderprogramm[ day ] ].reverse().map( ( tagesprogramm ) => (
									<div>
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
						<label htmlFor={ `kinderprogramm_bemerkung` }>Bemerkung</label>
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
							component={ `input` }
						/>
					</div>
				</section>
			) }
		</Wizzard.Page>
	);
};
