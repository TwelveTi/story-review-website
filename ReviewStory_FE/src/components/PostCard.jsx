export default function PostCard({ post }) {
  return (
    <div style={{ background: 'white', padding: '15px', marginBottom: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <p style={{ color: 'gray', fontSize: '14px' }}>Author: {post.author}</p>
    </div>
  );
}
