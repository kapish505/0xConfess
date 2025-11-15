import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  runTransaction,
  doc,
  deleteDoc,
  where,
  updateDoc,
} from "firebase/firestore";
import { db, isConfigured } from "./firebase.js";
import { evaluateSpice } from "./ai.js";

const POSTS_COLLECTION = "posts";
const COMMENTS_COLLECTION = "comments";

export async function createPost(postData) {
  if (!isConfigured) {
    console.warn("Firebase not configured - demo mode active");
    return Promise.resolve();
  }
  
  try {
    // Evaluate spice score
    const spiceResult = await evaluateSpice(postData.message, {
      likes: 0,
      dislikes: 0,
      comments: 0,
    });

    await addDoc(collection(db, POSTS_COLLECTION), {
      message: postData.message,
      address: postData.address.toLowerCase(),
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      signature: postData.signature || null,
      spiceScore: spiceResult.score,
      spiceLabel: spiceResult.label,
    });
  } catch (error) {
    if (error.code === "permission-denied") {
      console.warn("⚠️ Firestore permission denied - falling back to demo mode");
      throw new Error("PERMISSION_DENIED");
    }
    throw error;
  }
}

export function subscribeToPostsExclude(
  callback,
  onPermissionError
) {
  if (!isConfigured) {
    console.warn("Firebase not configured - no real-time updates available");
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, POSTS_COLLECTION),
    orderBy("timestamp", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const posts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          message: data.message,
          address: data.address,
          timestamp: data.timestamp,
          likes: data.likes || 0,
          dislikes: data.dislikes || 0,
          likedBy: data.likedBy || [],
          dislikedBy: data.dislikedBy || [],
          signature: data.signature,
          ensName: data.ensName,
          spiceScore: data.spiceScore || 1,
          spiceLabel: data.spiceLabel || "Unrated",
        };
      });
      callback(posts);
    },
    (error) => {
      console.error("Firestore subscription error:", error);
      
      if (error.code === "permission-denied") {
        console.warn(
          "⚠️ Firestore permission denied!\n\n" +
          "Please configure Firestore security rules in Firebase Console.\n" +
          "See FIREBASE_SETUP.md for detailed instructions.\n\n" +
          "Falling back to demo mode with local state only."
        );
        
        if (onPermissionError) {
          onPermissionError();
        }
      }
      
      callback([]);
    }
  );
}

export async function toggleLike(postId, userAddress) {
  if (!isConfigured) {
    console.warn("Firebase not configured - demo mode active");
    return Promise.resolve();
  }

  const postRef = doc(db, POSTS_COLLECTION, postId);
  const normalizedAddress = userAddress.toLowerCase();

  try {
    await runTransaction(db, async (transaction) => {
      const postDoc = await transaction.get(postRef);
      
      if (!postDoc.exists()) {
        throw new Error("Post does not exist");
      }

      const data = postDoc.data();
      const likedBy = data.likedBy || [];
      const dislikedBy = data.dislikedBy || [];
      const hasLiked = likedBy.includes(normalizedAddress);
      const hasDisliked = dislikedBy.includes(normalizedAddress);

      let newLikes = data.likes || 0;
      let newDislikes = data.dislikes || 0;
      let newLikedBy = [...likedBy];
      let newDislikedBy = [...dislikedBy];

      if (hasLiked) {
        newLikes--;
        newLikedBy = newLikedBy.filter(addr => addr !== normalizedAddress);
      } else {
        newLikes++;
        newLikedBy.push(normalizedAddress);
        
        if (hasDisliked) {
          newDislikes--;
          newDislikedBy = newDislikedBy.filter(addr => addr !== normalizedAddress);
        }
      }

      // Re-evaluate spice based on new engagement
      const spiceResult = await evaluateSpice(data.message, {
        likes: Math.max(0, newLikes),
        dislikes: Math.max(0, newDislikes),
        comments: data._commentCount || 0,
      });

      transaction.update(postRef, {
        likes: Math.max(0, newLikes),
        dislikes: Math.max(0, newDislikes),
        likedBy: newLikedBy,
        dislikedBy: newDislikedBy,
        spiceScore: spiceResult.score,
        spiceLabel: spiceResult.label,
      });
    });
  } catch (error) {
    if (error.code === "permission-denied") {
      console.warn("⚠️ Firestore permission denied - falling back to demo mode");
      throw new Error("PERMISSION_DENIED");
    }
    throw error;
  }
}

