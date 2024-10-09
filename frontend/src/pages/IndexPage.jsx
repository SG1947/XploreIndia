// import Post from "../components/Post.jsx";
// import { useEffect, useState } from "react";

// export default function IndexPage() {
//   const [posts, setPosts] = useState([]);
//   useEffect(() => {
//     fetch("http://localhost:8000/post").then((response) => {
//       response.json().then((posts) => {
//         setPosts(posts);
//       });
//     });
//   }, []);
//   return (
//     <div className="main-content">
//       <div className="filters">
//         <h3>Filters</h3>
//         <div className="filter-category">
//           Travel Type
//           <select>
//             <option value="solo">Solo</option>
//             <option value="family">Family</option>
//             <option value="friends">Friends</option>
//             <option value="couple">Couple</option>
//             <option value="business">Business</option>
//           </select>
//         </div>
//         <div className="filter-category">
//           Select State
//           <select>
//             <option value="gujarat">Gujarat</option>
//             <option value="west bengal">West Bengal</option>
//             <option value="rajasthan">Rajasthan</option>
//             <option value="kerala">Kerala</option>
//             <option value="andaman">Andaman</option>
//           </select>
//         </div>

//         <div className="filter-category">
//           Date
//           <select>
//             <option value="recent first">Latest First</option>
//             <option value="Oldest First">Oldest First</option>
//           </select>
//         </div>
//       </div>
//       <div>{posts.length > 0 && posts.map((post) => <Post {...post} />)}</div>
      
//     </div>
//   );
// }
import Post from "../components/Post.jsx";
import { useEffect, useState } from "react";
import { useOutletContext } from 'react-router-dom';
const url=import.meta.env.VITE_SERVER_URL;
export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { searchTerm } = useOutletContext(); 
  const [filters, setFilters] = useState({
    travelType: '',
    state: '',
    date: 'recent first',
  });

  // Fetch posts from the API on component mount
  useEffect(() => {
    fetch(`${url}/post`)
      .then((response) => response.json())
      .then((posts) => {
        setPosts(posts);
        setFilteredPosts(posts); // Initially, all posts are displayed
      });
  }, []);

  // Apply filters and search whenever filters or posts change
  useEffect(() => {
    let updatedPosts = [...posts];

    // Filter by travel type
    if (filters.travelType) {
      updatedPosts = updatedPosts.filter(post => post.travelType === filters.travelType);
    }

    // Filter by state
    if (filters.state) {
      updatedPosts = updatedPosts.filter(post => 
        post.state.toLowerCase() === filters.state.toLowerCase()
      );
    }

    // Search by destination
    if (searchTerm) {
      updatedPosts = updatedPosts.filter(post =>
        post.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date
    if (filters.date === 'recent first') {
      updatedPosts.sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate)); // Latest first
    } else if (filters.date === 'oldest first') {
      updatedPosts.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate)); // Oldest first
    }

    setFilteredPosts(updatedPosts);
  }, [filters, posts, searchTerm]); // Added searchTerm to dependencies

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="main-content">
      <div className="filters">
        <h3>Filters</h3>
        <div className="filter-category">
          Travel Type
          <select name="travelType" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="solo">Solo</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="couple">Couple</option>
            <option value="business">Business</option>
          </select>
        </div>
        <div className="filter-category">
          Select State
          <select name="state" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="gujarat">Gujarat</option>
            <option value="west bengal">West Bengal</option>
            <option value="rajasthan">Rajasthan</option>
            <option value="kerala">Kerala</option>
            <option value="andaman">Andaman</option>
          </select>
        </div>
        <div className="filter-category">
          Date
          <select name="date" onChange={handleFilterChange}>
            <option value="recent first">Latest First</option>
            <option value="oldest first">Oldest First</option>
          </select>
        </div>
      </div>
      <div>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <Post key={post._id} {...post} />)
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
}
