import React, { useState } from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
    const [tempSearch, setTempSearch] = useState(searchTerm);

    const handleSearch = () => {
        setSearchTerm(tempSearch);
    };

    return (
        <div className="search">
            <div>
                <img src="/search.svg" alt="Search Icon" />

                <input
                    type="text"
                    placeholder="Search Through Thousands of Movies"
                    value={tempSearch}
                    onChange={(e) => setTempSearch(e.target.value)}
                />

                <button onClick={handleSearch}>Ok</button>
            </div>
        </div>
    );
};

export default Search;
