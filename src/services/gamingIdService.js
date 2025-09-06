import axios from "axios";

const BASE_URL = "https://api.zorotopup.com";

/**
 * Fetch all gaming IDs from the API
 * @returns {Promise<Object>} Response containing gaming IDs and pagination info
 */
export const fetchGamingIds = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/gaming-id`);
    return response.data;
  } catch (error) {
    console.error("Error fetching gaming IDs:", error);
    throw error;
  }
};

/**
 * Fetch gaming IDs with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise<Object>} Response containing gaming IDs and pagination info
 */
export const fetchGamingIdsWithPagination = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/gaming-id`, {
      params: {
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching gaming IDs with pagination:", error);
    throw error;
  }
};

/**
 * Fetch gaming IDs filtered by game type
 * @param {string} gameType - Game type to filter by
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Items per page (default: 10)
 * @returns {Promise<Object>} Response containing filtered gaming IDs and pagination info
 */
export const fetchGamingIdsByGame = async (gameType, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/gaming-id`, {
      params: {
        game: gameType,
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching gaming IDs by game:", error);
    throw error;
  }
};
