# Install the node modules by

npm i

# Start the project by

npm start

# You need to create your own .env file the same as .env copy to add the backend URL as REACT_APP_SERVERURL

# In the App.js, you may find the form where the user should enter his credit card information and send it to the server to save his card information

- In the Card Number & CVV the user only allowed to enter a numbers.
- In Expiration Month & Expiration Year the user allowed to enter a valid month and year.

- After the user hit the submit button, we applied the Luhn Algorithm as luhnCheck Function to check if the card number is valid or not before it send to the server and Luhn Algorithm also applied on the server side too.

- If all the data is valid and the data stored in the server side successfully the user will see a pop message in the response even if something went wrong.
