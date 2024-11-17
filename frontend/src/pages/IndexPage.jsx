import Post from "../components/Post.jsx";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
const url = import.meta.env.VITE_SERVER_URL;
export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { setSearchTerm, searchTerm } = useOutletContext();
  const [filters, setFilters] = useState({
    travelType: "",
    state: "",
    date: "recent first",
  });

  // Fetch posts from the API on component mount
  useEffect(() => {
    fetch(`${url}/post`)
      .then((response) => response.json())
      .then((posts) => {
        setPosts(posts);
        setFilteredPosts(posts);
      });
  }, []);

  // Filter and search posts whenever filters or searchTerm change
  useEffect(() => {
    let updatedPosts = [...posts];

    if (filters.travelType) {
      updatedPosts = updatedPosts.filter(
        (post) => post.travelType === filters.travelType
      );
    }

    if (filters.state) {
      updatedPosts = updatedPosts.filter(
        (post) => post.state.toLowerCase() === filters.state.toLowerCase()
      );
    }

    if (searchTerm) {
      updatedPosts = updatedPosts.filter((post) =>
        post.destination.toLowerCase().includes(searchTerm.toLowerCase())||post.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.date === "recent first") {
      updatedPosts.sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate)); // Latest first
    } else if (filters.date === "oldest first") {
      updatedPosts.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate)); // Oldest first
    }

    setFilteredPosts(updatedPosts);
  }, [filters, posts, searchTerm]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Reset all filters and search term
  const resetFilters = () => {
    setFilters({
      travelType: "",
      state: "",
      date: "recent first",
    });
    setSearchTerm('');
  };

  return (
    <div>
      <img src="https://images.unsplash.com/photo-1461603950871-cd64bcf7acf0?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className="image1"/>
      <div className="overlay-content">
        <h2>Discover breathtaking places across India</h2>
      </div>
    <div className="main-content">
      {/* Filters Section */}
      <div className="filters">
        <h3>Search by Filters</h3>
        &nbsp;
        <div className="filter-category">
          Travel Type
          <select name="travelType" onChange={handleFilterChange} value={filters.travelType}>
            <option value="">All</option>
            <option value="solo">Solo</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="business">Business</option>
          </select>
        </div>
        <div className="filter-category">
          Select State
          <select name="state" onChange={handleFilterChange} value={filters.state}>
            <option value="">All</option>
            <option value="gujarat">Gujarat</option>
            <option value="west bengal">West Bengal</option>
            <option value="rajasthan">Rajasthan</option>
            <option value="kerala">Kerala</option>
            <option value="andaman">Andaman</option>
            <option value="himachal">Himachal Pradesh</option>
          </select>
        </div>
        <div className="filter-category">
          Date
          <select name="date" onChange={handleFilterChange} value={filters.date}>
            <option value="recent first">Latest First</option>
            <option value="oldest first">Oldest First</option>
          </select>
        </div>
        {/* Reset Button */}
        <button onClick={resetFilters} className="reset-button">Reset Filters</button>
      </div>

      {/* Posts Section */}
      <div className="posts-section">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <Post key={post._id} {...post} />)
        ) : (
          <p className="no-posts-message">No posts found</p>
        )}
      </div>
      <ToastContainer />
    </div>
    </div>
  );
}
