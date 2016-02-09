module.exports = {
  foo: function (data) {
    console.log(data);
  },
  difference: function (data) {

  },
  test: function (docs) {
    var arr = [];
    docs.forEach(function (doc, i) {
      var data = JSON.parse(doc['raw'])['retVal'];
      for (var k in data) {
        for (var p in data[k]) {
          if ((p == 'lat') || (p == 'lng') || (p == 'tot') || (p == 'sbi')) {
            data[k][p] = parseFloat(data[k][p]);
          } else {
            delete data[k][p];
          }
        }
        // compute.foo(data[k]);
        // console.log(i + ',' + k);
        if (i == (docs.length-1)) {
        	arr.push({lat: data[k]['lat'], lng: data[k]['lng']})
        }
      }
    })
    console.log('emit')
    io.emit('update data', arr);
  },
  bar: 'test'
};
