import React, { useState, useEffect, useRef } from 'react';

const CategorySelector = ({ categories, setCategories }) => {
  const [inputValue, setInputValue] = useState('');
  const [availableCategories, setAvailableCategories] = useState([
    'Work', 'Personal', 'Study', 'Health', 'Finance', 'Home', 'Shopping', 'Family', 'Travel'
  ]);
  const inputRef = useRef(null);

  // Filter out already selected categories from suggestions
  useEffect(() => {
    const filteredCategories = ['Work', 'Personal', 'Study', 'Health', 'Finance', 'Home', 'Shopping', 'Family', 'Travel']
      .filter(cat => !categories.includes(cat));
    setAvailableCategories(filteredCategories);
  }, [categories]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addCategory(inputValue.trim());
    }
  };

  const addCategory = (category) => {
    const formattedCategory = category.trim();
    if (formattedCategory && !categories.includes(formattedCategory)) {
      setCategories([...categories, formattedCategory]);
      setInputValue('');
    }
  };

  const removeCategory = (categoryToRemove) => {
    setCategories(categories.filter(category => category !== categoryToRemove));
  };

  return (
    <div className="category-selector mb-3">
      <label htmlFor="categories" className="form-label">
        <i className="fas fa-tags me-2"></i>Categories
      </label>
      
      <div className="input-group mb-2">
        <input
          type="text"
          id="categories"
          className="form-control"
          placeholder="Add a category and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        <button 
          className="btn btn-outline-primary" 
          type="button"
          onClick={() => {
            if (inputValue.trim()) {
              addCategory(inputValue);
            }
          }}
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>
      
      {/* Category suggestions */}
      {availableCategories.length > 0 && (
        <div className="category-suggestions mb-3">
          <small className="text-muted d-block mb-2">Suggestions:</small>
          <div className="d-flex flex-wrap gap-2">
            {availableCategories.map(category => (
              <span 
                key={category} 
                className="badge bg-light text-dark category-suggestion"
                onClick={() => {
                  addCategory(category);
                  inputRef.current.focus();
                }}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Selected categories */}
      {categories.length > 0 && (
        <div className="selected-categories">
          <div className="d-flex flex-wrap gap-2">
            {categories.map(category => (
              <span key={category} className="badge bg-primary category-badge">
                {category}
                <button 
                  type="button" 
                  className="btn-close btn-close-white ms-2" 
                  aria-label="Remove category"
                  onClick={() => removeCategory(category)}
                ></button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
