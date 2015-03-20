# node-klass v0.1.3
[![Build Status](https://travis-ci.org/ayecue/node-klass.png?branch=master)](https://travis-ci.org/ayecue/node-klass)

> Pseudo ExtJS-like-Class library


## Getting Started
Install this plugin with this command:

```shell
npm install node-klass
```


## Description

This is a pseudo klass library. It's kinda like the ExtJS pseudo klass system. It loads automaticly required classes.


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
Arguments: `String`, `Object`, `String`
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
Arguments: `String`, `Mixed`, `Object`, `String`
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

#### Klass.override

Override certain class. Just as you would define a new class but overriding an already existing class.

Example usage: 
```
Klass.override('w.smaller',{
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


#### Klass.set

Set certain namespace in $scope object of Klass.

Example usage: 
```
Klass.set('what.mo.lo','test');

Klass.$scope.what.mo.lo; //returns 'test'
```


#### Klass.get

Get certain namespace in $scope object of Klass.

Example usage: 
```
Klass.$scope.what.mo.lo = 'test';

Klass.get('what.mo.lo'); //returns 'test'
```


#### Klass.define

This method is there to create your classes. It's the basic klass constructor.

Following properties are there to conifgurate your klass:

* extends - Library you want to extend
* mixins - Mixins you want to use in your class
* statics - Static properties which you want to extend to your base

Following defauts statics are extended to your klass:

* singleton - Define if your class is a singleton
* debug - Define if the class is in debug mode
* autoSetterGetter - Define if automaticly setter/getter get created
* getClass() - Get base class/Get constructor
* getMixins() - Get mixins of this class
* getCalledMethod() - Get current called method (just working inside class functions)
* getCalledMethodBase() - Get current called method class (just working inside class functions)
* getCalledMethodName() - Get current called method name (just working inside class functions)
* getCalledMethodFunction() - Get current called method function (just working inside class functions)
* getParent() - Get extending parent
* callParent(arguments) - Call parent method if there's one (just working inside class functions)
* isDebug() - Getter for debug property
* getName() - Get name of class
* logMessage(arguments,isError) - Print message in console in context of class (just working properly inside class functions)
* applyTo(class) - Extend this class to another class

Following defauts statics are extended to your klass:

* isPrototypeObject - Define if this object is an prototype object
* getDefaultValues() - Get default values which should be extended on every new created instance
* getClass() - Get base/constructor of instance
* getCalledMethod() - Get current called method (just working inside class functions)
* getCalledMethodBase() - Get current called method class (just working inside class functions)
* getCalledMethodName() - Get current called method name (just working inside class functions)
* getCalledMethodFunction() - Get current called method function (just working inside class functions)
* callParent(arguments) - Call parent method if there's one (just working inside class functions)
* getParent() - Get extending parent
* getName() - Get name of class
* extend(object1,object2,object3) - Extend properties to current instance
* logMessage(arguments,isError) - Print message in console in context of class (just working properly inside class functions)
* isDebug() - Getter for debug property
* callMixin(MixinName,MixinProperty,arguments) - Call a mixin in context of this class 

Example usage: 
```
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
		something : {
			test : function(){
				console.log(this);
			},
			s : {
				w : function(){
					this.logMessage('run');
				}
			}
		}
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