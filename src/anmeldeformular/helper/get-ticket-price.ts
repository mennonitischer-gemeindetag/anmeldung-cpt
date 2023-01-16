/* eslint-disable camelcase */
import { WP_REST_API_Tickets } from '../types';

/**
 * get price for the ticket
 *
 * @param {WP_REST_API_Tickets} ticket          wordpress ticket object
 * @param {number}              age             the age of the user
 * @param {boolean}             hasReducedPrice whether or not the ticket has a reduced price
 * @param {boolean}             isHelper        whether or not the ticket has a reduced price because of a helper
 * @return {number} the price of the ticket
 */
export const getTicketPrice = (
	ticket: WP_REST_API_Tickets,
	age: number,
	hasReducedPrice: Boolean = false,
	isHelper: Boolean = false
) => {
	if ( isHelper ) {
		return 0;
	}

	const {
		price_adult: priceAdult,
		price_teen: priceTeen,
		price_kid: priceKid,
	} = ticket.meta;

	if ( age === 0 || Number.isNaN( age ) || ! Number.isFinite( age ) ) {
		return Number( priceAdult );
	}

	// if age is under 3, the ticket is free
	if ( age < 3 ) {
		return 0;
	}

	// if age is between 3 and 13, the ticket for kids
	if ( age < 12 ) {
		return Number( priceKid );
	}

	if ( age <= 18 || hasReducedPrice ) {
		return Number( priceTeen );
	}

	return Number( priceAdult );
};
