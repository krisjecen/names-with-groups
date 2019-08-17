/* Names with Groups
 * front-end
 * ==================== */

// Loads results onto the page
function getResults () {
  // Empty any results currently on the page
  document.querySelector('#results').innerHTML = ''

  // Grab all of the current names
  fetch('/all')
    .then(response => response.json())
    .then(function (data) {
    // For each note...
      for (var i = 0; i < data.length; i++) {
      // ...populate #results with a p-tag that includes the note's title and object id
        document.querySelector('#results').insertAdjacentHTML('afterbegin', "<p class='data-entry' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
        data[i]._id + '>' + data[i].title + '</span><span class=delete>X</span></p>')
      }
    })
}

// Runs the getResults function as soon as the script is executed
getResults()

document.querySelector('#buttons').addEventListener('click', function (event) {
  // When the #make-new button is clicked
  if (event.target.matches('#make-new')) {
  // fetch POST call to the submit route on the server
  // This will take the data from the form and send it to the server
    fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: document.querySelector('#title').value,
        note: document.querySelector('#note').value,
        created: Date.now()
      })
    })
    // If that API call succeeds, add the title and a delete button for the note to the page
      .then(response => response.json())
      .then(function (data) {
        // Add the title and delete button to the #results section

        document.querySelector('#results').insertAdjacentHTML('afterbegin', "<p class='data-entry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
      data._id + '>' + data.title + '</span><span class=delete>X</span></p>')
        // Clear the note and title inputs on the page
        document.querySelector('#note').value = ''
        document.querySelector('#title').value = ''
      })
  }

  // When the #clear-all button is pressed
  if (event.target.matches('#clear-all')) {
    // Make an fetch GET request to delete the names from the db
    fetch('/clearall')
      .then(response => response.json())
      .then(function (data) {
        // On a successful call, clear the #results section
        document.querySelector('#results').innerHTML = ''
      })
  }

  // When user click's update button, update the specific note
  if (event.target.matches('#updater')) {
    let selected = event.target
    // Make an fetch POST request
    // This uses the data-id of the update button,
    // which is linked to the specific note title
    // that the user clicked before
    fetch('/update/' + selected.dataset.id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: document.querySelector('#title').value,
        note: document.querySelector('#note').value
      })
    })
      .then(response => response.json())
      // On successful call
      .then(function (data) {
        // Clear the inputs
        document.querySelector('#note').value = ''
        document.querySelector('#title').value = ''
        // Revert action button to submit
        document.querySelector('#action-button').innerHTML = "<button id='make-new'>Submit</button>"
        // Grab the results from the db again, to populate the DOM
        getResults()
      })
  }
})

// When user clicks the delete button for a note
document.querySelector('#results').addEventListener('click', function (event) {
  if (event.target.matches('.delete')) {
    // Save the p tag that encloses the button
    let selected = event.target.parentElement
    // Make an fetch GET request to delete the specific note
    // this uses the data-id of the p-tag, which is linked to the specific note
    fetch('/delete/' + selected.dataset.id)
      .then(response => response.json())
      .then(function (response) {
      // Remove the p-tag from the DOM
        selected.remove()
        // Clear the note and title inputs
        document.querySelector('#note').value = ''
        document.querySelector('#title').value = ''
        // Make sure the #action-button is submit (in case it's update)
        document.querySelector('#action-button').innerHTML = "<button id='make-new'>Submit</button>"
      })
  }

  if (event.target.matches('.dataTitle')) {
    // Grab the element
    let selected = event.target
    // Make an fetch call to find the note
    // This uses the data-id of the p-tag, which is linked to the specific note
    fetch('/find/' + selected.dataset.id)
      .then(response => response.json())
      .then(function (data) {
      // Fill the inputs with the data that the fetch call collected
        document.querySelector('#note').value = data.note
        document.querySelector('#title').value = data.title
        // Make the #action-button an update button, so user can
        // Update the note s/he chooses
        document.querySelector('#action-button').innerHTML = "<button id='updater' data-id='" + data._id + "'>Update</button>"
      })
  }
})
