const $galleryDiv = $('#gallery');
const $empDirHeader = $('.header-text-container');
let employees = [];
let results = [];

// creates HTML message and displays the employee information 
function displayEmployees(empData) {
    
    let galHtml = '';
      $.each(empData, (i, employee) => {
          
            galHtml = '<div class="card">';
            galHtml +=  '<div class="card-img-container">';
            galHtml += `<img class="card-img" src="${employee.picture.large}" alt="profile picture"></div>`;
            galHtml += '<div class="card-info-container">';
            galHtml += `<h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last} </h3>`;
            galHtml += `<p class="card-text">${employee.email}</p>`;
            galHtml += `<p class="card-text cap">${employee.location.city}, ${employee.location.state}</p></div>`
            galHtml += '</div>';
         $galleryDiv.append(galHtml);
      });  
}

// Create the modal HTML elements and append the first clicked employee to body
function displayModal(empData, empIndex) {
    let formatDob = new Date(empData[empIndex].dob.date);
    
    let modalHTML = `
        <div class="modal-container">
                <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${empData[empIndex].picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${empData[empIndex].name.first} ${empData[empIndex].name.last}</h3>
                    <p class="modal-text">${empData[empIndex].email}</p>
                    <p class="modal-text cap">${empData[empIndex].location.city}</p>
                    <hr>
                    <p class="modal-text">${empData[empIndex].cell}</p>
                    <p class="modal-text">${empData[empIndex].location.street}, ${empData[empIndex].location.city}, ${empData[empIndex].location.state} ${empData[empIndex].location.postcode}</p>
                    <p class="modal-text">Birthday: ${formatDob.toLocaleDateString('en-US')}</p>
                </div>
            </div>
            <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
        `;  // end template literal for modal window
        
        $('body').append(modalHTML);
}

//use Jquery ajax function to request data from the randomuser API and store the results to use as seed data
function getEmpData() { 
$.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=US,GB,CA,AU,NZ,IE',
    dataType: 'json',
    success: function(data) {
      
      employees = data.results;  
      displayEmployees(employees);
    }
  });
}

getEmpData();


// search employee, currently only searching the first name, going to develop this some more to include first and last and/or partial matches.
function displaySearch(event) {
    
    results = employees.filter( (emp) => {
        let $eval = $('#search-input').val().toLowerCase();
        let fullName = emp.name.first + emp.name.last;
       
        if (fullName.indexOf($eval) > - 1) {
           return true;
        }
    });
    
    if (results.length > 0) {
        $galleryDiv.html('');
        displayEmployees(results);

    } else {
         $galleryDiv.html('');
         displayEmployees(employees);
    }
}

//create the Search HTML elements
let searchDiv = `<form action="#" method="get">
                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                    </form>`;

$('body').append(searchDiv);

//display the search results on submit
$('#search-submit').click( (e) => {
    e.preventDefault();
    displaySearch(e);
});


// display the approriate employee based on employee data and index passed
function navModal(empData, empIndex) {
   
    let formatDob = new Date(empData[empIndex].dob.date);
      //  $('.modal-info-container').html('');
        $('.modal-info-container').html(`
            <img class="modal-img" src="${empData[empIndex].picture.large}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${empData[empIndex].name.first} ${empData[empIndex].name.last}</h3>
            <p class="modal-text">${empData[empIndex].email}</p>
            <p class="modal-text cap">${empData[empIndex].location.city}</p>
            <hr>
            <p class="modal-text">${empData[empIndex].cell}</p>
            <p class="modal-text">${empData[empIndex].location.street}, ${empData[empIndex].location.city}, ${empData[empIndex].location.state} ${empData[empIndex].location.postcode}</p>
            <p class="modal-text">Birthday: ${formatDob.toLocaleDateString('en-US')}</p>
        `);
}

//listen for click on employee card and pop up selected user into modal window
$galleryDiv.click( (e) => {
    let empIndex = 0;
   
   //the below if else statement checks back and forth for the element clicked to determine which card was selected
   //May need to revisit this afterwards to see what better ways I could have accomplished this but this seems to work so far.
    function eleClicked(empData) {
        if (e.target.className !== "gallery") { 
            if (e.target.className === 'card') {
                empIndex = $(e.target).index();
                displayModal(empData, empIndex);
            } else if (e.target.className === 'card-img-container' || 'card-info-container' ) {
                if (e.target.className === 'card-info-container') {
                empIndex = $(e.target).parent().index();
                displayModal(empData, empIndex);
                } else if (e.target.className === 'card-img-container') { 
                    empIndex = $(e.target).parent().index();
                    displayModal(empData, empIndex);
                } else {
                    empIndex = $(e.target).parent().parent().index();
                    displayModal(empData, empIndex);
                }
            } 
        }
    }

    //determine if there was a search or not
   if(results.length === 0) { 
        eleClicked(employees);
    } else {
        eleClicked(results);
    } 
        
    // Navigate to the next employee and display in the modal, if the last employee is already reached then nothing happens.
    $('#modal-next').click( (e) => {
        if(results.length === 0 && empIndex !== 11) { 
            navModal(employees, empIndex + 1);
            empIndex += 1;
        } else if (empIndex < results.length - 1 ) {
            navModal(results, empIndex + 1);
            empIndex += 1;
        
        }
    });
   
     // Navigate to the previous employee and display in the modal, if the first employee is already reached then nothing happens.
     $('#modal-prev').click( (e) => {
        if(results.length === 0 && empIndex !== 0) { 
            navModal(employees, empIndex - 1);
            empIndex -= 1;
        } else if (empIndex !==0) {
            navModal(results, empIndex - 1);
            empIndex -= 1;
        }
     });
   
    //close the modal if user clicks darkend area of screen
    $('.modal-container').click( (e) => {
        if (e.target.className === 'modal-container') {
        $('.modal-container').remove();
      }
    });

    //close the modal if user clicks the X button
    $('#modal-close-btn').click( (e) => {
        $('.modal-container').remove();
     });

     //reload complete employee directory (to return from a filtered search result). Need to add visual clues to feature.
     $empDirHeader.click( () => {
        $galleryDiv.html('');
        displayEmployees(employees);

     });
   
});


