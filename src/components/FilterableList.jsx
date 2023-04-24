import React, {useState} from 'react';
import '../scss/components/_search.scss';
import search from '../img/search-outline.svg';

const FilterableList = ({ data, field='name', renderList }) => {
    const [filter, setFilter] = useState('');

    const filteredData = data.filter((item) => {
        return item[field].toLowerCase().includes(filter.toLowerCase());
    });

    return (
        <div>
            <div className='filter-container'>
                <input type="text" className='search' placeholder="Buscar" onChange={(e) => setFilter(e.target.value)}></input>
                <img src={search} className='search-icon' alt="Search" />
            </div>
            {renderList(filteredData)}
        </div>
    );
};

export default FilterableList;