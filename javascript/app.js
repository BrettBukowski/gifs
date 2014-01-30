/* global gifs*/
!function () {

  function random () {
    var ran = gifs[Math.floor(Math.random() * gifs.length)];
    document.querySelector('#gifs img').src = ran;
    document.querySelector('#gifs a').href = ran;
  }

  random();

  document.getElementById('again').addEventListener('click', function (e) {
    e.preventDefault();
    random();
  });

  var all = [],
      categories = [];

  gifs.forEach(function (path) {
    all.push(path);
    var category = path.split('/')[0];
    if (categories.indexOf(category) == -1) {
      categories.push(category);
    }
  });

  var links = document.getElementById('links');
  links.innerHTML = categories.map(function (category) {
    return '<section><a href="/' + category + '">' + category + '</a></section>';
  }).join('');

}();
