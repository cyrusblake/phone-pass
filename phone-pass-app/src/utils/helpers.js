// Format a timestamp to a readable date string
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust format as needed
  };
  
  // Validate an email address
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Debounce a function to limit how often it can be called
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };
  
  // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substr(2, 9); // Simple unique ID
  };
  
  export { formatDate, validateEmail, debounce, generateId };