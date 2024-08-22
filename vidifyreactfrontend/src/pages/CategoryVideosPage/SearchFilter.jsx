import React from 'react';
import './SearchFilter.css';

function SearchFilter({ setSearchFilter, setTypeFilter, searchFilter, typeFilter }) {
  const handleSearchChange = (e) => {
    console.log("Search input:", e.target.value);  // Debug log
    setSearchFilter(e.target.value);
  };

  const handleTypeChange = (e) => {
    console.log("Filter change:", e.target.value);  // Debug log
    setTypeFilter(e.target.value);
  };

  return (
    <div className="search-filter">
      <input 
        type="text" 
        placeholder="Search videos" 
        className="search-bar" 
        value={searchFilter} 
        onChange={handleSearchChange} 
      />
      <div className="dropdowns">
        <div className="dropdown">
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort" 
            name="sort" 
            className="dropdown-select" 
            value={typeFilter} 
            onChange={handleTypeChange}
          >
            <option value="">All</option>
            <option value="mostViewed">Most Viewed</option>
            <option value="Latest">Latest</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
