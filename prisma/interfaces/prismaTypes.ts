// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT


export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}


export interface Groupp {
    id: string,
    name: string,
    description?: string,
    members: GrouppMembers[],
    leader?: Member,
    leaderId?: string,
    createdBy: User,
    createdById: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface Member {
    id: string,
    fullName: string,
    details?: string,
    groups: GrouppMembers[],
    leaderOf: Groupp[],
    createdBy: User,
    createdById: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface GrouppMembers {
    id: string,
    group?: Groupp,
    groupId?: string,
    member?: Member,
    memberId?: string,
    isLeader: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export interface Account {
    id: string,
    userId: string,
    type: string,
    provider: string,
    providerAccountId: string,
    refresh_token?: string,
    access_token?: string,
    expires_at?: number,
    token_type?: string,
    scope?: string,
    id_token?: string,
    session_state?: string,
    user: User,
}

export interface Session {
    id: string,
    sessionToken: string,
    userId: string,
    expires: Date,
    user: User,
}

export interface User {
    id: string,
    name?: string,
    email?: string,
    emailVerified?: Date,
    image?: string,
    accounts: Account[],
    sessions: Session[],
    role: Role,
    groups: Groupp[],
    members: Member[],
}

export interface VerificationToken {
    identifier: string,
    token: string,
    expires: Date,
}
