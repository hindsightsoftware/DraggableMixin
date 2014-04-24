/** @jsx React.DOM */
var DraggableMixin = function (React) {
  'use strict';
  React = (typeof React == 'undefined') ? window.React : React;

  var Dropped = new CustomEvent('dropped', {
    'detail': {
      'dropped': true
    }
  });

  var Draggable = React.createClass({
    getDefaultProps: function () {
      return {
        initialPos: {x: 0, y: 0}
      }
    },
    getInitialState: function () {
      return {
        pos: this.props.initialPos,
        dragging: false,
        rel: null // position relative to the cursor
      }
    },
    // we could get away with not having this (and just having the listeners on
    // our div), but then the experience would be possibly be janky. If there's
    // anything w/ a higher z-index that gets in the way, then you're toast,
    // etc.
    componentDidUpdate: function (props, state) {
      if (this.state.dragging && !state.dragging) {
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
      } else if (!this.state.dragging && state.dragging) {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
      }
    },

    onMouseDown: function (e) {
      if (e.button !== 0) return; // Only left mouse button
      var predicate = (this.props.hasOwnProperty('onGrab')) ? this.props.onGrab(e) : null;
      if (predicate) return predicate;

      var rect = e.currentTarget.getBoundingClientRect();

      var pos = {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
      var rel = {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top
      };

      this.setState({
        currentItem: this.getDOMNode().children[0].innerHTML,
        dragging: true,
        rel: rel,
        pos: {
          x: e.pageX - rel.x,
          y: e.pageY - rel.y
        }
      });
      e.stopPropagation();
      e.preventDefault();
    },
    onMouseUp: function (event) {
      var mouse = {
        x: event.pageX - this.state.rel.x,
        y: event.pageY - this.state.rel.y
      };
      var _catch = document.elementFromPoint(mouse.x, mouse.y);
      var _drop = this.state.currentItem;
      Dropped.detail.target = _catch;
      Dropped.detail.item = _drop;
      this.setState({dragging: false});
      document.dispatchEvent(Dropped);
      event.stopPropagation();
      event.preventDefault();
    },
    onMouseMove: function (e) {
      if (!this.state.dragging) return;
      var predicate = (this.props.hasOwnProperty('onDrag')) ? this.props.onDrag(e) : null;
      if (predicate) return predicate;
      this.setState({
        pos: {
          x: e.pageX - this.state.rel.x,
          y: e.pageY - this.state.rel.y
        }
      });
      e.stopPropagation();
      e.preventDefault();
    },
    render: function () {
      var style = {
        position: (this.state.dragging) ? 'absolute' : 'inherit',
        left: this.state.pos.x,
        top: this.state.pos.y
      };
      return this.transferPropsTo(React.DOM.li({
        onMouseDown: this.onMouseDown,
        style: style
      }, this.props.children, React.DOM.span(null, this.props.content)));
    }
  });

  var DraggableList = React.createClass({
    getData: function () {
      return this.state.columns;
    },
    /**
     * Used props from parent for callback, if you want to override this method pass in an onDrop {Function} that returns a bool.
     * this.props.onSave {Function} allows you to parse and store the data from the table.
     * @param event
     * @returns {*}
     */
    handleDrop: function (event) {
      var predicate = (this.props.hasOwnProperty('onDrop')) ? this.props.onDrop(event) : null;
      if (predicate) return predicate;

      if (event.detail.target.toString() != '[object HTMLUListElement]') return;

      var done = false;
      for (var i in this.state.columns) {
        var column = this.state.columns[i];
        for (var itemIndex in column.items) {
          var item = column.items[itemIndex];
          if (item.content == event.detail.item) {
            column.items.splice(itemIndex, 1);
          }
        }
      }
      for (var i in this.state.columns) {
        if (this.state.columns[i].content == event.detail.target.getAttribute("data-id") && !done) {
          done = true;
          var columns = this.state.columns;
          columns[i].items.push({className: 'status', content: event.detail.item});
          this.setState({columns: columns});
        }
      }

      predicate = (this.props.hasOwnProperty('onSave')) ? this.props.onSave(this.getData()) : null;
      if (predicate) return predicate;
    },
    componentWillUnmount: function () {
      document.removeEventListener('dropped', this.handleDrop, true);
    },
    componentWillMount: function () {
      this.setState({columns: this.props.columns});
    },
    componentDidMount: function () {
      document.addEventListener('dropped', this.handleDrop, true);
    },
    render: function () {
      var column = this.state.columns;
      var onDrag = this.props.onDrag;
      var onGrab = this.props.onGrab;
      return (<ul id="map-container">{column.map(function (item) {
        return (<li className={item.className}>{item.content}
          <ul data-id={item.content} style={{display: "block"}}>{item.items.map(function (listItem) {
            return (<Draggable className={listItem.className} content={listItem.content} onDrag={onDrag} onGrab={onGrab}/>);
          })}</ul>
        </li>);
      })}</ul>);
    }
  });

  return DraggableList;
};

if (typeof module !== 'undefined' && 'exports' in module) {
  var React = require('react');
  module.exports = DraggableMixin(React);
}
else if (typeof define !== 'undefined') {
  define(function (require, exports, module) {
    var React = require('react');
    module.exports = DraggableMixin(React);
  }, []);
}
else if (typeof window !== 'undefined') {
  window.Draggable = DraggableMixin();
}
