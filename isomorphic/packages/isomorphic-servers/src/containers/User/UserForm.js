import React, { useState, useEffect } from 'react';

const MyComponent = (props) => {
  // State variables
  const [count, setCount] = useState(0);

  // Effect hook
  useEffect(() => {
    // Code to run on component mount and when count changes
    console.log('Component mounted or count changed');
    // Clean-up function (optional)
    return () => {
      console.log('Component unmounted');
    };
  }, [count]);

  // Event handler
  const handleClick = () => {
    props.setIsModalOpen(false);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};

export default MyComponent;