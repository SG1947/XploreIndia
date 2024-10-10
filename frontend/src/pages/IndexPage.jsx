
import Post from "../components/Post.jsx";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
const url = import.meta.env.VITE_SERVER_URL;
// export default function IndexPage() {
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const { searchTerm } = useOutletContext();
//   const [filters, setFilters] = useState({
//     travelType: "",
//     state: "",
//     date: "recent first",
//   });

//   // Fetch posts from the API on component mount
//   useEffect(() => {
//     fetch(`${url}/post`)
//       .then((response) => response.json())
//       .then((posts) => {
//         setPosts(posts);
//         setFilteredPosts(posts);
//       });
//   }, []);

//   useEffect(() => {
//     let updatedPosts = [...posts];

//     if (filters.travelType) {
//       updatedPosts = updatedPosts.filter(
//         (post) => post.travelType === filters.travelType
//       );
//     }

//     if (filters.state) {
//       updatedPosts = updatedPosts.filter(
//         (post) => post.state.toLowerCase() === filters.state.toLowerCase()
//       );
//     }

//     if (searchTerm) {
//       updatedPosts = updatedPosts.filter((post) =>
//         post.destination.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filters.date === "recent first") {
//       updatedPosts.sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate)); // Latest first
//     } else if (filters.date === "oldest first") {
//       updatedPosts.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate)); // Oldest first
//     }

//     setFilteredPosts(updatedPosts);
//   }, [filters, posts, searchTerm]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

//   return (
//     <div className="main-content">
//       <div className="filters">
//         <h3>Search by Filters</h3>
//         <div className="filter-category">
//           Travel Type
//           <select name="travelType" onChange={handleFilterChange}>
//             <option value="">All</option>
//             <option value="solo">Solo</option>
//             <option value="family">Family</option>
//             <option value="friends">Friends</option>
//             <option value="business">Business</option>
//           </select>
//         </div>
//         <div className="filter-category">
//           Select State
//           <select name="state" onChange={handleFilterChange}>
//             <option value="">All</option>
//             <option value="gujarat">Gujarat</option>
//             <option value="west bengal">West Bengal</option>
//             <option value="rajasthan">Rajasthan</option>
//             <option value="kerala">Kerala</option>
//             <option value="andaman">Andaman</option>
//             <option value="himachal">Himachal Pradesh</option>
//           </select>
//         </div>
//         <div className="filter-category">
//           Date
//           <select name="date" onChange={handleFilterChange}>
//             <option value="recent first">Latest First</option>
//             <option value="oldest first">Oldest First</option>
//           </select>
//         </div>
//       </div>
//       <div>
//         {filteredPosts.length > 0 ? (
//           filteredPosts.map((post) => <Post key={post._id} {...post} />)
//         ) : (
//           <>{posts.length > 0 && posts.map((post) => <Post {...post} />)}
//           </>
//         )}
//       </div>
//     </div>
    
//   );
// }
export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const { setSearchTerm,searchTerm } = useOutletContext();
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
        post.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.date === "recent first") {
      updatedPosts.sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate)); // Latest first
    } else if (filters.date === "oldest first") {
      updatedPosts.sort((a, b) => new Date(a.fromDate) - new Date(b.fromDate)); // Oldest first
    }

    setFilteredPosts(updatedPosts);
  }, [filters, posts, searchTerm]);

  useEffect(() => {
    // Show toast and reset filters if no posts matched
    if (filteredPosts.length === 0 && posts.length > 0) {
      toast.info('No matching posts found! Showing all posts.', {
        position: "top-center",
      });
      resetFilters(); // Call to reset filters
      setFilteredPosts(posts); // Show all posts
    }
  }, [filteredPosts, posts]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      travelType: "",
      state: "",
      date: "recent first",
    });
    setSearchTerm('');
  };

  return (
    <div className="main-content">
      <div className="filters">
        <h3>Search by Filters</h3>
        <div className="filter-category">
          Travel Type
          <select name="travelType" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="solo">Solo</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
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
            <option value="himachal">Himachal Pradesh</option>
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
          posts.length > 0 && posts.map((post) => <Post key={post._id} {...post} />)
        )}
      </div>
      <ToastContainer />
    </div>
  );
}