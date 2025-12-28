const SearchCustomers = ({ onChangeHandler, query } = {}) => {
  return (
    <div className="w-full md:w-fit">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-3 md:w-[250px] ps-10 text-sm text-gray-900 border border-gray-300 rounded-sm bg-white focus:border-gray-500"
          value={query?.q || ""}
          onChange={(e) => {
            onChangeHandler(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (e.target.value) {
                onChangeHandler(e.target.value);
              }
            }
          }}
          placeholder="Search Customers..."
          required
        />
      </div>
    </div>
  );
};

export default SearchCustomers;
