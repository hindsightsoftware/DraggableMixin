# React.js draggable mixin (major WIP)
---
In Behave Pro we have a feature for mapping custom statuses to system defaults, we've recently moved alot of our stuff to React. So heres my attempt of re-creating the jQuery UI sortable plugin in React.js.

Based on this [stackoverflow thread](http://stackoverflow.com/questions/20926551/recommended-way-of-making-react-component-div-draggable)

Here is a [JSFiddle demo](http://jsfiddle.net/charliedowler/kAX8V/11/).

##Installation
```shell
$ bower install --save DraggableMixin
```

Here is a rough example of using this mixin. 

Example usage:
```js
/**
 * to override these methods 
 * callback(e) {
 *  //your code
 *  return true || false
 * }
 */
React.renderComponent(<Draggable onDrop={function(event) {
  // Here is a good place to show a loader
  $('.spinner').show();
}} onDrag={function(event) { 
  console.log('I AM BEING DRAGGED');
}} onGrab={function(event) {
  console.log('I AM BEING GRABBED');
}} onSave={function(data) {
  var req = new XMLHttpRequest();
  req.open('POST', 'http://awesomesauce.com/datastore', false);
  res.onload = function() {
    if (this.status < 400) {
        $('.spinner').hide();
        $('.spinner success').show();        
    }
    else {
        $('.spinner').hide();
        $('.spinner error').show();
    }
  };
  res.send(data);      
}} columns={[
  {
    className: 'list',
    content: 'I am a column',
    items: [
      {
        className: 'listItem',
        content: 'I am a list item'
      }
    ]
  }
]} />, document.getElementById('targetElement'));
```

##Contribute?

Want to contribute towards this project?

```shell
$ git clone git@github.com:hindsightsoftware/DraggableMixin.git
$ cd DraggableMixin
$ npm start
$ grunt dev
```

Open up examples/index.html to experiment.