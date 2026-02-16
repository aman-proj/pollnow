export const mockPolls = {
  abc123: {
    id: "abc123",
    question: "What's the best frontend framework in 2026?",
    options: [
      { id: "1", text: "React / Next.js", votes: 142 },
      { id: "2", text: "Vue / Nuxt", votes: 88 },
      { id: "3", text: "Svelte / SvelteKit", votes: 67 },
      { id: "4", text: "Angular", votes: 31 },
    ],
    totalVotes: 328,
    createdAt: "2026-02-15T10:00:00Z",
    createdBy: "alex",
  },
  def456: {
    id: "def456",
    question: "Preferred way to style components?",
    options: [
      { id: "1", text: "Tailwind CSS", votes: 215 },
      { id: "2", text: "CSS Modules", votes: 80 },
      { id: "3", text: "Styled Components", votes: 55 },
      { id: "4", text: "Vanilla CSS", votes: 30 },
    ],
    totalVotes: 380,
    createdAt: "2026-02-14T08:30:00Z",
    createdBy: "alex",
  },
  ghi789: {
    id: "ghi789",
    question: "Best state management for React?",
    options: [
      { id: "1", text: "Zustand", votes: 180 },
      { id: "2", text: "Redux Toolkit", votes: 95 },
      { id: "3", text: "Jotai / Recoil", votes: 72 },
      { id: "4", text: "React Context", votes: 53 },
    ],
    totalVotes: 400,
    createdAt: "2026-02-13T14:00:00Z",
    createdBy: "jordan",
  },
  jkl012: {
    id: "jkl012",
    question: "Favorite deployment platform?",
    options: [
      { id: "1", text: "Vercel", votes: 260 },
      { id: "2", text: "Netlify", votes: 110 },
      { id: "3", text: "Railway", votes: 75 },
      { id: "4", text: "AWS", votes: 55 },
    ],
    totalVotes: 500,
    createdAt: "2026-02-12T09:00:00Z",
    createdBy: "sam",
  },
  mno345: {
    id: "mno345",
    question: "What editor do you use?",
    options: [
      { id: "1", text: "VS Code", votes: 310 },
      { id: "2", text: "Cursor", votes: 145 },
      { id: "3", text: "Neovim", votes: 95 },
      { id: "4", text: "WebStorm", votes: 50 },
    ],
    totalVotes: 600,
    createdAt: "2026-02-11T16:00:00Z",
    createdBy: "alex",
  },
  pqr678: {
    id: "pqr678",
    question: "Best backend runtime?",
    options: [
      { id: "1", text: "Node.js", votes: 190 },
      { id: "2", text: "Bun", votes: 170 },
      { id: "3", text: "Deno", votes: 60 },
      { id: "4", text: "Go", votes: 80 },
    ],
    totalVotes: 500,
    createdAt: "2026-02-10T11:00:00Z",
    createdBy: "jordan",
  },
  stu901: {
    id: "stu901",
    question: "Preferred database for web apps?",
    options: [
      { id: "1", text: "PostgreSQL", votes: 275 },
      { id: "2", text: "MongoDB", votes: 120 },
      { id: "3", text: "SQLite", votes: 90 },
      { id: "4", text: "Supabase (Postgres)", votes: 165 },
    ],
    totalVotes: 650,
    createdAt: "2026-02-09T13:30:00Z",
    createdBy: "sam",
  },
  vwx234: {
    id: "vwx234",
    question: "Dark mode or light mode?",
    options: [
      { id: "1", text: "Dark mode always", votes: 340 },
      { id: "2", text: "Light mode always", votes: 85 },
      { id: "3", text: "System preference", votes: 175 },
    ],
    totalVotes: 600,
    createdAt: "2026-02-08T10:00:00Z",
    createdBy: "alex",
  },
  yza567: {
    id: "yza567",
    question: "Best AI coding assistant?",
    options: [
      { id: "1", text: "GitHub Copilot", votes: 200 },
      { id: "2", text: "Claude", votes: 280 },
      { id: "3", text: "Cursor AI", votes: 170 },
      { id: "4", text: "ChatGPT", votes: 150 },
    ],
    totalVotes: 800,
    createdAt: "2026-02-07T09:00:00Z",
    createdBy: "jordan",
  },
  bcd890: {
    id: "bcd890",
    question: "Tabs or spaces?",
    options: [
      { id: "1", text: "Tabs", votes: 220 },
      { id: "2", text: "Spaces (2)", votes: 280 },
      { id: "3", text: "Spaces (4)", votes: 150 },
    ],
    totalVotes: 650,
    createdAt: "2026-02-06T15:00:00Z",
    createdBy: "sam",
  },
};

// Mock user data
export const mockUser = {
  name: "Alex Chen",
  email: "alex@example.com",
  avatar: null,
  createdPolls: ["abc123", "def456", "mno345", "vwx234"],
  votedPolls: ["ghi789", "jkl012", "pqr678", "yza567", "bcd890"],
};

export function getPoll(id) {
  return mockPolls[id] || null;
}

export function getAllPolls() {
  return Object.values(mockPolls);
}

export function getMyPolls() {
  return mockUser.createdPolls.map((id) => mockPolls[id]).filter(Boolean);
}

export function getVotedPolls() {
  return mockUser.votedPolls.map((id) => mockPolls[id]).filter(Boolean);
}

export function getLeaderboard() {
  return Object.values(mockPolls)
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 10);
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}
