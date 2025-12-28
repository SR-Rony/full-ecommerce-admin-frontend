
const ClickedCategoriesComponent = ({ categories }) => {
  return (
    <div className="flex space-x-2 flex-wrap">
      <ul className="list-none flex items-center gap-2 flex-wrap">
        {categories.map((category, index) => (
          <li className="bg-gray-100 p-2 rounded-md" key={index}>{category}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClickedCategoriesComponent;
