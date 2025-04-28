const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface UploadResult {
  url: string;
  id: string;
}

export class UploadService {
  private static validateFile(file: File): string | null {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return '只支持 JPG、PNG 和 WebP 格式的图片';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return '图片大小不能超过 5MB';
    }
    
    return null;
  }

  private static async uploadToServer(file: File): Promise<UploadResult> {
    // 这里应该实现实际的文件上传逻辑
    // 例如使用 FormData 和 fetch API 上传到服务器
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      return {
        url: data.url,
        id: data.id,
      };
    } catch (error) {
      console.error('上传错误:', error);
      throw new Error('上传失败，请重试');
    }
  }

  public static async uploadFile(file: File): Promise<UploadResult> {
    const error = this.validateFile(file);
    if (error) {
      throw new Error(error);
    }

    return this.uploadToServer(file);
  }
} 