function filter (func, arr) {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    if (func(arr[i])) {
      res.push(arr[i]);
    }
  }
  return res;
}


Array.prototype.contains = function (needle) {
  needle = needle.toString();
  for (var i in this) {
    if (this[i].toString() == needle) return true;
  }
  return false;
};


var Queue = (function () {
  function Queue () {
    this.elements = [];
  }
  
  Queue.prototype.empty = function () {
    return this.elements.length === 0;
  };
  
  Queue.prototype.put = function (x) {
    this.elements.push(x);
  };
  
  Queue.prototype.get = function () {
    return this.elements.shift();
  };
  
  return Queue;
})();


var SquareGrid = (function () {
  function SquareGrid (width, height) {
    this.width = width;
    this.height = height;
    this.walls = [];
  }
  
  SquareGrid.prototype.in_bounds = function (id) {
    var x = id[0];
    var y = id[1];
    return 0 <= x && x < this.width && 0 <= y && y < this.height;
  };
  
  SquareGrid.prototype.passable = function (id) {
    return !this.walls.contains(id);
  };
  
  SquareGrid.prototype.neighbors = function (id) {
    var x = id[0];
    var y = id[1];
    var results = [[x+1, y], [x, y-1], [x-1, y], [x, y+1]];
    if ((x + y) % 2 === 0) {
      results.reverse(); // aesthetics
    }
  
    results = filter((function (self) {
      return function (e) {
        return self.in_bounds(e);
      };
    })(this), results);
      
    results = filter((function (self) {
      return function (e) {
        return self.passable(e);
      };
    })(this), results);
    
    return results;
  };
  
  return SquareGrid;
})();


function breadth_first_search (graph, start) {
  var frontier = new Queue();
  frontier.put(start);
  var came_from = {};
  came_from[start] = undefined;
  
  while (!frontier.empty()) {
    var current = frontier.get();

    var neighbors = graph.neighbors(current);
    for (var i = 0; i < neighbors.length; i++) {
      var next = neighbors[i];
      if (came_from[next] === undefined) {
        frontier.put(next);
        came_from[next] = current;
      }
    }
  }
  
  return came_from;
}


function find_path (parents, start, goal) {
  var path = [];
  
  var next = parents[goal];
  while (next != start) {
    if (next === undefined) {
      return path;
    }
    path.push(next);
    next = parents[next];
  }
  
  path.push(start);
  path.push(goal);
  
  return path;
}


function draw_grid(grid, width, point_to, start, goal) {
  
  var dirs = {
    '-1': {
       '0': '<'
    },
    '1': {
       '0': '>'
    },
    '0': {
      '-1': '^',
       '1': 'v'
    }
  };
  
  var pad = function (s) { return s + Array(width-s.length).join(' '); };
  
  var out = '\n';
  for (var y = 0; y < grid.height; y++) {
    for (var x = 0; x < grid.width; x++) {
      
      var pt = point_to[[x, y]];
      
      if (grid.walls.contains([x, y])) {
        out += Array(width).join('#');
      } else if ([x, y] == start) {
        out += pad('S');
      } else if ([x, y] == goal) {
        out += pad('E');
      } else if (pt === undefined) {
        out += pad('.');
      } else {
        var px = pt[0];
        var py = pt[1];
        var char = dirs[px - x][py - y];
        if (char === undefined)
          char = '.';
        out += pad(char);
      }
    }
    out += '\n';
  }
  
  console.log(out);
}
