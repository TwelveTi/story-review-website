import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { apiFetch, apiPost } from '../utils/api';
import avatarImage from '../public/download.png';

const socket = io('http://localhost:5000');

export default function CommentPopup({ post, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const roomId = `review_comment_${post.id}`;
    socket.emit('join_review_comment', post.id);

    fetchComments();

    socket.on('receive_comment', (comment) => {
      setComments((prev) => [...prev, comment]);
    });

    return () => {
      socket.emit('leave_review_comment', post.id);
      socket.off('receive_comment');
    };
  }, [post.id]);

  const fetchComments = async () => {
    const res = await apiFetch(`/comments/${post.id}`);
    if (res.status === 200) {
      setComments(res.data);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    const res = await apiPost('/comments', { content: newComment, reviewId: post.id });
    if (res.status === 200) {
      setNewComment(''); // Clear input
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
      <div style={{ width: '600px', background: 'white', borderRadius: '10px', padding: '20px', maxHeight: '80%', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ float: 'right', fontSize: '20px', cursor: 'pointer' }}>X</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={avatarImage} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <h2>{post.User.username}'s Post</h2>
        </div>
        <p>{post.content}</p>

        {post.Images && post.Images.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {post.Images.map((img, index) => (
              <img
                key={index}
                src={img.imageUrl}
                alt={`post-img-${index}`}
                style={{
                  width: '250px',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            ))}
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <h3>Comments</h3>
          {comments.map((comment) => (
            <div key={comment.id} style={{ padding: '10px 0', borderBottom: '1px solid #ccc' }}>
              <strong>{comment.User.username}</strong>: {comment.content}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button
            onClick={handleSubmit}
            style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#4267B2', color: 'white', cursor: 'pointer' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
