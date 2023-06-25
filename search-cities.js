// get the result table and search input elements 
const searchInput = document.getElementById('searchInput');
const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];

// Fetch cities
fetch('https://tinyurl.com/5bzzvh6u')
    .then(response => response.json())
    .then(data => {
        // Function to filter cities based on search query
        function filterCities(query) {
            resultsTable.innerHTML = ''; // Clear previous results

            // Filter cities based on query
            const filteredCities = data.filter(city => {
                const cityName = city.city.toLowerCase();
                const stateName = city.state.toLowerCase();
                const searchQuery = query.toLowerCase();

                return cityName.includes(searchQuery) || stateName.includes(searchQuery);
            });

            // Display filtered cities in the table
            filteredCities.forEach(city => {
                const row = resultsTable.insertRow();
                row.insertCell().textContent = city.city;
                row.insertCell().textContent = city.state;
                row.insertCell().textContent = city.population;
                const growthCell = row.insertCell();

                // Remove '%' sign and convert growth to number
                const growthValue = parseFloat(city.growth_from_2000_to_2013.replace('%', ''));

                // Add class for positive or negative growth
                if (growthValue > 0) {
                    growthCell.textContent = city.growth_from_2000_to_2013;
                    growthCell.classList.add('positive');
                } else if (growthValue < 0) {
                    growthCell.textContent = city.growth_from_2000_to_2013;
                    growthCell.classList.add('negative');
                } else {
                    growthCell.textContent = '0%';
                }
            });
        }

        // Call filterCities() with empty query to display all results by default
        filterCities('');

        // Event listener for search input
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value;
            filterCities(query);
        });
    })
    .catch(error => console.error('Error:', error));
