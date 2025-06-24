import React from 'react'

const Search = ({searchTerm,setSearchTerm}) => {
  return (
    <div className='text-white text-3xl search' >
      <div>
        <img src='./public/vector.svg' alt='search' />
        <input type='text' placeholder='Search Through Thousands of Movies' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
       {console.log(searchTerm)} 
   
      </div>
      
    </div>
        
  )
}

export default Search
