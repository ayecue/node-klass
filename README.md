# node-klass v1.0.2
[![Build Status](https://travis-ci.org/ayecue/node-klass.png?branch=master)](https://travis-ci.org/ayecue/node-klass)

> Javascript class library to increase speed of development process.


## Getting Started
Install this plugin with this command:

```shell
npm install node-klass
```


## Description

This a class library for Javascript. You could compare this system with the class library of ExtJS. This library is right now optimized for CommonJS. 
It got some nice features like:

* Autoloading required klasses from filesystem by a certain finding pattern
* Automaticly registering klasses to GLOBAL with correct namespaces so you can use them anywhere
* Allows to extend klasses
* Allows to add mixins to your klass
* Allows singletons
* Allows inheritance of statics
* Automaticly adds setter/getter to your klass
* Possibility to call certain context methods in klasses like: callParent, callSuper, getCalled [...]
* Secure against klass namespace rewriting
* Also adding some Utility functionality
* More to come...

So if you are interested check it out. There's more stuff to come like aliases, configs etc.

![Console](https://raw.githubusercontent.com/ayecue/img/master/node-klass/demo.gif)


#### Klass.define

This method is there to create your klasses. It's the basic klass constructor.

Following properties are there to conifgurate your klass:

* extends - Library you want to extend
* mixins - Mixins you want to use in your klass
* statics - Static properties which you want to extend to your base

Following defaut statics are extended to your klass:

* singleton - Define if your klass is a singleton
* debug - Define if the klass is in debug mode
* autoSetterGetter - Define if automaticly setter/getter get created
* getKlass() - Get base klass/Get constructor
* getCalled() - Get current called method (just working inside klass functions)
* getCalledKlass() - Get current called method klass (just working inside klass functions)
* getCalledName() - Get current called method name (just working inside klass functions)
* getCalledFunction() - Get current called method function (just working inside klass functions)
* getCalledBefore() - Get before called method function (just working inside klass functions)
* callParent(arguments) - Call either previous method or parent method if there's one (just working inside klass functions)
* callSuper(arguments) - Call parent method if there's one (just working inside klass functions)
* getName() - Get name of klass
* logMessage(arguments,isError) - Print message in console in context of klass (just working properly inside klass functions)

Following defaut prototypes are extended to your klass:

* getDefaultValues() - Get default values which should be extended on every new created instance
* getklass() - Get base/constructor of instance
* getCalled() - Get current called method (just working inside klass functions)
* getCalledKlass() - Get current called method klass (just working inside klass functions)
* getCalledName() - Get current called method name (just working inside klass functions)
* getCalledFunction() - Get current called method function (just working inside klass functions)
* getCalledBefore() - Get before called method function (just working inside klass functions)
* callParent(arguments) - Call either previous method or parent method if there's one (just working inside klass functions)
* callSuper(arguments) - Call parent method if there's one (just working inside klass functions)
* getName() - Get name of klass
* extend(object1,object2,object3) - Extend properties to current instance
* logMessage(arguments,isError) - Print message in console in context of klass (just working properly inside klass functions)

Example usage: 
```
Klass.setSource(__filename).setScope(GLOBAL);

var smaller = klass.define('w.smaller',{
	extends : 'w.test',
	test : 'woot',
	lulu : {
		1 : 2
	},
	requires: [
		'w.foo'
	],
	mkmk : [5,9,8],
	mixins : {
		something : 'w.other'
	},
	statics : {
		testing : function(){
			console.log('wad');
			this.callParent();
		}
	},
	foo : function(){
		this.callParent(['wat']);
		this.logMessage('test',true);
	}
});
```


## Functions

#### Klass.forEach
Arguments: `Object`, `Function`, `Mixed`
Return: `Mixed`

Basicly this a method to loop through objects. But it got one nice feature. You can use a context object which got two properties 'result' and 'skip'.

Example usage: 
```
var removedUnderscoreArray = forEach(['_w','_t','_m'],function(index,value){
	this.result.push(value.replace('_',''));
},[]);

console.log(removedUnderscoreArray.join(','));
```


#### Klass.bind
Arguments: `Function`, `Object`, `Array`, `Boolean`
Return: `Function`

Bind scope and args to function.

Example usage: 
```
var fn = bind(function(){
	console.log(arguments);
	return this;
},window,['test','foo'],true);

fn('bar'); //log message: ['test','foo','bar']
```


#### Klass.typeOf
Arguments: `Object`
Return: `String`

Get type of object.

Example usage: 
```
typeOf(0); //number
typeOf([]); //array
typeOf({}); //object
```


#### Klass.toArray
Arguments: `Object`
Return: `Array`

Simple method to convert 'array-like-objects' to arrays.

Example usage: 
```
function getFirstArg(){
	var args = toArray(arguments);

	return args.shift();	
};
```


#### Klass.from
Arguments: `Object`
Return: `Array`

Always returns an Array.

Example usage: 
```
from('test'); //returns ['test']
```


#### Klass.getNamespace
Arguments: `String`, `Object`
Return: `Mixed`

Get value for certain namespace in object.

Example usage: 
```
var myScope = {
	what {
		mo : {
			lo : 'test'
		}
	}
};

getNamespace('what.mo.lo',myScope); //returns 'test'
```


#### Klass.setNamespace
Arguments: `String`, `Mixed`, `Object`
Return: `Mixed`

Set value for certain namespace in object.

Example usage: 
```
var myScope = {};

setNamespace('what.mo.lo','test',myScope);

myScope.what.mo.lo; //returns 'test'
```


#### Klass.indexOf
Arguments: `Array`, `Function`
Return: `Integer`

Get index of value in object.

Example usage: 
```
var index = indexOf([1,2,3,4],function(id){
	return id === 4;
}); //returns 3
```


#### Klass.capitalize
Arguments: `String`
Return: `String`

Capitalize string.

Example usage: 
```
var str = Klass.capitalize('test'); //returns 'Test'
```


#### Klass.decapitalize
Arguments: `String`
Return: `String`

Decapitalize string.

Example usage: 
```
var str = Klass.decapitalize('Test'); //returns 'test'
```


#### Klass.emptyFn
Return: `Function`

Empty function.

Example usage: 
```
var fn = Klass.emptyFn; //returns a function
```


#### Klass.extend
Arguments: `Object`, `Object` [...]
Return: `Object`

Simple extend method to merge multiple objects together.

Example usage: 
```
var objectFusion = extend({
	foo : 0x01
},{
	bar : 0x02
});

objectFusion.foo;
objectFusion.bar;
```


#### Klass.applyIf
Arguments: `Object`, `Object` [...]
Return: `Object`

Simple extend method to merge multiple objects together if those are not null.

Example usage: 
```
var objectFusion = applyIf({
	foo : 0x01
},{
	bar : 0x02
});

objectFusion.foo;
objectFusion.bar;
```


#### Klass.printf
Arguments: `String`, `Object`
Return: `String`

Could be compared to the php function printf. Fill string templates with values. Also this method got some nice formating functions.

Following formating codes are possible:

* camelcase - Upper first letter
* capitalise - Upper first letter, lower all other letters
* upper - Upper all
* lower - Lower all
* ouletters - Remove everything except upper letters
* olletters - Remove everything except lower letters
* onumber - Remove everything except numbers
* olettersnumber - Remove everything except letters and numbers
* oword - Just allow normal chars
* ruletters - Remove all upper letters
* rlletters - Remove all lower letters
* rnumber - Remove all numbers
* rword - Remove all word chars
* rdot - Remove all dots
* trim - Remove whitespaces left/right
* triml - Remove whitespaces left
* trimr - Remove whitespaces right

Example usage: 
```
//simple single
printf('<%=name%> has a problem with WAYNE','name','Joe');

//simple multiple
printf('<%=name%> has a problem with <%=troublemaker%>',{
	name : 'Joe',
	troublemaker : 'WAYNE'
});

//advanced multiple
printf('<%=:capitalise,trim:name%> has a problem with <%=:upper:troublemaker%>',{
	name : 'joe',
	troublemaker : 'wayne'
});
```

#### Klass.createOverride
Arguments: `String`, `Object`, `Function`
Return: `Mixed`

Override certain klass. Just as you would define a new klass but overriding an already existing klass.

Example usage: 
```
Klass.createOverride('w.smaller',{
	statics : {
		myFunc : function(){
			return 2;
		}
	},
	lulu : {
		5 : 6
	},
	foo : function(){
		this.callParent(['foo']);
		this.logMessage('wassup',true);
	}
});
```


#### Klass.get
Arguments: `String`
Return: `Mixed`

Get certain namespace in global scope object of Klass.

Example usage: 
```
GLOBAL.what.mo.lo = 'test';

Klass.get('what.mo.lo'); //returns 'test'
```


#### Klass.getKlass
Arguments: `String`
Return: `Mixed`

Get certain Klass by klassName.

Example usage: 
```
GLOBAL.what.mo.lo = 'test';

Klass.getKlass('what.mo.lo'); //returns 'test'
```


#### Klass.require
Arguments: `Array`, `Function`

Load certain klasses from filesystem.

Example usage: 
```
Klass.require([
	'w.smaller',
	'w.foo'
],function(Smaller,Foo){
	new Smaller();
	new Foo();
});
```


#### Klass.setSource
Arguments: `String`

Set source filepath.

Example usage: 
```
Klass.setSource(__filename);
```


#### Klass.setScope
Arguments: `Object`

Set scope for klass manager.

Example usage: 
```
Klass.setScope(GLOBAL);
```


#### Klass.Argmap

Used to easily manage a map of arguments.

* setIncludeArgs - Set fixed include args
* set - Set certain map value
* get - Get certain map value
* remove - Remove value from map
* collect - Collect all args of the map which should be exposed
* inject - Inject certain values and collect all args of the map which should be exposed


#### Klass.Assert

Used to easily check if certain conditions are correct.

* doThrow - Allow assert to throw erros
* notThrow - Disallow assert to throw errors
* isError - Is allowed to throw error
* isLog - Is allowed to output console message
* isNull - Check if value is undefined
* notNull - Check if value is not undefined
* unequal - Check if value is not equal to other value
* equal - Check if value is equal to other value
* notType - Check if value is not a certain type
* isType - Check if value is a certain type
* expection - Throw exception
* log - Print console log message


#### Klass.Listener

Collection of events with callbacks.

* get - Get event
* on - Register event
* off - Unregister event
* fire - Fire event
* remove - Remove event


#### Klass.Event

Collection of callbacks.

* push - Add callback
* remove - Remove callback
* get - Get callback
* executeAll - Execute all callbacks
* clone - Clone event


#### Klass.Map

Used to manage namespaces in the global scope for example.

* parse - Parse id string
* set - Set certain namespace with value
* create - Create certain namespace
* get - Get certain namespace


#### Klass.Callback

Used to have an easy way to create callbacks with all kind of options.

* execute - Execute registered callback


#### Klass.Collection

Used to manage collection of klasses/objects.

* range - Get range of records in collection
* isEmpty - Check if collection is empty
* each - Iterate through collection
* sort - Sort collection either 'ASC' or 'DESC'
* indexOf - Get index of item in collection
* get - Get item in collection
* getAll - Get all items of collection in an array
* getById - Get certain item in collection by position
* push - Add an item to collection
* remove - Remove item from collection
* clone - Clone collection