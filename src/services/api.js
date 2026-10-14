import axiosClient from '../api/axiosClient.js';

export async function checkBackendHealth() {
  try {
    const res = await axiosClient.get('/health', { baseURL: 'http://localhost:5000' });
    return { online: true, ...res.data };
  } catch (err) {
    return { online: false, error: err.message };
  }
}

export async function fetchListings() {
  try {
    const res = await axiosClient.get('/listings');
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      return { success: true, data: res.data.data };
    }
    return { success: false, data: [] };
  } catch (err) {
    return { success: false, error: err.message, data: [] };
  }
}

export async function createListing(listingData) {
  try {
    const res = await axiosClient.post('/listings', listingData);
    return res.data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

export async function updateListing(id, listingData) {
  try {
    const res = await axiosClient.put(`/listings/${id}`, listingData);
    return res.data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

export async function deleteListing(id) {
  try {
    const res = await axiosClient.delete(`/listings/${id}`);
    return res.data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

export async function registerUser(userData) {
  try {
    const res = await axiosClient.post('/auth/register', userData);
    return res.data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

export async function loginUser(credentials) {
  try {
    const res = await axiosClient.post('/auth/login', credentials);
    return res.data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

export async function fetchUsers() {
  try {
    const res = await axiosClient.get('/users');
    return res.data;
  } catch (err) {
    return { success: false, error: err.message, data: [] };
  }
}

export async function updateUserStatus(userId, status) {
  try {
    const res = await axiosClient.put(`/users/${userId}/status`, { status });
    return res.data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

export async function fetchBookings() {
  try {
    const res = await axiosClient.get('/bookings');
    return res.data;
  } catch (err) {
    return { success: false, error: err.message, data: [] };
  }
}

export async function createBooking(bookingData) {
  try {
    const res = await axiosClient.post('/bookings', bookingData);
    return res.data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

export async function updateBookingStatus(bookingId, bookingStatus) {
  try {
    const res = await axiosClient.put(`/bookings/${bookingId}/status`, { bookingStatus });
    return res.data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || err.message };
  }
}

export async function fetchHotelReviews(hotelId) {
  try {
    const res = await axiosClient.get(`/reviews/${hotelId}`);
    return res.data;
  } catch (err) {
    return { success: false, error: err.message, latestReviews: [], overallScore: 0 };
  }
}

export async function createReview(reviewData) {
  try {
    const res = await axiosClient.post('/reviews', reviewData);
    return res.data;
  } catch (err) {
    return { success: false, error: err.response?.data?.error || err.message };
  }
}
