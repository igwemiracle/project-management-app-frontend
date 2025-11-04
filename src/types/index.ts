export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  owner?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  members: Array<{
    user: {
      _id: string;
      name: string;
      email: string;
    };
    role: string;
    _id: string;
  }>;
  boards: Array<{
    _id: string;
    title: string;
    description: string;
    createdBy: string;
    lists: string[];
    workspace: string;
    createdAt: string;
    updatedAt: string;
  }>;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface WorkspaceMember {
  user: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface Board {
  _id: string;
  title: string;
  description?: string;
  workspace: string | Workspace;
  color?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  _id: string;
  title: string;
  board: string;
  color: string;
  position?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  _id: string;
  title: string;
  description?: string;
  list: string;
  board: string;
  position: number;
  dueDate?: string;
  assignedTo: string[];
  labels: string[];
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
export interface Comment {
  _id: string;
  content: string;
  card: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  _id: string;
  action: string;
  entity: string;
  entityId: string;
  user: User;
  workspace?: string;
  board?: string;
  details?: Record<string, any>;
  createdAt: string;
}

export interface OnlineUser {
  userId: string;
  username: string;
  workspaceId?: string;
  boardId?: string;
}
