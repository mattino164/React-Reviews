// ------------------------------
// FilterSortBar Component
// ------------------------------
// A reusable component that provides filtering and sorting options
// Props:
// - onFilter: callback function to handle filter changes
// - onSort: callback function to handle sort changes
export default function FilterSortBar({ onFilter, onSort }) {
  return (
    <div className="flex gap-4 mb-4">
      {/* ------------------------------
          Filter Dropdown
          Allows user to filter reviews by category
      ------------------------------ */}
      <select onChange={(e) => onFilter(e.target.value)}>
        <option value="">All</option>
        <option value="Anime">Anime</option>
        <option value="Movie">Movie</option>
        <option value="Game">Game</option>
        <option value="Sports">Sports</option>
        <option value="Shooter">Shooter</option>
        <option value="Fighting">Fighting</option>
        <option value="Strategy">Strategy</option>
        <option value="Drama">Drama</option>
        <option value="Shonen">Shonen</option>
        <option value="Horror">Horror</option>
        <option value="Action">Action</option>
        <option value="Comedy">Comedy</option>
        <option value="Family">Family</option>
      </select>

      {/* ------------------------------
          Sort Dropdown
          Allows user to sort reviews by criteria such as date or rating
      ------------------------------ */}
      <select onChange={(e) => onSort(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="ratingHigh">Highest Rating</option>
        <option value="ratingLow">Lowest Rating</option>
      </select>
    </div>
  );
}
