module.exports = {
  foo: function (data) {
    console.log(data);
  },
  difference_btw_n_minutes: function (docs, n) {
    var arr = [];
    var current_index = docs.length - 1;
    var interval = n;
    var past_index = current_index - interval;
    filtered_docs = [docs[current_index], docs[past_index]];
    filtered_docs.forEach(function (doc, i) {
      console.log(i + ' ' + typeof(doc['timestamp']) + ' ' + doc['timestamp']) ;
      var current_doc = JSON.parse(doc['raw'])['retVal'];
      for (var k in current_doc) {
        for (var p in current_doc[k]) {
          if ((p == 'lat') || (p == 'lng') || (p == 'tot') || (p == 'sbi')) {
            current_doc[k][p] = parseFloat(current_doc[k][p]);
          } else {
            delete current_doc[k][p];
          }
        }
        // compute.foo(data[k]);
        // console.log(i + ',' + k);
        if (i == (filtered_docs.length-1)) {
          var past_doc = JSON.parse(filtered_docs[0]['raw'])['retVal'];
          var sbi_diff = current_doc[k]['sbi'] - past_doc[k]['sbi'];
          // console.log(filtered_docs.length);
        	arr.push({pos: {lat: current_doc[k]['lat'], lng: current_doc[k]['lng']}, 
                    diff: sbi_diff});
        }
      }
    })
    console.log('emit')
    io.emit('update data', arr);
  },
  bar: 'test'
};
