/* eslint-disable camelcase */
import calculateLatePayment from './calculate-late-payment';
import { getTicketPrice } from './get-ticket-price';
import {
	WP_REST_API_Ausfluege,
	WP_REST_API_Essen,
	WP_REST_API_Tickets,
	WP_REST_API_Workshop,
} from '../types';

export function add( accumulator, a ) {
	return accumulator + a;
}

export const addValueOfKey =
	( key: string = 'price' ) =>
	( summe: number, item ) => {
		if ( ! item.meta[ key ] && ! isNaN( item.meta[ key ] ) ) {
			return summe;
		}
		return summe + Number( item.meta[ key ] );
	};

export function getWorkshopsTotalPrice( workshops: WP_REST_API_Workshop[] ) {
	return workshops.reduce( addValueOfKey( 'preis' ), 0 );
}

export function getTripsTotalPrice( trips: WP_REST_API_Ausfluege[] ) {
	return trips.reduce( addValueOfKey( 'preis' ), 0 );
}

export function getFoodTotalPrice( food: WP_REST_API_Essen[], age ) {
	const isKid = age < 13;

	const totalPrice = food.reduce( addValueOfKey( 'price' ), 0 );

	return isKid ? totalPrice / 2 : totalPrice;
}

export function getTicketTotalPrice(
	tickets: WP_REST_API_Tickets[],
	age: number
): number {
	return tickets.reduce( ( summe, ticket ) => {
		return summe + Number( getTicketPrice( ticket, age ) );
	}, 0 );
}

export default function calculateTotalPrice( {
	workshops,
	trips,
	age,
	isSleepingOnSite,
	food,
	tickets,
}: {
	workshops: Array< WP_REST_API_Workshop >;
	trips: Array< WP_REST_API_Ausfluege >;
	age: number;
	food: Array< WP_REST_API_Essen >;
	tickets: Array< WP_REST_API_Tickets >;
	isSleepingOnSite: Boolean;
} ) {
	const prices = [
		getWorkshopsTotalPrice( workshops ),
		getTripsTotalPrice( trips ),
		getFoodTotalPrice( food, age ),
		getTicketTotalPrice( tickets, age ),
		calculateLatePayment(),
		isSleepingOnSite ? 15 : 0,
	];

	return prices.reduce( add, 0 );
}
