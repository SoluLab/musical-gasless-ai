import { BaseModel } from '@core/database';
import { Schema, model, Model, Document, ObjectId } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface StorageAttr {
    _id: ObjectId;
    storageLimit: number;
    storageUsed: number;
    storageType: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface UserStorageDoc extends BaseModel, Document {
    userId: ObjectId
    totalStorageUsed: number
    storage: StorageAttr[]
}

interface UserStorageModel extends Model<UserStorageDoc> {
    getById(id: string, projection?: any): Promise<UserStorageDoc | null>;
    getByUserId(userId: string): Promise<UserStorageDoc[]>;
}

const StorageSchema = new Schema<StorageAttr>(
    {
        storageLimit: { type: Number },
        storageUsed: { type: Number, default: 0 },
        storageType: { type: String, enum: ['ipfs', 's3', 'gc'] },
    },
    {
        _id: true,
        timestamps: true,
    }
);


const UserStorageSchema = new Schema<UserStorageDoc>(
    {
        userId: { type: ObjectId, required: true, ref: 'User' },
        totalStorageUsed: { type: Number, },
        storage: { type: [StorageSchema], default: [] },
    },
    {
        autoIndex: true,
        versionKey: false,
        timestamps: true,
    }
);

export const UserStorage = model<UserStorageDoc, UserStorageModel>('UserStorage', UserStorageSchema);