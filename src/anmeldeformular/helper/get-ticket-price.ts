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
export default function getTicketPrice( ticket, age, hasReducedPrice = false ) {
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
}
