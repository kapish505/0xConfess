export async function evaluateSpice(message, engagement = {}) {
  const { likes = 0, dislikes = 0, comments = 0 } = engagement;

  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch("/api/evaluate-spice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        engagement: { likes, dislikes, comments }
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      score: data.score,
      label: data.label,
    };
  } catch (error) {
    console.error("Error evaluating spice:", error);
    // Fallback to simple calculation
    const engagementScore = likes * 2 + dislikes + comments * 1.5;
    const score = Math.min(Math.max(Math.round(engagementScore / 10 + 1), 1), 5);
    const labels = ["Mild", "Spicy", "Very Spicy", "Wild", "Nuclear"];
    return {
      score,
      label: labels[score - 1] || "Unrated",
    };
  }
}

export function scoreTopPosts(posts, commentsMap = {}) {
  return posts.map(post => {
    const commentCount = commentsMap[post.id]?.length || 0;
    const engagement = (post.likes || 0) * 2 + (post.dislikes || 0) + commentCount * 1.5;
    return { ...post, engagement };
  }).sort((a, b) => b.engagement - a.engagement);
}

export function scoreActiveUsers(posts) {
  const userMap = new Map();

  posts.forEach(p => {
    const addr = p.address?.toLowerCase();
    if (!addr) return;

    if (!userMap.has(addr)) {
      userMap.set(addr, { address: p.address, postsCount: 0, likesReceived: 0 });
    }

    const user = userMap.get(addr);
    user.postsCount += 1;
    user.likesReceived += (p.likes || 0);
  });

  return Array.from(userMap.values())
    .map(u => ({
      ...u,
      activityScore: u.postsCount * 3 + u.likesReceived * 2,
    }))
    .sort((a, b) => b.activityScore - a.activityScore);
}
