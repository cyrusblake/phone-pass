async function fetchFromBackend() {
  try {
    const response = await fetch('https://fastapi-example-ly1n.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: "value" })
    });
    return await response.json();
  } catch (error) {
    console.error("Backend call failed:", error);
  }
}

// Example React component
function TestConnection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('https://fastapi-example-ly1n.onrender.com')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{data?.message || "Loading..."}</div>;
}