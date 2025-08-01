import { useState } from 'react';
import avatarImage from '../public/download.png';
export default function CreateReviewModal({ onClose }) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('content', content);
    images.forEach((img) => formData.append('images', img)); // Key phải khớp với Multer 'images'

    const token = localStorage.getItem('accessToken');

    try {
      const res = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // KHÔNG được set 'Content-Type' ở đây, fetch sẽ tự set multipart/form-data boundary.
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success') {
          alert('Tạo bài viết thành công!');
          setContent('');
          setImages([]);
          onClose();
          window.location.reload();
        } else {
          alert(data.message || 'Tạo bài viết thất bại!');
        }
      } else {
        const errorText = await res.text();
        console.error('Server error:', errorText);
        alert('Lỗi server khi đăng bài!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi đăng bài!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 2000
    }}>
      <div style={{ width: '500px', background: 'white', borderRadius: '10px', padding: '20px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '20px', cursor: 'pointer' }}>×</button>
        <h2 style={{ marginBottom: '20px' }}>Tạo bài viết</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Nhập nội dung review..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '10px', border: '1px solid #ccc', marginBottom: '20px' }}
            required
          />
          <input type="file" multiple onChange={handleImageChange} style={{ marginBottom: '20px' }} />
          <button
            type="submit"
            style={{
              padding: '10px 20px', background: loading ? '#999' : '#4267B2',
              color: 'white', borderRadius: '20px', cursor: loading ? 'not-allowed' : 'pointer'
            }}
            disabled={loading}
          >
            {loading ? 'Đang đăng...' : 'Đăng bài'}
          </button>
        </form>
      </div>
    </div>
  );
}
