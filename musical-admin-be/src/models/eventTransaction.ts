import { BaseModel } from '@core/database';
import { Schema, model, Model, Document, ObjectId } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface EventTransactionDoc extends BaseModel, Document {
    eventName: string;
    points: number;
    occurrence: number;
    maxOccurrence: number;
    eventId: ObjectId
    userId: ObjectId
    creatorQuestId: ObjectId
    questId: ObjectId
}

interface EventTransactionModel extends Model<EventTransactionDoc> {
    getById(id: string, projection?: any): Promise<EventTransactionDoc | null>;
    getByUserId(userId: string): Promise<EventTransactionDoc[]>;
}

const EventTransactionSchema = new Schema<EventTransactionDoc>(
    {
        eventName: { type: String, required: true },
        points: { type: Number, required: true },
        occurrence: { type: Number, required: true },
        maxOccurrence: { type: Number, required: true },
        eventId: { type: ObjectId, required: true, ref: 'GamificationEvent' },
        userId: { type: ObjectId, required: true, ref: 'User' },
        creatorQuestId: { type: ObjectId, required: true, ref: 'Quest' },
        questId: { type: ObjectId, required: true, ref: 'Quest' },
    },
    {
        autoIndex: true,
        versionKey: false,
        timestamps: true,
    }
);

export const EventTransaction = model<EventTransactionDoc, EventTransactionModel>('EventTransaction', EventTransactionSchema);