
export interface Note {
    id: string;
    ownerId: string;
    title: string;
    color: string;
    content: string;
    createdAt?: Date | { toMillis: () => number };
    updatedAt?: Date | { toMillis: () => number };
}
