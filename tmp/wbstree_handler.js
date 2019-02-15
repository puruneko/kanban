/*
const customMenu = function(node) {
  var items =
  {
    'item1':
    {
      'label': 'item1',
      'action':
        function ()
        {
          console.log('item1 is clicked!')
          console.log(node)
        },
    },
    'item2':
    {
      'label': 'item2',
      'action':
        function()
        {
          console.log('item2 is clicked!')
          console.log(node)
        }
    }
  }
  return items
}

$(function () {
    // create an instance when the DOM is ready
    $('#jstree').jstree(
    {
      'contextmenu':
      {
        'items': customMenu,
      },
      'plugins':
      [
        'contextmenu',
      ],
    })
    // bind to events triggered on the tree
    $('#jstree').on("changed.jstree", function (e, data) {
      selectedList = []
      data.selected.map(function (s) {
        selectedList.push(data.instance.get_node(s).text)
      })
      console.log(selectedList)
    })
  })
*/