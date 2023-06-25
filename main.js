// get the html contents 
const searchInput = document.getElementById('searchInput');
const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
const modal = document.getElementById('myModal');
const modalCityName = document.getElementById('modalCityName');
const modalStateName = document.getElementById('modalStateName');
const modalPopulation = document.getElementById('modalPopulation');
const modalGrowth = document.getElementById('modalGrowth');
const modalClose = document.getElementsByClassName('close')[0];

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
                const cityCell = row.insertCell();
                const stateCell = row.insertCell();
                const populationCell = row.insertCell();
                const growthCell = row.insertCell();

                // const cityLink = document.createElement('a');
                // cityLink.textContent = city.city;
                // cityCell.appendChild(cityLink);
                cityCell.textContent = city.city
                stateCell.textContent = city.state;
                populationCell.textContent = city.population;

                // Highlight the search query in the city name
                const highlightedCityName = highlightSearchQuery(city.city, query);
                cityCell.innerHTML = highlightedCityName;

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

                // Add click event listener to the row
                row.addEventListener('click', () => {
                    openModal(city);
                });
            });
        }

        // function to highlight the search query 
        function highlightSearchQuery(text, query) {
            if (query.trim() === '') {
                return text; // Return original text if query is empty
            }

            const regex = new RegExp(query, 'gi');
            return text.replace(regex, match => `<span class="highlight">${match}</span>`);
        }

        // Call filterCities() with empty query to display all results by default
        filterCities('');

        // Event listener for search input
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value;
            filterCities(query);
        });

        // Open modal with city details
        function openModal(city) {
            modalCityName.textContent = city.city;
            modalStateName.textContent = 'State: ' + city.state;
            modalPopulation.textContent = 'Population: ' + city.population;
            modalGrowth.textContent = 'Growth %: ' + city.growth_from_2000_to_2013;
            modal.style.display = 'block';
        }

        // Close modal
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    })
    .catch(error => console.error('Error:', error));
