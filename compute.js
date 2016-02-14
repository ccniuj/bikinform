module.exports = {
  foo: function (data) {
    console.log(data);
  },
  difference_btw_n_minutes: function (docs, n) {
    if (docs.length > n) {
      var markers = [];
      var chart = {};
      var current_index = docs.length - 1;
      var interval = n;
      var past_index = current_index - interval;
      filtered_docs = [docs[current_index], docs[past_index]];

      filtered_docs.forEach(function (doc, i) {
        console.log(i + ' ' + typeof(doc['timestamp']) + ' ' + doc['timestamp']) ;
        var current_doc = JSON.parse(doc['raw'])['retVal'];
        for (var k in current_doc) {
          for (var p in current_doc[k]) {
            if ((p == 'lat') || 
                (p == 'lng') || 
                (p == 'tot') || 
                (p == 'sbi') ) {
              current_doc[k][p] = parseFloat(current_doc[k][p]);
            } else if (p == 'sna') {
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
            markers.push({
              pos: {lat: current_doc[k]['lat'], lng: current_doc[k]['lng']},
              diff: sbi_diff,
              sna: current_doc[k]['sna'],
              diff_ratio: 100*sbi_diff/current_doc[k]['tot'],
              sbi_ratio: 100*current_doc[k]['sbi']/current_doc[k]['tot']
            });
          }
        }
      })
      
      var markers_sort_by_sbi_ratio = markers.slice().sort(function (m, n) {
        return m['sbi_ratio'] - n['sbi_ratio'];
      }).reverse();
      
      var markers_sort_by_diff_ratio = markers.slice().sort(function (m, n) {
        return m['diff_ratio'] - n['diff_ratio'];
      })
      // console.log(markers_sort_by_sbi_ratio);
      var min_diff_ratio_element = markers_sort_by_diff_ratio[0];
      var max_diff_ratio_element = markers_sort_by_diff_ratio[markers.length-1];
      var max_sbi_ratio_element = markers_sort_by_sbi_ratio[0];
      
      markers.forEach(function (m) {
        if ((m.sna == min_diff_ratio_element.sna) && (m.sna == max_sbi_ratio_element.sna)) {
          m['info'] = '最高出租率、最高存留率'
        } else if ((m.sna == max_diff_ratio_element.sna) && (m.sna == max_sbi_ratio_element.sna)) {
          m['info'] = '最高歸還率、最高存留率';
        } else if (m.sna == min_diff_ratio_element.sna) {
          m['info'] = '最高出租率';
        } else if (m.sna == max_diff_ratio_element.sna) {
          m['info'] = '最高歸還率';
        } else if (m.sna == max_sbi_ratio_element.sna) {
          m['info'] = '最高存留率';
        } else {}
      })

      chart['最高出租率'] = {};
      chart['最高歸還率'] = {};
      chart['最高存留率'] = {};
      // chart['最高出租率'] = min_diff_ratio_element;
      // chart['最高歸還率'] = max_diff_ratio_element;
      // chart['最高存留率'] = max_sbi_ratio_element;
      chart['最高出租率'][min_diff_ratio_element['sna']] = min_diff_ratio_element['diff_ratio'];
      chart['最高歸還率'][max_diff_ratio_element['sna']] = max_diff_ratio_element['diff_ratio'];
      chart['最高存留率'][max_sbi_ratio_element['sna']] = max_sbi_ratio_element['sbi_ratio'];

      console.log('emit');
      io.emit('update data', {
        'marker': markers,
        'chart': chart
      });
    } else {
      console.log('Data number less than n rows');
    }
  },
  bar: 'test'
};
