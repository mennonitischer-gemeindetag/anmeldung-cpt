export enum RoomType {
	'einzelzimmer' = 'einzelzimmer',
	'doppelzimmer' = 'doppelzimmer',
	'mehrbettzimmer' = 'mehrbettzimmer',
}

export interface CalculatePriceParams {
	adults: number;
	teenager: number;
	children: number;
	toddlers: number;
	roomType: RoomType;
	numberOfNights: number;
}

export enum RoomPrice {
	'einzelzimmer' = 41.9,
	'doppelzimmer' = 33.9,
	'mehrbettzimmer' = 27.1,
}

export function calculatePrice( {
	adults,
	teenager,
	children,
	roomType,
	numberOfNights,
}: CalculatePriceParams ): number {
	const priceAdults = Number( adults ) * RoomPrice[ roomType ];
	const priceTeenagers = Number( teenager ) * RoomPrice[ roomType ];
	const priceChildren = Number( children ) * RoomPrice[ roomType ] * 0.5;

	const pricePerNight = priceAdults + priceTeenagers + priceChildren;
	const totalPrice = pricePerNight * numberOfNights;
	return totalPrice;
}
