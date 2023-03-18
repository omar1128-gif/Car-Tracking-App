import "./CarSearch.css";

const CarSearch = ({ searchTerm, setSearchTerm }) => {
    const handleOnChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <input
            className="car-search-input"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleOnChange}
        />
    );
};

export default CarSearch;
