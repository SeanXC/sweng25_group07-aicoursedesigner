
// This function will fetch the user's profile data from the backend
export const fetchUserData = async (email) => {
    const apiUrl = `https://3smlhrocb8.execute-api.eu-west-1.amazonaws.com/StageTwo?email=${email}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (response.ok) {
        return data;  // Return the fetched user data (including avatar)
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
  };
  