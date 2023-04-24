import React from 'react';
import '../scss/components/_search.scss';

export const Search = () => {
  return (
    <div>
        <input type="text" className='search' placeholder="Buscar" onChange={(e) => setFilter (e.target.value)} />
    </div>
  )
}
