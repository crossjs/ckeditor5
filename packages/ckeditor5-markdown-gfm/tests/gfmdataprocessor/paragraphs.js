/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { testDataProcessor } from '../_utils/utils';

describe( 'GFMDataProcessor', () => {
	describe( 'paragraphs', () => {
		it( 'single line', () => {
			testDataProcessor(
				'single line paragraph',
				'<p>single line paragraph</p>',
				'single line paragraph\n'
			);
		} );

		it( 'multiline', () => {
			testDataProcessor(
				'first\n' +
				'second\n' +
				'third',

				'<p>first second third</p>',

				'first second third\n'
			);
		} );

		it( 'with header after #1', () => {
			testDataProcessor(
				'single line\n' +
				'# header',

				'<p>single line</p>' +
				'<h1>header</h1>',

				'single line\n' +
				'\n' +
				'# header\n'
			);
		} );

		it( 'with blockquote after', () => {
			testDataProcessor(
				'single line' +
				'\n> quote',

				'<p>single line</p>' +
				'<blockquote><p>quote</p></blockquote>',

				'single line' +
				'\n' +
				'\n> quote\n'
			);
		} );

		it( 'with list after', () => {
			testDataProcessor(
				'single line\n' +
				'*   item',

				'<p>single line</p>' +
				'<ul><li>item</li></ul>',

				'single line\n' +
				'\n' +
				'*   item\n'
			);
		} );
	} );
} );
