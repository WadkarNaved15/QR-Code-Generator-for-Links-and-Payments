document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('qrFormP');
    const submitButton = document.getElementById('submitButton');
    const submitButtonPayment = document.getElementById('submitButtonPayment');

    // Add event listener to the submit button
    submitButton.addEventListener('click', function() {
        // Get the value of the input field
        const linkInput = document.querySelector('#links');
        const linkValue = linkInput.value;

        // Check if link value is empty
        if (!linkValue) {
            alert('Please enter a link.'); // Display an error message if the link value is empty
            return; // Exit the function early
        }

        // Create a FormData object and append the link value
        // const params = new URLSearchParams();
        // params.append('links', linkValue);
        const formData = new FormData();
        formData.append('links', linkValue);

        // Make a POST request using fetch API
        fetch("/qrcode", {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Convert response to text
        })
        .then(data => {
            // Handle the response data here
            document.getElementById("qrCodeContainer").innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here, such as displaying an error message to the user
            alert('An error occurred while submitting the form. Please try again.');
        });
    });
    submitButtonPayment.addEventListener('click', function() {
        // Get the value of the input field
        const upiInput = document.getElementById("upiId");
        const upiValue = upiInput.value;
        const amountInput = document.getElementById("amount");
        const amountValue = amountInput.value;
        const currencyInput = document.getElementById("currency");
        const currencyValue = currencyInput.value;

        // Check if link value is empty
        if (!upiValue) {
            alert('Please enter a upi.'); // Display an error message if the link value is empty
            return; // Exit the function early
        }
        if (!amountValue) {
            alert('Please enter a amount.'); 
            return; 
        }

        const formData = new FormData();
        formData.append('upiId', upiValue);
        formData.append('amount', amountValue);
        formData.append('currency', currencyValue);

        // Make a POST request using fetch API
        fetch('/transaction-link', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Convert response to text
        })
        .then(data => {
            // Handle the response data here
            document.getElementById("qrCodeContainerPayment").innerHTML = data;
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors here, such as displaying an error message to the user
            alert('An error occurred while submitting the form. Please try again.');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const currencySelect = document.getElementById('currency');
    const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD']; // Add more currencies as needed

    // Populate dropdown with currency options
    currencies.forEach(currency => {
        const option = document.createElement('option');
        option.value = currency;
        option.textContent = getCurrencyName(currency); // Function to get currency name
        currencySelect.appendChild(option);
    });
});

// Define an object mapping currency codes to currency names
const currencyNames = {
    'INR': 'Indian Rupee',
    'USD': 'US Dollar',
    'EUR': 'Euro',
    'GBP': 'British Pound',
    'AUD': 'Australian Dollar',
    // Add more currency codes and names as needed
};

// Function to get currency name based on currency code
function getCurrencyName(currencyCode) {
    // Check if the currency code exists in the currencyNames object
    if (currencyCode in currencyNames) {
        // Return the corresponding currency name
        return currencyNames[currencyCode];
    } else {
        // If the currency code is not found, return the code itself
        return currencyCode;
    }
}






  
