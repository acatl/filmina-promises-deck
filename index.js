'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const _ = require('lodash');
const yaml = require('yamljs');
const marked = require('marked');
const mustache = require('mustache');

/**
 * get part form text
 * @param  {string} content
 * @param  {RegEx} regex
 * @return {Object}
 */
function getPart(content, regex) {
	const result = regex.exec(content);
	return {
		result: result[1],
		length: result[0].length
	};
}

/**
 * get slide's meta info
 * @param  {string} source
 * @return {string}
 */
function getMeta(source) {
	const meta = getPart(source, /<!-- meta([\s\S]*?)-->/g);
	return meta;
}

/**
 * break slides appart
 * @param  {string} source
 * @return {Array<string>}
 */
function breakSlides(source) {
	return source.split('---\n');
}

/**
 * create Slide Object from raw string
 * @param  {string} source
 * @return {Slide}
 */
function parseSlide(source) {
	const meta = getMeta(source);
	const content = source.slice(meta.length);
	return {
		meta,
		content
	};
}

/**
 * transfrom from SlideSpec to Slide Object
 * @param  {SlideSpec} slideSpec
 * @return {Slide}
 */
function transformSlide(spec) {
	return {
		meta: yaml.parse(spec.meta.result),
		content: marked(spec.content)
	}
}

/**
 * process from raw source string to slide collection
 * @param  {string} source
 * @return {Array<Slide>}
 */
function processSlides(source) {
	const processSlide = _.flow([parseSlide, transformSlide]);

	return breakSlides(source).map(processSlide);
}

/**
 * normalize slide's meta object
 * @param  {Array<Slide>} slides
 * @return {Array<Slide>}
 */
function normalizeSlides(slides) {
	var size = slides.length;
	return slides.map((val, index, set) => {
		const slide = _.assign({}, val, {
			navigation: {
				prev: null,
				next: null
			}
		});

		const isFirst = index === 0;
		const isLast = index === size - 1;

		const prevSlide = set[index - 1] || {};
		const nextSlide = set[index + 1] || {};

		slide.navigation.prev = _.get(prevSlide, 'meta.url');
		slide.navigation.next = _.get(nextSlide, 'meta.url');

		return slide;
	});
}

/**
 * render slide's html
 * @param  {Presentation} presentation
 * @param  {Slide} slide
 * @return {string} html output
 */
function renderSlide(presentation, slide) {
	return mustache.render(presentation.templates.page, {
		slide: slide,
		presentation: presentation
	});
}

/**
 * build presentation from slide specs
 * @param  {Presentation} presentation
 * @return {Promise<Presentation>}
 */
function buildSlides(presentation) {
	return Promise.each(presentation.slides, slide => {
			const html = renderSlide(presentation, slide)
			return fs.writeFileAsync('build/' + slide.meta.url, html);
		})
		.return(presentation);
}

/**
 * process raw presentation spec into parsed and transfromed Presentation
 * @param  {PresentationSpec} presentation
 * @return {Promise<Presentation>}
 */
function processPresentation(presentation) {
	return Promise.resolve(presentation.source)
		.then(processSlides)
		.then(normalizeSlides)
		.then(slides => {
			return _.assign({}, presentation, {
				slides
			});
		});
}

/**
 * create build/ folder and move local and vendor resources
 * @return {Promise}
 */
function initBuild() {
	return fs.ensureDirAsync('./build')
		.then(() => fs.emptyDirAsync('./build'))
		.then(() => fs.copyAsync('./resources', './build'))
		.then(() => fs.copyAsync('./node_modules/barba.js/dist', './build'))
}

/**
 * build presentation deck
 * @param  {Presentation} presentation
 * @return {Promise<Presentation>}
 */
function build(presentation) {
	return initBuild()
		.then(() => buildSlides(presentation));
}

/**
 * load and create PresentationSpec from raw files
 * @return {Promise<PresentationSpec}
 */
function loadPresentation() {
	return Promise.all([
			fs.readFileAsync('./presentation.md', 'utf8'),
			fs.readFileAsync('./templates/page.mustache', 'utf8')
		])
		.then(sources => {
			return {
				source: sources[0],
				templates: {
					page: sources[1],
				}
			};
		});
}

/**
 * create presentation
 * @return {Promise}
 */
function createPresentation() {
	return loadPresentation()
		.then(processPresentation)
		.then(build)
		.then(presentation => {
			presentation.slides.forEach((slide, index) => {
				console.log('slide: %s', index);
				console.log('  url: %s', slide.meta.url);
				console.log('   prev: %s', slide.navigation.prev);
				console.log('   next: %s', slide.navigation.next);
			})
		})
		.catch( err => console.log(err, err.stack));
}


createPresentation();
