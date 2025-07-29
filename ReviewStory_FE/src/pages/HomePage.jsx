import { useEffect, useState } from 'react';
import Header from '../components/Header';
import PostCard from '../components/PostCard';

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // TODO: Gọi API lấy danh sách bài viết
    const fakePosts = [
      { id: 1, title: 'One Piece Review', content: 'One Piece is amazing...', author: 'Luffy' },
      { id: 2, title: 'Naruto Review', content: 'Naruto teaches about friendship...', author: 'Naruto' },
    ];
    setPosts(fakePosts);
  }, []);

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '600px', margin: '20px auto' }}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
