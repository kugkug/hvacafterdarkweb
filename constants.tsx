import { Category, ChatRoom, Post, ModLogEntry } from './types';

export const ADMIN_EMAIL = 'admin@hvacafterdark.com';

export const MOCK_CATEGORIES: Category[] = [
    { id: 'c1', name: 'Shop Talk', isPending: false, createdBy: 'u1' },
    { id: 'c2', name: 'Tool Reviews', isPending: false, createdBy: 'u1' },
    {
        id: 'c3',
        name: 'Legit HVAC Questions',
        isPending: false,
        createdBy: 'u1'
    },
    { id: 'c4', name: 'Random Chill', isPending: false, createdBy: 'u1' }
];

export const MOCK_ROOMS: ChatRoom[] = [
    {
        id: 'r1',
        categoryId: 'c1',
        name: 'Commercial Chiller Issues',
        description: 'Deep dives into massive units.',
        isPending: false,
        createdBy: 'u1'
    },
    {
        id: 'r2',
        categoryId: 'c1',
        name: 'Residential Rooftops',
        description: 'Daily struggles on the tiles.',
        isPending: false,
        createdBy: 'u1'
    },
    {
        id: 'r3',
        categoryId: 'c3',
        name: 'Electrical Diagnostics',
        description: 'Multimeter masters only.',
        isPending: false,
        createdBy: 'u1'
    },
    {
        id: 'r4',
        categoryId: 'c4',
        name: 'The Breakroom',
        description: 'No talk about compressors here.',
        isPending: false,
        createdBy: 'u1'
    }
];

export const MOCK_MEMES: Post[] = [
    {
        id: 'm1',
        userId: 'u2',
        username: 'CompressorKing',
        type: 'MEME',
        imageUrl: 'https://picsum.photos/seed/meme1/600/400',
        caption: 'When the customer says "It worked yesterday"',
        timestamp: new Date(),
        likes: 45,
        isApproved: true
    },
    {
        id: 'm2',
        userId: 'u3',
        username: 'VoltageViking',
        type: 'MEME',
        imageUrl: 'https://picsum.photos/seed/meme2/600/400',
        caption: 'Wiring at 4:59 PM on a Friday',
        timestamp: new Date(),
        likes: 122,
        isApproved: true
    },
    {
        id: 'm3',
        userId: 'u1',
        username: 'FrostyTech',
        type: 'MEME',
        imageUrl: 'https://picsum.photos/seed/meme3/600/400',
        caption: 'The apprentice vs The 30 year vet',
        timestamp: new Date(),
        likes: 89,
        isApproved: true
    },
    {
        id: 'm4',
        userId: 'u1',
        username: 'FrostyTech',
        type: 'MEME',
        imageUrl: 'https://picsum.photos/seed/meme4/600/400',
        caption: 'Me looking at a unit from 1972',
        timestamp: new Date(),
        likes: 31,
        isApproved: true
    }
];

export const MOCK_FINDS: Post[] = [
    {
        id: 'f1',
        userId: 'u4',
        username: 'LeakSeeker',
        type: 'FIND',
        imageUrl: 'https://picsum.photos/seed/find1/600/400',
        caption: 'Never seen a squirrel nest in a heat exchanger before...',
        timestamp: new Date(),
        likes: 210,
        isApproved: true
    },
    {
        id: 'f2',
        userId: 'u2',
        username: 'CompressorKing',
        type: 'FIND',
        imageUrl: 'https://picsum.photos/seed/find2/600/400',
        caption: 'Bees. Why is it always bees?',
        timestamp: new Date(),
        likes: 67,
        isApproved: true
    },
    {
        id: 'f3',
        userId: 'u5',
        username: 'CapacitorCrusader',
        type: 'FIND',
        imageUrl: 'https://picsum.photos/seed/find3/600/400',
        caption: 'Someone really used duct tape as a primary sealant.',
        timestamp: new Date(),
        likes: 43,
        isApproved: true
    }
];

export const MOCK_MOD_LOGS: ModLogEntry[] = [
    {
        id: 'l1',
        timestamp: new Date(Date.now() - 172800000),
        moderatorId: 'u1',
        moderatorUsername: 'FrostyTech',
        action: 'POST_APPROVE',
        targetId: 'm1',
        targetName: 'Meme by CompressorKing',
        details: 'Verified safe content.'
    },
    {
        id: 'l2',
        timestamp: new Date(Date.now() - 86400000),
        moderatorId: 'u1',
        moderatorUsername: 'FrostyTech',
        action: 'USER_LIMIT',
        targetId: 'u2',
        targetName: 'CompressorKing',
        details: 'Excessive spamming in general channel.'
    }
];
