const $galleryDiv = $('#gallery');

//use Jquery ajax function to request data from the randomuser API
function displayGallery() { 
$.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=US,GB,CA,AU,NZ,IE',
    dataType: 'json',
    success: function(data) {
      console.log(data);
     
     
      let html = '';
      $.each(data.results, (i, employee) => {
          console.log(employee.name);
          html = '<div class="card">';
        html +=  '<div class="card-img-container">';
         html += `<img class="card-img" src="${employee.picture.large}" alt="profile picture"></div>`;
        html += '<div class="card-info-container">';
         html += `<h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last} </h3>`;
         html += `<p class="card-text">${employee.email}</p>`;
         html += `<p class="card-text cap">${employee.location.city}, ${employee.location.state}</p></div>`
         html += '</div>';
         $galleryDiv.append(html);
      });
      
      
    }
  });
  
}



displayGallery();

