<!-- meta
url: index.html
-->

## Acatl Pacheco

### Software Architect

<img style="margin-top:30px;" src="https://upload.wikimedia.org/wikipedia/commons/3/37/Viacom_logo.svg" alt="Viacom Inc." height="30">

---
<!-- meta
url: promises.html

-->

# Promises
## Promises
### Promises
#### Promises


---
<!-- meta
url: definition.html
-->

## Promise definition:

> A Promise is an object that is used as a placeholder for the eventual results of a deferred (and possibly asynchronous) computation.

- https://tc39.github.io/ecma262/#sec-promise-objects

---
<!-- meta
url: callbacks.html
-->

### good old callbacks

```js
readFile(filePath, function(err, contents){
  if(err) {
    console.log('failed to read file', err);
    return;
  }

  console.log('File Contents: \n%s', contents);
});
```

---
<!-- meta
url: its-complicated.html
-->

### Lets complicate things:

```
readFile
	parseSlides
		transformSlides
			buildDeck
```

<img class="meme" src="http://www.pngall.com/wp-content/uploads/2016/03/Challenge-Accepted-Meme-PNG.png" alt="meme">


---
<!-- meta
url: callback-hell.html
-->

```js
readFile('paresentation.md', function(err, raw){
	if(err) {
		return err;
	}
	return parseSlides(raw, function(err, slides){
		if(err) {
			return err;
		}
		return transformSlides(slides,function(err, slides){
			if(err) {
				return err;
			}
			return buildDeck(slides,function(err, output){
				if(err) {
					return err;
				}
			});
		});
	});
});
```

**callback heeeeellll!!!!!**

<img class="meme" src="http://i.imgur.com/1GJ6O.png" alt="angry">

---
<!-- meta
url: whats-wrong-with-callbacks.html
-->

## Whats wrong with that code?

- error handling
- callback nesting...
- scoping
- hard to debug
- its just plain ... ugly

---
<!-- meta
url: promises-what-are-they.html
-->

## Promises to the rescue!

### What are they?

```js
PromiseObject
  .then( ƒ(value), [ ƒ(error) ] )
  .catch( ƒ(error) );
```

### A promise can be:

- **fulfilled** - The action relating to the promise succeeded
- **rejected** - The action relating to the promise failed
- **pending** - Hasn't fulfilled or rejected yet
- **settled** - Has fulfilled or rejected

---
<!-- meta
url: bettter-with-promises.html
-->

### With Promises:

```js
readFile('paresentation.md')
	.then(parseSlides)
	.then(transformSlides)
	.then(buildDeck)
	.catch( err => {
		console.error(err);
	});
});
```

<img class="meme" src="http://www.pngall.com/wp-content/uploads/2016/03/Mother-Of-God-Meme-PNG.png" alt="meme">


---
<!-- meta
url: what-do-they-solve.html
-->


## And what does that solve?

1. Easier to read
2. Easier to debug
3. More Scalable
4. Better Code
5. **Happier Developer**
6. Better Application
7. **Happier User**

---
<!-- meta
url: promises-in-the-wild.html
-->


### Promises in the wild

**jQuery.ajax**

```js
var jqxhr = $.ajax('http://some.site.com/service')
	.done(function(result) {
		console.log('success', result);
  });
```

- **jQuery**
- **AngularJs**
- **SailsJs**
- **KrakenJs**

---
<!-- meta
url: can-i-use-them-today.html
-->


## Can I use them today

**Yes, you can***

http://caniuse.com/#search=promise

**Browsers:**
Firefox, Chrome, Edge, Safari, Opera, Android Browser

**Node:**
v4.3.2+

<br>

### Humm then should I? Yes!!

- Bluebird - http://bluebirdjs.com
- Q - https://github.com/kriskowal/q
- RSVP.js - https://github.com/tildeio/rsvp.js

---
<!-- meta
url: resources.html
-->

## Thanks!

### Resources

- https://tc39.github.io/ecma262/#sec-promise-objects
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
- https://developers.google.com/web/fundamentals/getting-started/primers/promises
- https://github.com/domenic/promises-unwrapping
- https://www.promisejs.org
- http://andyshora.com/promises-angularjs-explained-as-cartoon.html
