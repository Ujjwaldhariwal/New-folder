// src/services/api.js

/**
 * A reusable function to fetch data from an API with Basic Authentication.
 * @param {string} url - The API endpoint URL.
 * @param {string} username - The username for Basic Authentication.
 * @param {string} password - The password for Basic Authentication.
 * @param {object} body - The request body for the POST request.
 * @returns {Promise<any>} - A promise that resolves with the JSON data from the API.
 */
export async function fetchData(url, username, password, body = {}) {
  const credentials = btoa(`${username}:${password}`); // Base64 encode credentials

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Throw an error with the status text if the response is not OK
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    // You can re-throw the error or return a specific error object
    // to be handled by the calling function.
    throw error;
  }
}
