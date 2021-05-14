
function nestedSort() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues(); // Gets all data from the spreadsheet into a 2d array
  var list = [];
  for (var i = 0; i < data.length; i++) {
    // TODO: just get the needed columns and put the rest into 1 variable
    const id = data[i][0].toString()
    const name = data[i][8].toString()
    
    const col1 = data[i][1].toString()
    const col2 = data[i][2].toString()
    const col3 = data[i][3].toString()
    const col4 = data[i][4].toString()
    const col5 = data[i][5].toString()
    const col6 = data[i][6].toString()
    const col7 = data[i][7].toString()
    const col9 = data[i][9].toString()

    var parent;

    if (id.includes('.')) {
      var split = id.split('.');
      split.pop();
      parent = split.join('.')
    } else {
      parent = '0';
    }

    list.push({ id, name, parent, col1, col2, col3, col4, col5, col6, col7, col9 });
  }
  
  function nameCmp(a, b) { return a.name.localeCompare(b.name); }

  // The sort function mutates the `list` var in place.
  depthFirstTreeSort(list, nameCmp)

  // Write the new lines back into the document
  for ( var i =0; i< list.length; i++) {
    sheet.appendRow([list[i].id, list[i].col1, list[i].col2, list[i].col3, list[i].col4, list[i].col5, list[i].col6, list[i].col7, list[i].name, list[i].col9]);
  }
}

// Algorithm copied from https://codereview.stackexchange.com/questions/119574/sort-array-of-objects-with-hierarchy-by-hierarchy-and-name
function depthFirstTreeSort(arr, cmp) {
    // Returns an object, where each key is a node number, and its value
    // is an array of child nodes.
    function makeTree(arr) {
        var tree = {};
        for (var i = 0; i < arr.length; i++) {
            if (!tree[arr[i].parent]) tree[arr[i].parent] = [];
            tree[arr[i].parent].push(arr[i]);
        }

        return tree;
    }

    // For each node in the tree, starting at the given id and proceeding
    // depth-first (pre-order), sort the child nodes based on cmp, and
    // call the callback with each child node.
    function depthFirstTraversal(tree, id, cmp, callback) {
        var children = tree[id];
        if (children) {
            children.sort(cmp);
            for (var i = 0; i < children.length; i++) {
                callback(children[i]);
                depthFirstTraversal(tree, children[i].id, cmp, callback);
            }
        }
    }

    // Overwrite arr with the reordered result
    var i = 0;
    depthFirstTraversal(makeTree(arr), 0, cmp, function(node) {
        arr[i++] = node;
    });
}

