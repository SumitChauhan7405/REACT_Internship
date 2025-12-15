import "../Homepage/HomePage.css";

const HomePage = () => {
  return (
    <div className="home-wrapper">
      <div className="home-card">
        <h1>Welcome </h1>
        <p>
          This is my <span>first project</span> for data fetching from API.
        </p>
        <p>
          I am using <strong>React</strong>, <strong>Axios</strong> and
          <strong> React Router</strong> to fetch and display fake API data
          provided by JSONPlaceholder.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
