/* global gifs*/
!function () {
  var Event = {
    _events: {},

    fire: function (name) {
      if (name in this._events) {
        var args = Array.prototype.slice.call(arguments, 1);
        this._events[name].forEach(function (cb) {
          cb.apply(null, args);
        });
      }
    },

    on: function (name, cb) {
      if (!(name in this._events)) {
        this._events[name] = [];
      }

      this._events[name].push(cb);
    }
  };

  function Randomizer () {
    this.loading = false;
    this.el = document.getElementById('random');

    this.el.querySelector('img').onload = this.onLoad.bind(this);
    this.el.querySelector('#again').addEventListener('click', this.onClick.bind(this));
  }
  Randomizer.prototype.hide = function () {
    this.el.classList.add('hide');
  };
  Randomizer.prototype.show = function () {
    this.el.classList.remove('hide');
  };
  Randomizer.prototype.onClick = function (e) {
    e.preventDefault();
    this.loadRandom();
  };
  Randomizer.prototype.onLoad = function () {
    this.el.querySelector('i').classList.remove('spin');
    this.loading = false;
  };
  Randomizer.prototype.loadRandom = function () {
    if (this.loading) return;

    this.loading = true;

    this.el.querySelector('i').classList.add('spin');
    var random = this.getRandom();
    this.el.querySelector('img').src = random;
    this.el.querySelector('a').href = random;
  };
  Randomizer.prototype.getRandom = function () {
    return gifs[Math.floor(Math.random() * gifs.length)];
  };

  function GifList () {
    this.el = document.getElementById('list');
  }
  GifList.getCategory = function (category) {
    var categoryList = [];

    gifs.forEach(function (path) {
      if (path.indexOf(category) == 0) {
        categoryList.push(path);
      }
    });

    return categoryList;
  };
  GifList.prototype.hide = function () {
    this.el.classList.add('hide');
  };
  GifList.prototype.show = function () {
    this.el.classList.remove('hide');
  };
  GifList.prototype.loadCategory = function (category) {
    var displayName = category.replace(/-/g, ' ').toUpperCase();
    this.el.innerHTML = '<h2>' + displayName + '</h2>';

    var categoryList = GifList.getCategory(category);
    this.el.innerHTML += categoryList.map(function (path) {
      return '<div><a href="' + path + '"><img src="' + path + '" alt=""/></a></div>';
    }).join('');

    window.scrollTo(0, 100);

    document.title = displayName;

    if (window.history.state != category) {
      window.history.pushState(category, category, '#' + category);
    }
  };

  function Links () {
    this.el = document.getElementById('links');
    this.populate(Links.getCategories());
    this.el.addEventListener('click', this.onClick.bind(this));
  }
  Links.getCategories = function () {
    var categories = [];

    gifs.forEach(function (path) {
      var category = path.split('/')[0];
      if (categories.indexOf(category) == -1) {
        categories.push(category);
      }
    });

    return categories;
  };
  Links.prototype.populate = function (categories) {
    this.el.innerHTML = categories.map(function (category) {
      return '<section><a href="/' + category + '">' + category + '</a></section>';
    }).join('');
  };
  Links.prototype.onClick = function (e) {
    if (e.target.tagName == 'A') {
      e.preventDefault();
      Event.fire('loadGifs', e.target.text);
    }
  };

  function App () {
    this.initialized = false;

    this.randomize = new Randomizer();
    this.list = new GifList();
    this.links = new Links();

    window.onpopstate = this.onpopstate.bind(this);
    Event.on('loadGifs', this.loadGifList.bind(this));

    if (!this.initialized) {
      this.randomize.loadRandom();
    }
  }
  App.prototype.loadGifList = function (category) {
    this.list.loadCategory(category);
    this.randomize.hide();
    this.list.show();
  };
  App.prototype.onpopstate = function (e) {
    if (!e.state && !window.location.hash) {
      this.randomize.show();
      this.list.hide();
    }
    else {
      this.loadGifList(e.state || window.location.hash.substr(1));
    }
    this.initialized = true;
  };

  new App();

}();
