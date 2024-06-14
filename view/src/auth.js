import Cookies from "js-cookie";

export const isLoggedIn = () => {
  return Cookies.get("Session") ? true : false;
};

export const updateLoggedInStatus = (app) => {
  const sessionCookie = Cookies.get("Session");
  if (sessionCookie) {
    try {
      const sessionData = JSON.parse(sessionCookie);
      app.isLoggedIn = true; // Update data in the Vue instance
      // You can also access user data from sessionData (e.g., userId, email)
    } catch (error) {
      console.error("Error parsing cookie:", error);
    }
  } else {
    app.isLoggedIn = false;
  }
};
