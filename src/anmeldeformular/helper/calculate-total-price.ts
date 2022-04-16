import calculateLatePayment from "./calculate-late-payment";
import getTicketPrice from "./get-ticket-price";

function add(accumulator, a) {
  return accumulator + a;
}

const addValueOfKey = ( key = 'price' ) => ( summe, item ) => {
	if ( ! item.meta[ key ] && ! isNaN( item.meta[ key ] ) ) {
		return summe;
	}
	return summe + parseInt( item.meta[ key ] );
};

function getWorkshopsTotalPrice(workshops) {
	return workshops.reduce( addValueOfKey( 'preis' ), 0 );
}

function getTripsTotalPrice(trips) {
	return trips.reduce( addValueOfKey( 'preis' ), 0 );
}

function getFoodTotalPrice( food, age ) {
	const isFreeKidMeal = age <= 9;

	return isFreeKidMeal
		? 0
		: food.reduce( addValueOfKey( 'price' ), 0 )
}

function getTicketTotalPrice( tickets, age ) {
	return tickets.reduce( ( summe, ticket ) => {
		return summe + parseInt( getTicketPrice( ticket, age ) );
	}, 0 );
}

export default function calculateTotalPrice( {
	workshops,
	trips,
	age,
	food,
	tickets,
	sleepingOnSite
} ) {

	const prices = [
		getWorkshopsTotalPrice( workshops ),
		getTripsTotalPrice( trips ),
		getFoodTotalPrice( food, age ),
		getTicketTotalPrice( tickets, age ),
		sleepingOnSite ? 15 : 0,
		calculateLatePayment()
	];

	return prices.reduce( add, 0 );
}