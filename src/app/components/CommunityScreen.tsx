import { useState, useEffect, useCallback } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Plus, Star, HelpCircle, Megaphone, RefreshCw, MoreHorizontal, Users, Send, X, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createPost, getPosts, type PostDocument } from "../../services/communityService";

const postTypes = [
  { type: "All", icon: RefreshCw, emoji: "✨" },
  { type: "Review", icon: Star, emoji: "⭐" },
  { type: "Recommendation", icon: Megaphone, emoji: "📢" },
  { type: "Question", icon: HelpCircle, emoji: "❓" },
];

const typeStyle: Record<string, { bg: string; text: string; emoji: string }> = {
  Review: { bg: "rgba(255,214,10,0.12)", text: "#ffd60a", emoji: "⭐" },
  Recommendation: { bg: "rgba(6,214,160,0.12)", text: "#06d6a0", emoji: "📢" },
  Question: { bg: "rgba(76,201,240,0.12)", text: "#4cc9f0", emoji: "❓" },
  Update: { bg: "rgba(192,38,211,0.12)", text: "#c026d3", emoji: "📣" },
};

const trending = ["☕ Brew & Bean", "🍛 Metro Mall Food Court", "📚 End-sem study spots", "🌿 Green Valley Park"];

// Helper to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Helper to format relative time
function formatRelativeTime(timestamp: any): string {
  if (!timestamp) return "Just now";
  const now = new Date();
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Gradient map for avatars
const avatarGradients: Record<string, string> = {
  Review: "from-[#f72585] to-[#c026d3]",
  Recommendation: "from-[#06d6a0] to-[#4cc9f0]",
  Question: "from-[#4361ee] to-[#4cc9f0]",
  Update: "from-[#7209b7] to-[#c026d3]",
};

function Post({ post }: { post: PostDocument }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likesCount);
  const [bookmarked, setBookmarked] = useState(false);
  const ts = typeStyle[post.category] || typeStyle.Update;
  const avatarGrad = avatarGradients[post.category] || "from-[#f72585] to-[#c026d3]";
  const avatarText = post.profileImage || getInitials(post.authorName);

  return (
    <div className="rounded-2xl overflow-hidden hover:scale-[1.005] transition-all" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-3 p-4 pb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs text-white flex-shrink-0 bg-gradient-to-br ${avatarGrad}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          {avatarText}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-white" style={{ fontWeight: 700 }}>{post.authorName}</p>
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: ts.bg, color: ts.text, fontWeight: 700 }}>{ts.emoji} {post.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-xs" style={{ color: '#8888aa' }}>{formatRelativeTime(post.createdAt)}</p>
            {post.course && <><span className="text-xs" style={{ color: '#8888aa' }}>·</span><p className="text-xs" style={{ color: '#8888aa' }}>{post.course} · {post.year}</p></>}
          </div>
        </div>
        <button><MoreHorizontal size={15} style={{ color: '#8888aa' }} /></button>
      </div>
      <div className="px-4 pb-3">
        <p className="text-sm text-white/80 leading-relaxed">{post.content}</p>
      </div>
      {post.imageUrl && <img src={post.imageUrl} alt="" className="w-full h-36 object-cover" />}
      <div className="flex items-center gap-1 px-3 py-2">
        <button onClick={() => { setLiked(p => !p); setLikes(p => liked ? p - 1 : p + 1); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all"
          style={liked ? { background: 'rgba(247,37,133,0.15)', color: '#f72585', fontWeight: 700 } : { color: '#8888aa' }}>
          <Heart size={13} className={liked ? "fill-[#f72585]" : ""} />{likes}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs" style={{ color: '#8888aa' }}>
          <MessageCircle size={13} />{post.commentsCount}
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs" style={{ color: '#8888aa' }}>
          <Share2 size={13} />Share
        </button>
        <button onClick={() => setBookmarked(b => !b)} className="ml-auto px-3 py-1.5 rounded-xl"
          style={bookmarked ? { color: '#c026d3' } : { color: '#8888aa' }}>
          <Bookmark size={13} className={bookmarked ? "fill-[#c026d3]" : ""} />
        </button>
      </div>
    </div>
  );
}

export function CommunityScreen() {
  const { currentUser } = useAuth();
  const [activeType, setActiveType] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("Review");
  const [posts, setPosts] = useState<PostDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load posts from Firestore
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
      setError(null);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // Handle post creation
  const handleCreatePost = async () => {
    if (!currentUser) {
      setError("You must be logged in to post");
      return;
    }

    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    if (!postType) {
      setError("Please select a category");
      return;
    }

    try {
      setPosting(true);
      setError(null);

      await createPost({
        authorId: currentUser.uid,
        authorName: currentUser.name,
        course: currentUser.course,
        year: currentUser.year,
        profileImage: (currentUser as any).profileImage,
        category: postType,
        content: content.trim(),
      });

      // Success - close modal, clear form, refresh feed
      setShowCreate(false);
      setContent("");
      setPostType("Review");
      setSuccess("Post created successfully!");
      setTimeout(() => setSuccess(null), 3000);

      // Refresh posts
      await loadPosts();
    } catch (err) {
      console.error("Failed to create post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  const filtered = activeType === "All" ? posts : posts.filter(p => p.category === activeType);

  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: '#0d0d1a' }}>
      {/* Success Toast */}
      {success && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl flex items-center gap-2 text-white"
          style={{ background: 'linear-gradient(135deg, #06d6a0, #4cc9f0)', boxShadow: '0 4px 20px rgba(6,214,160,0.3)' }}>
          <span>✅</span>
          <span style={{ fontWeight: 600 }}>{success}</span>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl flex items-center gap-2 text-white"
          style={{ background: 'linear-gradient(135deg, #f72585, #ff6b35)', boxShadow: '0 4px 20px rgba(247,37,133,0.3)' }}>
          <AlertCircle size={14} />
          <span style={{ fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-6" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(247,37,133,0.15)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>Create Post ✨</h2>
              <button onClick={() => { setShowCreate(false); setError(null); }} className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <X size={14} className="text-white" />
              </button>
            </div>
            {/* User info display */}
            {currentUser && (
              <div className="flex items-center gap-2 mb-4 p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white bg-gradient-to-br from-[#f72585] to-[#c026d3]`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  {getInitials(currentUser.name)}
                </div>
                <div>
                  <p className="text-sm text-white" style={{ fontWeight: 600 }}>{currentUser.name}</p>
                  <p className="text-xs" style={{ color: '#8888aa' }}>{currentUser.course} · {currentUser.year}</p>
                </div>
              </div>
            )}
            <div className="flex gap-2 mb-4">
              {["Review", "Recommendation", "Question", "Update"].map(t => {
                const ts = typeStyle[t] || typeStyle.Update;
                return (
                  <button key={t} onClick={() => setPostType(t)}
                    className="px-3 py-1.5 rounded-xl text-sm transition-all"
                    style={postType === t ? { background: ts.bg, color: ts.text, fontWeight: 700, border: `1px solid ${ts.text}30` } : { background: 'rgba(255,255,255,0.05)', color: '#8888aa' }}>
                    {ts.emoji} {t}
                  </button>
                );
              })}
            </div>
            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="Share your experience, recommendation, or ask something..."
              className="w-full rounded-xl p-3 text-sm text-white outline-none resize-none h-28"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            <button
              onClick={handleCreatePost}
              disabled={!content.trim() || !postType || posting}
              className="mt-4 w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-white disabled:opacity-40 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
              {posting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={14} />Post It!
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: '#f0f0ff' }}>Community Feed 💬</h2>
            <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #f72585, #7209b7)', fontFamily: 'var(--font-display)', fontWeight: 800, boxShadow: '0 4px 15px rgba(247,37,133,0.3)' }}>
              <Plus size={14} />New Post
            </button>
          </div>
          <div className="flex gap-2 mb-4">
            {postTypes.map(pt => (
              <button key={pt.type} onClick={() => setActiveType(pt.type)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm transition-all"
                style={activeType === pt.type ? { background: 'linear-gradient(135deg, #f72585, #7209b7)', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700 } : { background: 'rgba(255,255,255,0.06)', color: '#8888aa' }}>
                {pt.emoji} {pt.type}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-[#f72585]" />
              <span className="ml-2 text-white/60">Loading posts...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#8888aa' }}>
              <p className="text-lg mb-2">No posts yet</p>
              <p className="text-sm">Be the first to share something! 🎉</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(post => <Post key={post.id} post={post} />)}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #1a0530, #0d0d1a)', border: '1px solid rgba(247,37,133,0.2)', boxShadow: '0 4px 20px rgba(247,37,133,0.1)' }}>
            <p className="text-white text-sm mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Community Stats 🔥</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Students", value: "2,847", grad: "from-[#f72585] to-[#c026d3]", icon: Users },
                { label: "Posts Today", value: "156", grad: "from-[#06d6a0] to-[#4cc9f0]", icon: MessageCircle },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${s.grad} mb-2`}>
                    <s.icon size={13} className="text-white" />
                  </div>
                  <p className="text-white leading-none" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18 }}>{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8888aa' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} style={{ color: '#f72585' }} />
              <p className="text-sm text-white" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Trending</p>
            </div>
            {trending.map((t, i) => (
              <div key={t} className="flex items-center gap-2 py-2" style={i < trending.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.05)' } : {}}>
                <span className="text-xs w-4" style={{ color: '#8888aa', fontWeight: 800 }}>#{i + 1}</span>
                <p className="text-sm text-white" style={{ fontWeight: 500 }}>{t}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-4" style={{ background: '#16162a', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm text-white mb-3" style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>Active Now 🟢</p>
            {[
              { name: "Priya Mehta", status: "Posted a review", grad: "from-[#f72585] to-[#c026d3]", av: "PM" },
              { name: "Aisha Khan", status: "Recommended a place", grad: "from-[#06d6a0] to-[#4cc9f0]", av: "AK" },
              { name: "Rohan Verma", status: "Asked a question", grad: "from-[#4361ee] to-[#4cc9f0]", av: "RV" },
            ].map(u => (
              <div key={u.name} className="flex items-center gap-2.5 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="relative">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] text-white bg-gradient-to-br ${u.grad}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{u.av}</div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#06d6a0]" style={{ border: '1px solid #0d0d1a' }} />
                </div>
                <div>
                  <p className="text-xs text-white" style={{ fontWeight: 600 }}>{u.name}</p>
                  <p className="text-[10px]" style={{ color: '#8888aa' }}>{u.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
