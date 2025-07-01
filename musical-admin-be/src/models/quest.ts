import { BaseModel } from '@core/database';
import { Schema, model, Model, Document } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface QuestDoc extends BaseModel, Document {
    name: string;
    isActive: boolean;
    isPublishByAdmin: boolean;
    isPublished: boolean;
    occurrence: number;
    identifier: string;
    description: string;
    points: number;
}

interface QuestModel extends Model<QuestDoc> {
    getById(id: string, projection?: any): Promise<QuestDoc | null>;
    getByUserId(userId: string): Promise<QuestDoc[]>;
}

const QuestSchema = new Schema<QuestDoc>(
    {
        name: { type: String, required: true },
        description: { type: String },
        identifier: { type: String, required: true },
        points: { type: Number, required: true },
        occurrence: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
        isPublished: { type: Boolean, default: false },
        isPublishByAdmin: { type: Boolean, default: true },
        createdById: { type: ObjectId, required: true, ref: 'Admin' },
        updatedById: { type: ObjectId, required: true, ref: 'Admin' },
    },
    {
        autoIndex: true,
        versionKey: false,
        timestamps: true,
    }
);

export const Quest = model<QuestDoc, QuestModel>('Quest', QuestSchema);