import avatarImage from '../public/download.png';

export function PostCard({ post, currentUser, onDelete, onReport, onOpenDetail }) {
  const isOwner = post.userId === currentUser;

  return (
    <div style={{
      background: 'white',
      borderRadius: '10px',
      padding: '10px',
      marginBottom: '20px',  // Tăng khoảng cách bài viết
      maxWidth: '650px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={avatarImage}
            alt="avatar"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div style={{ fontWeight: 'bold' }}>{post.User.username}</div>
        </div>
        <button onClick={() => (isOwner ? onDelete(post.id) : onReport(post.id))}>
          {isOwner ? 'Delete' : 'Report'}
        </button>
      </div>

      <div style={{ marginTop: '10px' }}>{post.content}</div>

      {post.Images && post.Images.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '10px'
        }}>
          {post.Images.map((img, index) => (
            <img
              key={index}
              src={img.imageUrl}
              alt={`post-img-${index}`}
              style={{
                width: '250px',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => onOpenDetail(post)}
            />
          ))}
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => onOpenDetail(post)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            backgroundColor: '#e4e6eb',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Comments
        </button>
      </div>
    </div>
  );
}
