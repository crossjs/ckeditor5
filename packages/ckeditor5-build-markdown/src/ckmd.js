/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Code from '@ckeditor/ckeditor5-basic-styles/src/code';
import CodeBlock from '@ckeditor/ckeditor5-code-block/src/codeblock';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import HeadingButtonsUI from '@ckeditor/ckeditor5-heading/src/headingbuttonsui';
import HorizontalLine from '@ckeditor/ckeditor5-horizontal-line/src/horizontalline';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Link from '@ckeditor/ckeditor5-link/src/link';
import LinkImage from '@ckeditor/ckeditor5-link/src/linkimage';
import List from '@ckeditor/ckeditor5-list/src/list';
import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import ParagraphButtonUI from '@ckeditor/ckeditor5-paragraph/src/paragraphbuttonui';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation';
import TodoList from '@ckeditor/ckeditor5-list/src/todolist';

import html2markdown from '@ckeditor/ckeditor5-markdown-gfm/src/html2markdown';
import markdown2html from '@ckeditor/ckeditor5-markdown-gfm/src/markdown2html';

/**
 * extra plugins
 */
import DisallowNestingTables from './extraPlugins/disallownestingtables';

export default class CKMD extends ClassicEditorBase {}

// Plugins to include in the build.
CKMD.builtinPlugins = [
	Autoformat,
	BlockQuote,
	Bold,
	Code,
	CodeBlock,
	Essentials,
	Heading,
	HeadingButtonsUI,
	HorizontalLine,
	Image,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Italic,
	Link,
	LinkImage,
	List,
	Markdown,
	MediaEmbed,
	Paragraph,
	ParagraphButtonUI,
	PasteFromOffice,
	RemoveFormat,
	SourceEditing,
	Strikethrough,
	Table,
	TableToolbar,
	TextTransformation,
	TodoList,

	/**
	 * extra plugins
	 */
	DisallowNestingTables
];

// Editor configuration.
CKMD.defaultConfig = {
	toolbar: {
		items: [
			'undo',
			'redo',
			'|',
			'removeFormat',
			'|',
			'paragraph',
			'heading2',
			'heading3',
			'heading4',
			'|',
			'bold',
			'italic',
			'strikethrough',
			'|',
			'horizontalLine',
			'blockQuote',
			'|',
			'bulletedList',
			'numberedList',
			'todoList',
			'indent',
			'outdent',
			'|',
			'insertTable',
			'uploadImage',
			'mediaEmbed',
			'link',
			'|',
			'code',
			'codeBlock',
			'|',
			'sourceEditing'
		]
	},
	codeBlock: {
		languages: [
			{ language: 'c', label: 'C' },
			{ language: 'cpp', label: 'C++' },
			{ language: 'java', label: 'Java' },
			{ language: 'js', label: 'JavaScript' },
			{ language: 'json', label: 'JSON' }
		]
	},
	heading: {
		options: [
			// https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#heading-levels
			{ model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
			{ model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
			{ model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
			{ model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' }
		]
	},
	image: {
		toolbar: [
			'imageStyle:block',
			'imageStyle:inline',
			'|',
			'imageTextAlternative',
			'|',
			'linkImage'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};

CKMD.html2markdown = html2markdown;
CKMD.markdown2html = markdown2html;
