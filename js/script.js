const $galleryDiv = $('#gallery');
let employees = [];
let results = [];

function displayEmployees(empData) {
    console.log('display');
    console.log(empData);
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

//use Jquery ajax function to request data from the randomuser API
function getEmpData() { 
$.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=US,GB,CA,AU,NZ,IE',
    dataType: 'json',
    success: function(data) {
      console.log(data);
      employees = data.results;  
      displayEmployees(employees);
    }
  });
}

getEmpData();



function displaySearch(event) {
    console.log($('#search-input').val());
    results = employees.filter( (emp) => {
        return emp.name.first.toLowerCase() === $('#search-input').val().toLowerCase();
    });
    console.log(results);
    if (results.length > 0) {
        $galleryDiv.html('');
        displayEmployees(results);

    } else {$galleryDiv.html('');
         displayEmployees(employees);
    }
}

let searchDiv = `<form action="#" method="get">
                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                    </form>`;

$('body').append(searchDiv);

$('#search-submit').click( (e) => {
    e.preventDefault();
    displaySearch(e);
});

function navModal(empData, empIndex) {
    console.log('navigate', empIndex);
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
   console.log(results.length);
   //the below if else statement checks back and forth for the element clicked to determine which card was selected
   //I may refactor this to filter by actual name info instead of relative index location after I implement the search function and see how the below works.
   if(results.length === 0) { 
   if (e.target.className !== "gallery") { 
        if (e.target.className === 'card') {
            console.log('card');
            empIndex = $(e.target).index();
            displayModal(employees, empIndex);
        } else if (e.target.className === 'card-img-container' || 'card-info-container' ) {
            console.log('card info / image');
            if (e.target.className === 'card-info-container') {
            empIndex = $(e.target).parent().index();
            displayModal(employees, empIndex);
            } else if (e.target.className === 'card-img-container') { 
                empIndex = $(e.target).parent().index();
                displayModal(employees, empIndex);
            } else {
                empIndex = $(e.target).parent().parent().index();
                displayModal(employees, empIndex);
            }
        } 
              console.log('card clicked ' + empIndex);
         
    }
} else {
    displayModal(results, empIndex);
}
    console.log(employees);
    
//!!!!!!!!!!!!!!!  need to look at the results if statement to be able to navigate without error in console
    $('#modal-next').click( (e) => {
        if(results.length === 0 && empIndex !== 11) { 
            navModal(employees, empIndex + 1);
            empIndex += 1;
        } else if (empIndex < results.length - 1 ) {
            navModal(results, empIndex + 1);
            empIndex += 1;
        
        }
     });
   
     $('#modal-prev').click( (e) => {
        if(results.length === 0 && empIndex !== 0) { 
            navModal(employees, empIndex - 1);
            empIndex -= 1;
        } else if (empIndex !==0) {
            navModal(results, empIndex - 1);
            empIndex -= 1;
        }
     });
   

    $('.modal-container').click( (e) => {
        if (e.target.className === 'modal-container') {
        $('.modal-container').remove();
      }
    });

    $('#modal-close-btn').click( (e) => {
        $('.modal-container').remove();
     });
   
});


