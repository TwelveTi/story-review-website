import { useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import Header from '../components/Header';
import { PostCard } from '../components/PostCard';
import CreateReviewModal from '../components/CreateReviewModal';
import CommentPopup from '../components/CommentPopup';
import { apiFetch } from '../utils/api';
import avatarImage from '../public/download.png';

const socket = io('http://localhost:5000');

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [newPostAvailable, setNewPostAvailable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openPost, setOpenPost] = useState(null);  // << State mở CommentPopup
  const observer = useRef();
  const currentUser = parseInt(localStorage.getItem('userId'));

  // JOIN room "home" khi load page
  useEffect(() => {
    socket.emit('join_room', 'home_room');
    return () => {
      socket.emit('leave_room', 'home_room');
    };
  }, []);

  // Lắng nghe new post realtime
  useEffect(() => {
    socket.on('new-review', () => {
      setNewPostAvailable(true);
    });
    return () => {
      socket.off('new-review');
    };
  }, []);

  const loadPosts = useCallback(async () => {
    try {
      const data = await apiFetch(`/reviews?offset=${offset}&limit=10`);
      if (!data || data.status !== 200 || !Array.isArray(data.data.reviews)) {
        console.error('Invalid data format or unauthorized');
        if (data && data.status === 401) window.location.href = '/login';
        return;
      }
      if (data.data.reviews.length < 10) setHasMore(false);
      setPosts(prev => {
        const newPosts = data.data.reviews.filter(post => !prev.some(p => p.id === post.id));
        return [...prev, ...newPosts];
      });
      setOffset(prev => prev + data.data.reviews.length);
    } catch (err) {
      console.error('Failed to load posts:', err.message);
    }
  }, [offset]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const lastPostRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadPosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore, loadPosts]);

  const handleRefresh = () => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    setNewPostAvailable(false);
    loadPosts();
  };

  const handleDelete = (id) => console.log('Delete post', id);
  const handleReport = (id) => console.log('Report post', id);

  const handleOpenCommentPopup = (post) => {
    setOpenPost(post);
  };

  return (
    <div style={{ background: '#f0f2f5', minHeight: '100vh' }}>
      <Header />
      {newPostAvailable && (
        <div style={{ position: 'fixed', top: '70px', width: '100%', textAlign: 'center', zIndex: 1000 }}>
          <button onClick={handleRefresh} style={{ padding: '10px 20px', background: '#4267B2', color: 'white', borderRadius: '20px', cursor: 'pointer' }}>
            Bài viết mới - Bấm để tải lại
          </button>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '80px' }}>
        <div style={{ width: '70%', marginRight: '20px' }}>
          <div
            style={{
              background: 'white',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#65676B',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onClick={() => setIsModalOpen(true)}
          >
            <img src={avatarImage} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            Viết Review bài viết...
          </div>
          {posts.map((post, index) => {
            if (posts.length === index + 1) {
              return (
                <div ref={lastPostRef} key={post.id}>
                  <PostCard post={post} currentUser={currentUser} onDelete={handleDelete} onReport={handleReport} onOpenDetail={handleOpenCommentPopup} />
                </div>
              );
            } else {
              return <PostCard key={post.id} post={post} currentUser={currentUser} onDelete={handleDelete} onReport={handleReport} onOpenDetail={handleOpenCommentPopup} />;
            }
          })}
        </div>
        <div style={{ width: '20%', background: 'white', borderRadius: '10px', height: '500px' }}>
          <div style={{ padding: '10px', fontWeight: 'bold' }}>Bạn bè</div>
          <div style={{ padding: '10px', color: '#999' }}>(Chưa có dữ liệu)</div>
        </div>
      </div>
      {isModalOpen && <CreateReviewModal onClose={() => setIsModalOpen(false)} />}
      {openPost && <CommentPopup post={openPost} onClose={() => setOpenPost(null)} />} {/* Popup chi tiết bài viết */}
    </div>
  );
}
