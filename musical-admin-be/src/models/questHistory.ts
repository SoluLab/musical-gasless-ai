import { BaseModel } from '@core/database';
import { Schema, model, Model, Document } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface QuestHistoryDoc extends BaseModel, Document {
    maxOccurrence: number;
    occurrence: number;
    points: number;
    questId: typeof ObjectId;
    creatorQuestId: typeof ObjectId;
    userId: typeof ObjectId;
}

interface QuestHistoryModel extends Model<QuestHistoryDoc> {
    getById(id: string, projection?: any): Promise<QuestHistoryDoc | null>;
    getByUserId(userId: string): Promise<QuestHistoryDoc[]>;
}

const QuestHistorySchema = new Schema<QuestHistoryDoc>(
    {
        points: { type: Number, required: true },
        maxOccurrence: { type: Number, required: true },
        occurrence: { type: Number, required: true },
        questId: { type: ObjectId, required: true, ref: 'Quest' },
        creatorQuestId: { type: ObjectId, required: true, ref: 'Quest' },
        userId: { type: ObjectId, required: true, ref: 'User' }
    },
    {
        autoIndex: true,
        versionKey: false,
        timestamps: true,
    }
);

export const QuestHistory = model<QuestHistoryDoc, QuestHistoryModel>('QuestHistory', QuestHistorySchema);