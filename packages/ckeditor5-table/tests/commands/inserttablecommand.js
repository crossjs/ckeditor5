/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import ModelTestEditor from '@ckeditor/ckeditor5-core/tests/_utils/modeltesteditor';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import { getData, setData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import { assertEqualMarkup } from '@ckeditor/ckeditor5-utils/tests/_utils/utils';

import TableEditing from '../../src/tableediting';
import { modelTable } from '../_utils/utils';

import InsertTableCommand from '../../src/commands/inserttablecommand';

describe( 'InsertTableCommand', () => {
	let editor, model, command;

	beforeEach( () => {
		return ModelTestEditor
			.create( {
				plugins: [ Paragraph, TableEditing ]
			} )
			.then( newEditor => {
				editor = newEditor;
				model = editor.model;
				command = new InsertTableCommand( editor );
			} );
	} );

	afterEach( () => {
		return editor.destroy();
	} );

	describe( 'isEnabled', () => {
		describe( 'when selection is collapsed', () => {
			it( 'should be true if in a root', () => {
				setData( model, '[]' );
				expect( command.isEnabled ).to.be.true;
			} );

			it( 'should be true if in paragraph', () => {
				setData( model, '<paragraph>foo[]</paragraph>' );
				expect( command.isEnabled ).to.be.true;
			} );

			it( 'should be true if in table', () => {
				setData( model, '<table><tableRow><tableCell><paragraph>foo[]</paragraph></tableCell></tableRow></table>' );
				expect( command.isEnabled ).to.be.true;
			} );
		} );

		describe( 'when selection is not collapsed', () => {
			it( 'should be true if an object is selected', () => {
				model.schema.register( 'media', { isObject: true, isBlock: true, allowWhere: '$block' } );

				setData( model, '[<media url="http://ckeditor.com"></media>]' );
				expect( command.isEnabled ).to.be.true;
			} );

			it( 'should be true if in a paragraph', () => {
				setData( model, '<paragraph>[Foo]</paragraph>' );
				expect( command.isEnabled ).to.be.true;
			} );

			it( 'should be true if a non-object element is selected', () => {
				model.schema.register( 'element', { allowIn: '$root', isSelectable: true } );

				setData( model, '[<element></element>]' );
				expect( command.isEnabled ).to.be.true;
			} );
		} );
	} );

	describe( 'execute()', () => {
		it( 'should create a single batch', () => {
			setData( model, '<paragraph>foo[]</paragraph>' );

			const spy = sinon.spy();

			model.document.on( 'change', spy );

			command.execute( { rows: 3, columns: 4 } );

			sinon.assert.calledOnce( spy );
		} );

		describe( 'collapsed selection', () => {
			it( 'should insert table in empty root', () => {
				setData( model, '[]' );

				command.execute();

				assertEqualMarkup( getData( model ), modelTable( [
					[ '[]', '' ],
					[ '', '' ]
				] ) );
			} );

			it( 'should insert table with two rows and two columns after non-empty paragraph if selection is at the end', () => {
				setData( model, '<paragraph>foo[]</paragraph>' );

				command.execute();

				assertEqualMarkup( getData( model ),
					'<paragraph>foo</paragraph>' +
					modelTable( [
						[ '[]', '' ],
						[ '', '' ]
					] )
				);
			} );

			it( 'should insert table with given rows and columns after non-empty paragraph', () => {
				setData( model, '<paragraph>foo[]</paragraph>' );

				command.execute( { rows: 3, columns: 4 } );

				assertEqualMarkup( getData( model ),
					'<paragraph>foo</paragraph>' +
					modelTable( [
						[ '[]', '', '', '' ],
						[ '', '', '', '' ],
						[ '', '', '', '' ]
					] )
				);
			} );

			it( 'should insert table with given heading rows and heading columns after non-empty paragraph', () => {
				setData( model, '<paragraph>foo[]</paragraph>' );

				command.execute( { rows: 3, columns: 4, headingRows: 1, headingColumns: 2 } );

				assertEqualMarkup( getData( model ),
					'<paragraph>foo</paragraph>' +
					modelTable( [
						[ '[]', '', '', '' ],
						[ '', '', '', '' ],
						[ '', '', '', '' ]
					], { headingRows: 1, headingColumns: 2 } )
				);
			} );

			it( 'should insert table before after non-empty paragraph if selection is inside', () => {
				setData( model, '<paragraph>f[]oo</paragraph>' );

				command.execute();

				assertEqualMarkup( getData( model ),
					modelTable( [
						[ '[]', '' ],
						[ '', '' ]
					] ) +
					'<paragraph>foo</paragraph>'
				);
			} );

			it( 'should replace empty paragraph with table', () => {
				setData( model, '<paragraph>[]</paragraph>' );

				command.execute( { rows: 3, columns: 4 } );

				assertEqualMarkup( getData( model ),
					modelTable( [
						[ '[]', '', '', '' ],
						[ '', '', '', '' ],
						[ '', '', '', '' ]
					] )
				);
			} );
		} );

		describe( 'expanded selection', () => {
			it( 'should replace an existing selected object with a table', () => {
				model.schema.register( 'object', { isObject: true, allowIn: '$root' } );
				editor.conversion.for( 'downcast' ).elementToElement( { model: 'object', view: 'object' } );

				setData( model, '<paragraph>foo</paragraph>[<object></object>]<paragraph>bar</paragraph>' );

				command.execute( { rows: 1, columns: 2 } );

				expect( getData( model ) ).to.equal(
					'<paragraph>foo</paragraph>' + modelTable( [ [ '[]', '' ] ] ) + '<paragraph>bar</paragraph>'
				);
			} );

			it( 'should replace an existing table with another table', () => {
				setData( model, '<paragraph>foo</paragraph>[' + modelTable( [ [ '', '' ], [ '', '' ] ] ) + ']<paragraph>bar</paragraph>' );

				command.execute( { rows: 1, columns: 2 } );

				expect( getData( model ) ).to.equal(
					'<paragraph>foo</paragraph>' + modelTable( [ [ '[]', '' ] ] ) + '<paragraph>bar</paragraph>'
				);
			} );
		} );
	} );
} );
