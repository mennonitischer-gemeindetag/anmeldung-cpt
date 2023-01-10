import { Field, useFormState } from 'react-final-form';
import Wizard from '../Wizard';
import { useContext } from '@wordpress/element';
import { AnmeldungKontext } from '../Anmeldeformular';

import { formatPrice } from '../helper/format-price';

export type WP_Ticket = {
	title: Object;
	meta: {
		price_adult: Number;
		price_teen: Number;
		price_kid: Number;
	};
};

/**
 * get price for the ticket
 *
 * @param {WP_Ticket} ticket          wordpress ticket object
 * @param {number}    age             the age of the user
 * @param {boolean}   hasReducedPrice whether or not the ticket has a reduced price
 * @return {number} the price of the ticket
 */
export const getTicketPrice = ( ticket, age, hasReducedPrice = false ) => {
	const {
		price_adult: priceAdult,
		price_teen: priceTeen,
		price_kid: priceKid,
	} = ticket.meta;

	if ( age === 0 ) {
		return priceAdult;
	}

	if ( age <= 3 ) {
		return priceKid;
	}

	if ( age <= 18 || hasReducedPrice ) {
		return priceTeen;
	}

	return priceAdult;
};

export default ( { tickets, kinderprogramm } ) => {
	const { age } = useContext( AnmeldungKontext );
	const { values } = useFormState();
	const hasReducedPrice = values.ermaessigt_adult;

	const isKid = age <= 13;

	return (
		<Wizard.Page>
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
							} - ${ formatPrice(
								getTicketPrice( ticket, age, hasReducedPrice )
							) }` }</label>
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
							component={ `input` }
						/>
					</div>
				</section>
			) }
		</Wizard.Page>
	);
};
