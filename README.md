# React.js draggable mixin (major WIP)
---
In Behave Pro we have a feature for mapping custom statuses to system defaults, we've recently moved alot of our stuff to React. So heres my attempt of re-creating the jQuery UI sortable plugin in React.js.

Here is a [JSFiddle demo](http://google.com).

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