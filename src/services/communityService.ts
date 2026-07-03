import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
  increment,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

// ============ Types ============

export type PostCreateData = {
  authorId: string;
  authorName: string;
  course: string;
  year: string;
  profileImage?: string;
  category: string;
  content: string;
  imageUrl?: string;
};

export type PostDocument = {
  id: string;
  authorId: string;
  authorName: string;
  course: string;
  year: string;
  profileImage?: string;
  category: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  likedBy: string[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
};

export type CommentCreateData = {
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
};

export type CommentDocument = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Timestamp | null;
};

// ============ Post Functions ============

export async function createPost(data: PostCreateData): Promise<string> {
  const postsRef = collection(db, "posts");
  const now = serverTimestamp();

  // Build clean object, omitting any undefined fields entirely
  const cleanData: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleanData[key] = value;
    }
  }

  const docRef = await addDoc(postsRef, {
    ...cleanData,
    likesCount: 0,
    commentsCount: 0,
    likedBy: [],
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}

export async function getPosts(limitCount: number = 50): Promise<PostDocument[]> {
  const postsRef = collection(db, "posts");
  const postsQuery = query(
    postsRef,
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      authorId: data.authorId as string,
      authorName: data.authorName as string,
      course: data.course as string,
      year: data.year as string,
      profileImage: data.profileImage as string | undefined,
      category: data.category as string,
      content: data.content as string,
      imageUrl: data.imageUrl as string | undefined,
      likesCount: data.likesCount as number,
      commentsCount: data.commentsCount as number,
      likedBy: (data.likedBy as string[]) || [],
      createdAt: (data.createdAt as Timestamp) || null,
      updatedAt: (data.updatedAt as Timestamp) || null,
    };
  });
}

export async function getPostsByUser(userId: string, limitCount: number = 50): Promise<PostDocument[]> {
  const postsRef = collection(db, "posts");
  const postsQuery = query(
    postsRef,
    where("authorId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(postsQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      authorId: data.authorId as string,
      authorName: data.authorName as string,
      content: data.content as string,
      imageUrl: data.imageUrl as string | undefined,
      likesCount: data.likesCount as number,
      commentsCount: data.commentsCount as number,
      likedBy: (data.likedBy as string[]) || [],
      createdAt: (data.createdAt as Timestamp) || null,
    };
  });
}

export async function updatePost(postId: string, data: Partial<Pick<PostCreateData, "content" | "imageUrl">>): Promise<void> {
  const docRef = doc(db, "posts", postId);
  await updateDoc(docRef, data);
}

export async function deletePost(postId: string): Promise<void> {
  const docRef = doc(db, "posts", postId);
  await deleteDoc(docRef);
}

// ============ Like Functions ============

export async function toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }> {
  const docRef = doc(db, "posts", postId);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    throw new Error("Post not found");
  }

  const data = snap.data();
  const likedBy = (data.likedBy as string[]) || [];
  const isLiked = likedBy.includes(userId);

  if (isLiked) {
    await updateDoc(docRef, {
      likedBy: arrayRemove(userId),
      likesCount: increment(-1),
    });
    return { liked: false, likesCount: (data.likesCount as number) - 1 };
  } else {
    await updateDoc(docRef, {
      likedBy: arrayUnion(userId),
      likesCount: increment(1),
    });
    return { liked: true, likesCount: (data.likesCount as number) + 1 };
  }
}

// ============ Comment Functions ============

export async function addComment(data: CommentCreateData): Promise<string> {
  const commentsRef = collection(db, "comments");
  const docRef = await addDoc(commentsRef, {
    ...data,
    createdAt: serverTimestamp(),
  });

  // Increment comments count on the post
  const postRef = doc(db, "posts", data.postId);
  await updateDoc(postRef, {
    commentsCount: increment(1),
  });

  return docRef.id;
}

export async function getCommentsByPost(postId: string, limitCount: number = 50): Promise<CommentDocument[]> {
  const commentsRef = collection(db, "comments");
  const commentsQuery = query(
    commentsRef,
    where("postId", "==", postId),
    orderBy("createdAt", "asc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(commentsQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      postId: data.postId as string,
      authorId: data.authorId as string,
      authorName: data.authorName as string,
      content: data.content as string,
      createdAt: (data.createdAt as Timestamp) || null,
    };
  });
}

export async function deleteComment(commentId: string, postId: string): Promise<void> {
  const docRef = doc(db, "comments", commentId);
  await deleteDoc(docRef);

  // Decrement comments count on the post
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    commentsCount: increment(-1),
  });
}