const gallery = document.querySelector('#gallery');
let peopleData; // This variable will hold an array of random employees pulled from an API

// The following function will change the modal details based on the index of the employee chosen
function changeModal(index) {
    const modal = document.querySelector('.modal-container');
    const person = peopleData[index];
    const cell = person.cell.replace('-', ' ', 0, 4); // This will replace the first dash with an empty space
    // Convert the birthday string to an array of strings. Year, month and day will be at index 0, 1 and 2 respectively.
    const birthday = person.dob.date.substring(0, 10).split('-');
    // Change the inner html of the modal and adding a hidden input to store the index of the current employee
    modal.innerHTML = `
            <div class="modal">
                <input value="${index}" hidden>
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${person.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                    <p class="modal-text">${person.email}</p>
                    <p class="modal-text cap">${person.location.city}</p>
                    <hr>
                    <p class="modal-text">${cell}</p>
                    <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
                    <p class="modal-text">Birthday: ${birthday[1]}/${birthday[2]}/${birthday[0]}</p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
    `;
    document.querySelector('#modal-close-btn').addEventListener('click', () => {
        const modal = document.querySelector('.modal-container');
        modal.parentNode.removeChild(modal);
    });
    document.querySelector('#modal-prev').addEventListener('click', () => {
        if (index === 0) {
            // When we reach the first employee and the user click on "previous", it will navigate to the last employee
            changeModal(11);
        } else {
            // Else, it will go to the previous employee
            changeModal(index - 1);
        }
    });
    document.querySelector('#modal-next').addEventListener('click', () => {
        if (index === 11) {
            // When we reach the last employee and the user click on "next", it will navigate to the first employee
            changeModal(0);
        } else {
            // Else, it will go to the next employee
            changeModal(index + 1);
        }
    });
}

gallery.addEventListener('click', (event) => {
    let target;
    if (event.target.className === 'card') {
        // If the user clicked on the card itself
        target = event.target;
    } else if (event.target.parentNode.className === 'card') {
        // If the user clicked on the image or the text of the card
        target = event.target.parentNode;
    } else if (event.target.parentNode.parentNode.className === 'card') {
        // If the user clicked on the image or the text of the card
        target = event.target.parentNode.parentNode;
    }
    // Get the index of the chosen employee by accessing the hidden input
    const index = parseInt(target.querySelector('input').value);
    // Insert the modal container div to prepare it for filling
    document.querySelector('body').insertAdjacentHTML('beforeend', `
        <div class="modal-container">
        </div>
    `);
    // This function will display the chosen employee
    changeModal(index);
});

// Adding the search field
document.querySelector('.search-container').innerHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`;

document.querySelector('form').addEventListener('submit', (event) => {
    // Prevent the page from being refreshed
    event.preventDefault();
    const searchPhrase = document.querySelector('#search-input').value;
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card.querySelector('#name').innerText.toUpperCase().includes(searchPhrase.toUpperCase())) {
            // If the name partially matches the search phrase, show the card
            card.style.display = 'inherit';
        } else {
            // Else, hide it
            card.style.display = 'none';
        }
    })
});

// Fetch 12 random employees from USA
fetch('https://randomuser.me/api/?results=12&nat=US')
    .then(response => response.json())
    .then(data => {
        peopleData = data.results;
        peopleData.map((person, index) => {
            // Adding a random employee to the end of the gallery
            // Please note that we included a hidden input field to store the index
            gallery.insertAdjacentHTML('beforeend', `
                <div class="card">
                    <input value="${index}" hidden>
                    <div class="card-img-container">
                        <img class="card-img" src="${person.picture.medium}" alt="profile picture">
                    </div>
                    <div class="card-info-container">
                        <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                        <p class="card-text">${person.email}</p>
                        <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
                    </div>
                </div>
          `);
        });
    });