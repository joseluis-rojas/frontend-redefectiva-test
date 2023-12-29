import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ITEMS_PER_PAGE = 10;

const App = () => {
  const [posts, setPosts] = useState([]);
  const [filterUserId, setFilterUserId] = useState('');
  const [filterText, setFilterText] = useState('');
  const [originalPosts, setOriginalPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        setPosts(response.data);
        setOriginalPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleSortByTitle = () => {
    const sortedPosts = [...posts].sort((a, b) => a.title.localeCompare(b.title));
    setPosts(sortedPosts);
  };

  const handleFilterUserId = (event) => {
    setFilterUserId(event.target.value);
  };

  const handleFilterText = (event) => {
    setFilterText(event.target.value);
  };

  const handleResetFilters = () => {
    setFilterUserId('');
    setFilterText('');
    setPosts(originalPosts);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    if (filterUserId !== '' || filterText !== '') {
      let filteredPosts = [...originalPosts];

      if (filterUserId) {
        filteredPosts = filteredPosts.filter((post) => post.userId.toString() === filterUserId);
      }

      if (filterText) {
        filteredPosts = filteredPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(filterText.toLowerCase()) ||
            post.body.toLowerCase().includes(filterText.toLowerCase())
        );
      }

      setPosts(filteredPosts);
      setCurrentPage(1);
    } else {
      alert('Ingrese al menos un valor en los filtros.');
    }
  };

  const indexOfLastPost = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - ITEMS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-3">
      <h2 className="text-center">Registros de API</h2>
      <div className="d-flex justify-content-between mb-3">
        <div className="flex-grow-1 mr-2">
          <label htmlFor="filterUserId">Ingrese User ID para filtro:</label>
          <input
            id="filterUserId"
            type="number"
            className="form-control"
            value={filterUserId}
            onChange={handleFilterUserId}
          />
        </div>
        <div className="flex-grow-1 mr-2">
          <label htmlFor="filterText">Ingrese Texto para filtro:</label>
          <input
            id="filterText"
            type="text"
            className="form-control"
            value={filterText}
            onChange={handleFilterText}
          />
        </div>
        <div className="mb-2">
          <button className="btn btn-primary mr-2" onClick={handleApplyFilters}>
            Aplicar Filtros
          </button>
          <button className="btn btn-secondary mr-2" onClick={handleSortByTitle}>
            Ordenar por Título
          </button>
          <button className="btn btn-warning" onClick={handleResetFilters}>
            Limpiar Filtros
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post.id}>
              <td>{post.userId}</td>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.body}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav className="d-flex justify-content-center">
        <ul className="pagination">
          {Array.from({ length: Math.ceil(posts.length / ITEMS_PER_PAGE) }).map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default App;
