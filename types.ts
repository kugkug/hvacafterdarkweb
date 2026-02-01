export type Role = 'ADMIN' | 'MODERATOR' | 'TRUSTED' | 'MEMBER';

export interface User {
    id: string;
    username: string;
    email: string;
    phone: string;
    title?: string;
    company?: string;
    position?: string;
    bio?: string;
    yearsInIndustry?: number;
    role: Role;
    thumbsUpCount: number;
    profileVisibility: {
        company: boolean;
        position: boolean;
        bio: boolean;
    };
    allowPMs: boolean;
    isBanned: boolean;
    isLimited: boolean;
}

export interface Message {
    id: string;
    userId: string;
    username: string;
    content: string;
    timestamp: Date;
    replyToId?: string;
    isEdited: boolean;
    isDeleted: boolean;
    editedAt?: Date;
    attachments?: string[];
    history?: { content: string; editedAt: Date }[];
    thumbsUps: string[]; // User IDs who gave a thumbs up
}

export interface PrivateMessage {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
}

export interface ChatRoom {
    id: string;
    name: string;
    categoryId: string;
    description: string;
    isPending: boolean;
    createdBy: string;
}

export interface Category {
    id: string;
    name: string;
    isPending: boolean;
    createdBy: string;
}

export interface Post {
    id: string;
    userId: string;
    username: string;
    type: 'MEME' | 'FIND';
    imageUrl: string;
    caption: string;
    timestamp: Date;
    likes: number;
    isApproved: boolean;
}

export interface ModLogEntry {
    id: string;
    timestamp: Date;
    moderatorId: string;
    moderatorUsername: string;
    action:
        | 'MESSAGE_DELETE'
        | 'MESSAGE_EDIT'
        | 'USER_BAN'
        | 'USER_LIMIT'
        | 'POST_APPROVE'
        | 'POST_REJECT'
        | 'ROOM_APPROVE';
    targetId: string;
    targetName: string;
    details?: string;
}
