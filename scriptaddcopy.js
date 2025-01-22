let headersAdded = false;

// Function to add content from a row to the editable box
function addToBox(button) {
  const boxContent = document.getElementById('boxContent');

  // If headers haven't been added yet, add them
  if (!headersAdded) {
    const table = button.closest('table');
    addHeadersToBox(table);
    headersAdded = true; // Set the flag to prevent adding headers again
  }

  const row = button.closest('tr');

  if (!row.classList.contains('added')) {
    const cells = row.querySelectorAll('td');
    let textToAdd = '';

    // Start from the second cell (index 1) to skip the first cell with the image
    for (let i = 1; i < cells.length - 1; i++) {
      textToAdd += cells[i].textContent.trim() + ' | ';
    }

    // Insert the row's data as text in the editable box with a new line
    boxContent.innerHTML += textToAdd.slice(0, -2) + '<br>';  // Remove trailing ' | ' and add a new line

    row.classList.add('added');
  }
}

// Function to add headers to the editable box
function addHeadersToBox(table) {
  const headers = table.querySelectorAll('thead th');
  let headerText = '';

  // Skip the first header cell (index 0) and process the rest
  for (let i = 1; i < headers.length; i++) {
    headerText += headers[i].textContent.trim() + ' | ';
  }

  const boxContent = document.getElementById('boxContent');
  boxContent.innerHTML += headerText.slice(0, -2) + '<br>';  // Remove trailing ' | ' and add a new line
}



// Add event listeners to the "Add" buttons (delegated event listener)
document.body.addEventListener('click', function(event) {
  if (event.target.classList.contains('add-btn')) {
    addToBox(event.target);  // Call addToBox when an "Add" button is clicked
  }
});

// Prompt the user if they try to leave the page with unsaved data in the box
window.addEventListener('beforeunload', function(event) {
  const boxContent = document.getElementById('boxContent');
  const contentText = boxContent.textContent.trim();

  // Only show the warning if there is content in the box
  if (contentText !== '') {
    const message = "You have unsaved changes. Are you sure you want to leave without copying the content?";
    event.returnValue = message; // Standard for most browsers
    return message; // Some browsers (older ones) may require this for a confirmation dialog
  }
});

// Function to implement search
function searchTable() {
  const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Get search term
  const tableRows = document.querySelectorAll('table tbody tr');

  tableRows.forEach(row => {
    let rowText = row.textContent.toLowerCase();  // Get row text
    if (rowText.indexOf(searchInput) > -1) {
      row.style.display = '';  // Show row if it matches
    } else {
      row.style.display = 'none';  // Hide row if it doesn't match
    }
  });
}

// Add event listener to the search input
document.getElementById('searchInput').addEventListener('input', searchTable);

// Show the user info modal
function showUserInfoForm() {
  // Show the modal by setting the display to block
  document.getElementById('userInfoModal').style.display = 'block';
}

// Function to collect user information from the form
function collectUserInfoFromForm() {
  const name = document.getElementById('userName').value;
  const org = document.getElementById('userOrg').value;
  const add = document.getElementById('userAdd').value;
  const phone = document.getElementById('userPhone').value;
  const email = document.getElementById('userEmail').value;
  const vessel = document.getElementById('userVessel').value;

  return {
    name: name || "Not Provided",   // Default to "Not Provided" if left blank
    org: org || "Not Provided",
    add: add || "Not Provided",
    phone: phone || "Not Provided",
    email: email || "Not Provided",
    vessel: vessel || "Not Provided"
  };
}

// Function to download text from input as a .txt file with dynamic filename
function downloadTextFile() {
  // First collect user info from the form
  const userInfo = collectUserInfoFromForm();

  const textContent = document.getElementById('boxContent').innerText.trim();  // Get the text from the editable box

  // Get current date and time
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');  // Add leading zero if month is single digit
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  // Format the filename as: YYYY-MM-DD_HH-MM-SS
  const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

  // Extract the current page filename from the URL (e.g., 'products.html')
  const currentPage = window.location.pathname.split('/').pop(); // Get the filename part of the URL (like products.html)

  // Custom name (can be set here or by the user)
  const customName = 'Pobedit-AS';  // Example, replace with any desired custom name

  // Combine all parts (custom name, page name, date, user input, and content) into one string
  const filename = `${customName}_${currentPage}_${formattedDate}.txt`;  // The filename now includes the page name and formatted date-time

  // Get the full URL of the current page (this will be added to the content)
  const currentPageURL = window.location.href;  // This will get the full URL like 'https://www.example.com/products.html'

  // Contact information to be included in the file
  const contactInfo = "\n\nKontakt informasjon:\nAdresse:\nPobedit AS\nHans Wæggers vei 15\n9901 Kirkenes\nE-post: post@pobedit.no\nTelefon: +47 92 92 92 43\n";

  // Combine all parts (date, content, user info, full URL, and contact info) into one string
  const finalContent = `Tid og dato: ${formattedDate}\nSide URL: ${currentPageURL}\n\nBestiller:\nNavn: ${userInfo.name}\nOrg.nr: ${userInfo.org}\nAddresse: ${userInfo.add}\nTelefon: ${userInfo.phone}\nE-post: ${userInfo.email}\nFartøy: ${userInfo.vessel}\n\n${textContent}${contactInfo}`;

  // Create a Blob with the final content
  const blob = new Blob([finalContent], { type: 'text/plain' });

  // Create a link to download the Blob
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;  // Use the dynamically generated filename

  // Trigger the download by simulating a click on the link
  link.click();

  // Close the modal after download
  closeModal();
}

// Close the modal
function closeModal() {
  document.getElementById('userInfoModal').style.display = 'none';
}

// Add event listener to show the modal when the "Download File" button is clicked
document.getElementById('downloadBtn').addEventListener('click', showUserInfoForm);
