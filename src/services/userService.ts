// User API service for handling user-related API calls

const BACKEND_URL = 'http://127.0.0.1:8000';

export interface UserData {
  id: number;
  name: string;
  email: string;
  username: string;
  created_at: string;
}

export interface CourseDetails {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
}

export interface EnrolledCourse {
  enrollment_id: number;
  enrolled_at: string;
  course: CourseDetails;
}

export interface UserDashboardData {
  user: UserData;
  enrolledCourses: EnrolledCourse[];
}

export const userService = {
  // Get user data and enrolled courses
  async fetchUserDashboardData(): Promise<UserDashboardData> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Fetch user data
    const userResponse = await fetch(`${BACKEND_URL}/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();

    // Fetch enrolled courses
    const coursesResponse = await fetch(`${BACKEND_URL}/api/user/courses`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!coursesResponse.ok) {
      throw new Error('Failed to fetch enrolled courses');
    }

    const coursesData = await coursesResponse.json();

    return {
      user: userData,
      enrolledCourses: coursesData,
    };
  },

  // Update user profile
  async updateProfile(field: string, value: string): Promise<UserData> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        [field]: value,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update ${field}`);
    }

    return (await response.json()).user;
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Call logout API
        await fetch(`${BACKEND_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } finally {
      // Clear auth data regardless of API success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};

// Helper function for displaying course images
export const getFullImageUrl = (imageUrl: string | null) => {
  if (!imageUrl) {
    return '/placeholder.svg';
  }
  // Check if the URL is already absolute
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // Otherwise, prepend the backend URL
  return `${BACKEND_URL}${imageUrl}`;
};

// Helper function for formatting dates
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}; 