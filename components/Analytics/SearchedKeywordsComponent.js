
const SearchedKeywordsComponent = ({ keywords }) => {
  return (
    <ul className="list-none flex items-center gap-2 flex-wrap">
      {keywords.map((keyword, index) => (
      <li className="bg-gray-100 p-2 rounded-md" key={index}>{keyword}</li>
      ))}
    </ul>
  );
};

export default SearchedKeywordsComponent;
