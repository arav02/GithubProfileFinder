import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('stars');
  const [repositories, setRepositories] = useState([]);
  const [userProfilePhoto, setUserProfilePhoto] = useState('');

  // Handle search form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      const response = await axios.get(`https://api.github.com/search/repositories?q=${searchQuery}&sort=${sortOption}`);
      setRepositories(response.data.items);
    
    // Fetch user profile photo
    if (response.data.items.length > 0) {
    const username = response.data.items[0].owner.login;
    const userProfileResponse = await axios.get(`https://api.github.com/users/${username}`);
    setUserProfilePhoto(userProfileResponse.data.avatar_url);
      }
   }
  };

  // Handle sort option change
  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div class="container">
      <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="search-query">Search Github Profiles</label>
        </div>
        <div class="search-box">
            <input id="search-query" type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
            <select value={sortOption} onChange={handleSortOptionChange}>
              <option value="stars">Sort by stars</option>
              <option value="forks">Sort by forks</option>
            </select>
            <button type="submit">Search</button>
        </div>
      </form>
      <div class = "profile-result">
      <div>
      {userProfilePhoto && (
        <img id="img" src={userProfilePhoto} alt="User profile" />
      )}
      </div>
      <div>
      {repositories.length > 0 ? (
        <ul>
          {repositories.map((repository) => (
            <li key={repository.id}>
              <a href={repository.html_url}>{repository.name}</a> ({repository[sortOption]} {sortOption})
            </li>
          ))}
        </ul>
      ) : (
        <p>No repositories found.</p>
      )}
    </div>
    </div>
    </div>
  );
}

export default App;
