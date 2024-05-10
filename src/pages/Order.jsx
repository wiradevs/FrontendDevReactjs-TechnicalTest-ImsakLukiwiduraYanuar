import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMapMarkerAlt, faCity, faUtensils, faUtensilSpoon, faCocktail } from '@fortawesome/free-solid-svg-icons';


const Order = ({ navigateToDetailView }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [openNow, setOpenNow] = useState(false);
  const [priceFilter, setPriceFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [displayedRestaurants, setDisplayedRestaurants] = useState([]);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetch('https://restaurant-api.dicoding.dev/list')
      .then(response => response.json())
      .then(data => {
        setRestaurants(data.restaurants);
        setDisplayedRestaurants(data.restaurants.slice(0, 8));
      });
  }, []);

  const filterRestaurants = () => {
    let filteredRestaurants = restaurants;
  
    if (openNow) {
      filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.open_now);
    }
  
    if (priceFilter) {
      let minRating = 0;
      let maxRating = 5;
      
      // Menetapkan rentang rating berdasarkan harga
      switch (priceFilter) {
        case '$':
          maxRating = 1;
          break;
        case '$$':
          minRating = 2;
          maxRating = 3;
          break;
        case '$$$':
          minRating = 3;
          maxRating = 4;
          break;
        case '$$$$':
          minRating = 4;
          maxRating = 5;
          break;
        case '$$$$$':
          minRating = 5;
          break;
        default:
          break;
      }
  
      // Memfilter restoran berdasarkan rentang rating
      filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.rating >= minRating && restaurant.rating <= maxRating);
    }
  
    if (categoryFilter) {
      filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.city.includes(categoryFilter));
    }
  
    return filteredRestaurants;
  };
  

  const handleOpenNowChange = () => {
    setOpenNow(!openNow);
  };

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleLoadMore = () => {
    const currentLength = displayedRestaurants.length;
    const newLength = currentLength + 4;
    setDisplayedRestaurants(restaurants.slice(0, newLength));
  };

  const handleClearFilters = () => {
    setOpenNow(false);
    setPriceFilter('');
    setCategoryFilter('');
  };

  const fetchRestaurantDetail = (restaurantId) => {
    fetch(`https://restaurant-api.dicoding.dev/detail/${restaurantId}`)
      .then(response => response.json())
      .then(data => {
        setModalData(data.restaurant);
        // Menampilkan modal dengan SweetAlert
        Swal.fire({
          title: data.restaurant.name,
          html: `
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-12">
                  <img class="img-fluid mb-3" src="https://restaurant-api.dicoding.dev/images/small/${data.restaurant.pictureId}" alt="Restaurant" />
                  <p><strong>Description:</strong> ${data.restaurant.description}</p>
                  <p><strong><i class="fas fa-star"></i> Rating:</strong> ${data.restaurant.rating}</p>
                  <p><strong><i class="fas fa-map-marker-alt"></i> Address:</strong> ${data.restaurant.address}</p>
                  <p><strong><i class="fas fa-city"></i> City:</strong> ${data.restaurant.city}</p>
                  <p><strong><i class="fas fa-utensils"></i> Categories:</strong> ${data.restaurant.categories.map(category => category.name).join(', ')}</p>
                  <h2>Menus</h2>
                  <p><strong><i class="fas fa-utensil-spoon"></i> Foods:</strong> ${data.restaurant.menus.foods.map(food => food.name).join(', ')}</p>
                  <p><strong><i class="fas fa-cocktail"></i> Drinks:</strong> ${data.restaurant.menus.drinks.map(drink => drink.name).join(', ')}</p>
                </div>
              </div>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: 'Close',
          cancelButtonText: 'Add to Favorites',
          customClass: {
            container: 'my-swal-container',
          },
        });
      })
      .catch(error => console.error('Error fetching restaurant detail:', error));
  };
  
  

  return (
    <div>
      <div className='p-5'>
        <p style={{ fontSize: '40px' }}>Restaurants</p>
        <p style={{ paddingRight: '50em', lineHeight: '25px' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Nullam ultrices ante et neque rutrum, vel interdum magna pretium.  Mauris vitae lectus id purus malesuada accumsan.
        </p>
      </div>

      <div className='jus border-top border-bottom row px-5'>
        <div className="d-flex col-md-1 bg-transparent p-3">
          <p className="mb-0 ">Filter By:</p>
        </div>
        <div className="d-flex col-md-2 bg-transparent p-3">
          <label className="mb-0">
            <input type="checkbox" checked={openNow} onChange={handleOpenNowChange} />
            Open Now
          </label>
        </div>
        <div className="d-flex col-md-2 bg-transparent p-3">
          <select className="form-select" value={priceFilter} onChange={handlePriceChange}>
            <option value="">Any Price</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
            <option value="$$$$">$$$$</option>
            <option value="$$$$$">$$$$$</option>
          </select>
        </div>
        <div className="d-flex col-md-2 bg-transparent p-3">
          <select className="form-select" value={categoryFilter} onChange={handleCategoryChange}>
            <option value="">Any Category</option>
            <option value="Balikpapan">Balikpapan</option>
            <option value="Malang">Malang</option>
            <option value="Surabaya">Surabaya</option>
            <option value="Balikpapan">Balikpapan</option>
            <option value="Bandung">Bandung</option>
            <option value="Ternate">Ternate</option>
          </select>
        </div>
        <div className="d-flex justify-content-end col-md-5 bg-transparent p-3">
          <button className="btn btn-outline-secondary mr-5" onClick={handleClearFilters}>
            <p className="mb-0">Clear All</p>
          </button>
        </div>
      </div>

      <div className='container-fluid p-5'>
        <p className="display-6 pb-4">All Restaurants</p>
        <div className="row">
        <div className="row">
          {(openNow || priceFilter || categoryFilter ? filterRestaurants() : displayedRestaurants).map((restaurant, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className="card my-3">
                <img style={{ height: '300px', objectFit: 'cover' }} className="card-img-top" src={`https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}`} alt="Restaurant" />
                <div className="card-body">
                  <h5 className="card-title">{restaurant.name}</h5>
                  <p className="card-title">
                    <FontAwesomeIcon icon={faCity} className="me-2" />
                    {restaurant.city}
                  </p>
                  <p className="card-text">
                    {[...Array(Math.floor(restaurant.rating))].map((_, index) => (
                      <span key={index} style={{ color: '#130d5c' }}>&#9733;</span>
                    ))}
                  </p>
                  <div className='d-flex justify-content-between'>
                    <div>
                      <p className="card-text">Price Range: {restaurant.rating}</p>
                    </div>
                    <div>
                      {restaurant.open_now ?
                        <div className="d-flex align-items-center">
                          <div className="mr-2">
                            <div className="rounded-circle bg-success" style={{ width: '10px', height: '10px' }}></div>
                          </div>
                          <p className="mb-0">Open</p>
                        </div>
                        :
                        <div className="d-flex align-items-center">
                          <div className="mr-2">
                            <div className="rounded-circle bg-danger" style={{ width: '10px', height: '10px' }}></div>
                          </div>
                          <p className="mb-0 px-2">Closed</p>
                        </div>
                      }
                    </div>
                  </div>
                  <button className="btn mt-3" style={{ backgroundColor: '#130d5c', color: 'white', width: '100%' }} onClick={() => fetchRestaurantDetail(restaurant.id)}>Learn More</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        </div>

        <div className='d-flex justify-content-center align-items-center bg-transparent'>
          <button className="btn btn-dark mt-3 px-5" style={{ backgroundColor: 'white', color: 'black' }} onClick={handleLoadMore}>Load More</button>
        </div>
      </div>
    </div>
  );
};

export default Order;
