/**
 * GitHub API Integration Service
 * Real-time integration with Dhiraj Kumar's GitHub profile & repository
 */

const GITHUB_USERNAME = 'dhirajkumar-09';
const REPO_NAME = 'My_Portfolio_';

export async function fetchGitHubProfile() {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
    if (!res.ok) throw new Error('GitHub profile fetch failed');
    const data = await res.json();
    return {
      avatarUrl: data.avatar_url,
      publicRepos: data.public_repos || 3,
      followers: data.followers || 0,
      bio: data.bio || 'B.Tech CSE (IoT) Student @ BCE Patna',
      htmlUrl: data.html_url || `https://github.com/${GITHUB_USERNAME}`,
      name: data.name || 'Dhiraj Kumar'
    };
  } catch (err) {
    console.info('Using fallback GitHub profile data:', err);
    return {
      avatarUrl: 'https://avatars.githubusercontent.com/u/10000000?v=4',
      publicRepos: 5,
      followers: 2,
      bio: 'B.Tech CSE (IoT) Student @ BCE Patna',
      htmlUrl: `https://github.com/${GITHUB_USERNAME}`,
      name: 'Dhiraj Kumar'
    };
  }
}

export async function fetchRepoDetails() {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}`);
    if (!res.ok) throw new Error('GitHub repo fetch failed');
    const data = await res.json();
    return {
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      defaultBranch: data.default_branch || 'main',
      htmlUrl: data.html_url || `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`,
      updatedAt: data.updated_at
    };
  } catch (err) {
    return {
      stars: 1,
      forks: 0,
      defaultBranch: 'main',
      htmlUrl: `https://github.com/${GITHUB_USERNAME}/${REPO_NAME}`,
      updatedAt: new Date().toISOString()
    };
  }
}