export async function toggleDislike(postId, userAddress) {
  if (!isConfigured) {
    console.warn("Firebase not configured - demo mode active");
    return Promise.resolve();
  }

  const postRef = doc(db, POSTS_COLLECTION, postId);
  const normalizedAddress = userAddress.toLowerCase();

  try {
    await runTransaction(db, async (transaction) => {
      const postDoc = await transaction.get(postRef);
      
      if (!postDoc.exists()) {
        throw new Error("Post does not exist");
      }

      const data = postDoc.data();
      const likedBy = data.likedBy || [];
      const dislikedBy = data.dislikedBy || [];
      const hasLiked = likedBy.includes(normalizedAddress);
      const hasDisliked = dislikedBy.includes(normalizedAddress);

      let newLikes = data.likes || 0;
      let newDislikes = data.dislikes || 0;
      let newLikedBy = [...likedBy];
      let newDislikedBy = [...dislikedBy];

      if (hasDisliked) {
        newDislikes--;
        newDislikedBy = newDislikedBy.filter(addr => addr !== normalizedAddress);
      } else {
        newDislikes++;
        newDislikedBy.push(normalizedAddress);
        
        if (hasLiked) {
          newLikes--;
          newLikedBy = newLikedBy.filter(addr => addr !== normalizedAddress);
        }
      }

      // Re-evaluate spice based on new engagement
      const spiceResult = await evaluateSpice(data.message, {
        likes: Math.max(0, newLikes),
        dislikes: Math.max(0, newDislikes),
        comments: data._commentCount || 0,
      });

      transaction.update(postRef, {
        likes: Math.max(0, newLikes),
        dislikes: Math.max(0, newDislikes),
        likedBy: newLikedBy,
        dislikedBy: newDislikedBy,
        spiceScore: spiceResult.score,
        spiceLabel: spiceResult.label,
      });
    });
  } catch (error) {
    if (error.code === "permission-denied") {
      console.warn("⚠️ Firestore permission denied - falling back to demo mode");
      throw new Error("PERMISSION_DENIED");
    }
    throw error;
  }
}

export async function addComment(postId, message, address, signature) {
  if (!isConfigured) {
    console.warn("Firebase not configured - demo mode active");
    return { id: `comment-${Date.now()}` };
  }

  try {
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
      postId,
      message,
      address: address.toLowerCase(),
      timestamp: Date.now(),
      signature: signature || null,
    });

    return { id: docRef.id };
  } catch (error) {
    if (error.code === "permission-denied") {
      console.warn("⚠️ Firestore permission denied - falling back to demo mode");
      throw new Error("PERMISSION_DENIED");
    }
    throw error;
  }
}

export function subscribeToComments(postId, callback) {
  if (!isConfigured) {
    console.warn("Firebase not configured - no real-time comments available");
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, COMMENTS_COLLECTION),
    where("postId", "==", postId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const comments = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          postId: data.postId,
          message: data.message,
          address: data.address,
          timestamp: data.timestamp,
          signature: data.signature,
        };
      });
      
      comments.sort((a, b) => b.timestamp - a.timestamp);
      
      callback(comments);
    },
    (error) => {
      console.error("Comments subscription error:", error);
      if (error.code === "permission-denied") {
        console.warn("⚠️ Firestore permission denied for comments");
      }
      callback([]);
    }
  );
}

export async function deleteComment(commentId) {
  if (!isConfigured) {
    console.warn("Firebase not configured - demo mode active");
    return Promise.resolve();
  }

  try {
    await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));
  } catch (error) {
    if (error.code === "permission-denied") {
      console.warn("⚠️ Firestore permission denied - falling back to demo mode");
      throw new Error("PERMISSION_DENIED");
    }
    throw error;
  }
}
