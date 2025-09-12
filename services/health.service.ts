import { apiClient } from '@/lib/api-client';

export class HealthService {
  /**
   * Check if backend is available
   */
  static async checkHealth(): Promise<boolean> {
    try {
      // Try to access any public endpoint to check if backend is available
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8086'}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // This will fail but tells us if backend is up
      });
      return true;
    } catch (error) {
      // If we get a network error, backend is down
      // If we get a 400/401/etc, backend is up but request failed (which is expected)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return false;
      }
      return true;
    }
  }

}

export default HealthService;
