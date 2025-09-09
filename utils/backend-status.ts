export interface BackendStatus {
  isAvailable: boolean;
  url: string;
  message: string;
}

export async function checkBackendStatus(): Promise<BackendStatus> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8086';
  
  try {
    const response = await fetch(`${baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        usernameOrEmail: '',
        password: ''
      })
    });
    
    // If we get any response (even error), the backend is running
    return {
      isAvailable: true,
      url: baseUrl,
      message: 'Backend is running',
    };
  } catch (error) {
    console.error('Backend check failed:', error);
    return {
      isAvailable: false,
      url: baseUrl,
      message: 'Backend is not available. Please make sure the Spring Boot application is running.',
    };
  }
}
