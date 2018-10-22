const $galleryDiv = $('#gallery');
let employees = [];
//use Jquery ajax function to request data from the randomuser API
function displayGallery() { 
$.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=US,GB,CA,AU,NZ,IE',
    dataType: 'json',
    success: function(data) {
      console.log(data);
      employees = data.results;    
      
      let galHtml = '';
      $.each(employees, (i, employee) => {
          
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
  });
}

{/* <div class="modal-container">
<div class="modal">
    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
    <div class="modal-info-container">
        <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
        <h3 id="name" class="modal-name cap">name</h3>
        <p class="modal-text">email</p>
        <p class="modal-text cap">city</p>
        <hr>
        <p class="modal-text">(555) 555-5555</p>
        <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
        <p class="modal-text">Birthday: 10/21/2015</p>
    </div>
</div>

// IMPORTANT: Below is only for exceeds tasks 
<div class="modal-btn-container">
    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
    <button type="button" id="modal-next" class="modal-next btn">Next</button>
</div>
</div> */}

displayGallery();

$galleryDiv.click( (e) => {
   console.log(e.target.className);
    if (e.target.className !== "gallery") { 
        if (e.target.className === 'card') {
            console.log('card');
            empIndex = $(e.target).index();
        } else if (e.target.className === 'card-img-container' || 'card-info-container' ) {
            console.log('card info / image');
            if (e.target.className === 'card-info-container') {
            empIndex = $(e.target).parent().index();
            } else if (e.target.className === 'card-img-container') { 
                empIndex = $(e.target).parent().index();
            } else {
                empIndex = $(e.target).parent().parent().index();
            }
        } 

       
        console.log('card clicked ' + empIndex);

     
      
    }

    console.log(employees);
    formatDob = new Date(employees[empIndex].dob.date);
    //formatDob = formatDob.toLocaleDateString('en-US');
    console.log(formatDob.toLocaleDateString('en-US'));
    let modalHTML = `
            <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${employees[empIndex].picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${employees[empIndex].name.first} ${employees[empIndex].name.last}</h3>
                <p class="modal-text">${employees[empIndex].email}</p>
                <p class="modal-text cap">${employees[empIndex].location.city}</p>
                <hr>
                <p class="modal-text">${employees[empIndex].phone}</p>
                <p class="modal-text">${employees[empIndex].location.street}, ${employees[empIndex].location.city}, ${employees[empIndex].location.state} ${employees[empIndex].location.postcode}</p>
                <p class="modal-text">Birthday: ${formatDob.toLocaleDateString('en-US')}</p>
            </div>
        </div>

    `  // end template literal for modal window

    $('body').append(modalHTML)


});
