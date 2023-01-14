/* eslint-disable camelcase */
import { getTicketPrice } from './get-ticket-price';
import { describe, expect, test } from '@jest/globals';
import { WP_REST_API_Tickets } from '../types';

const SAMPLE_TICKET = {
	meta: {
		price_adult: '15',
		price_teen: '10',
		price_kid: '5',
	},
} as WP_REST_API_Tickets;

describe( 'getTicketPrice', () => {
	test( 'should return the price for kids', () => {
		expect( getTicketPrice( SAMPLE_TICKET, 5 ) ).toBe( 5 );
	} );

	test( 'should return the price for adults', () => {
		expect( getTicketPrice( SAMPLE_TICKET, 25 ) ).toBe( 15 );
	} );

	test( 'should return the price for teens', () => {
		expect( getTicketPrice( SAMPLE_TICKET, 15 ) ).toBe( 10 );
	} );

	test( 'should return the price for teens with reduced price', () => {
		expect( getTicketPrice( SAMPLE_TICKET, 15, true ) ).toBe( 10 );
	} );

	test( 'should return the price for adults with reduced price', () => {
		expect( getTicketPrice( SAMPLE_TICKET, 25, true ) ).toBe( 10 );
	} );

	test( 'it should be free for kids below 3', () => {
		expect( getTicketPrice( SAMPLE_TICKET, 2 ) ).toBe( 0 );
	} );

	test( 'it should return the adult price if the date cannot be identified', () => {
		expect( getTicketPrice( SAMPLE_TICKET, 0 ) ).toBe( 15 );
	} );

	test( 'it should return the adult price if the date cannot be identified', () => {
		// @ts-expect-error
		expect( getTicketPrice( SAMPLE_TICKET, '0' ) ).toBe( 15 );
	} );
} );
