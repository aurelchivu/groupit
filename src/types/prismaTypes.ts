export interface Group {
  id: string;
  name: string;
  description?: string;
  members: GroupMembers[];
  leader?: Member;
  leaderId?: string;
  createdBy: {
    name?: string;
    email?: string;
  };
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id: string;
  fullName: string;
  details?: string | null;
  groups: GroupMembers[];
  leaderOf: Group[];
  createdBy: {
    name?: string;
    email?: string;
  };
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMembers {
  id: string;
  group?: Group;
  groupId?: string;
  member?: Member;
  memberId?: string;
  isLeader: boolean;
  createdAt: Date;
  updatedAt: Date;
}
