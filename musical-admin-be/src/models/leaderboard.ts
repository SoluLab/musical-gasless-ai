import { BaseModel } from '@core/database';
import { Schema, model, Model, Document } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface LeaderboardDoc extends BaseModel, Document {
    questPerformed: number;
    questPoints: number;
    eventPerformed: number;
    eventPoints: number;
    points: number;
    userId: typeof ObjectId;
}

interface LeaderboardModel extends Model<LeaderboardDoc> {
    getById(id: string, projection?: any): Promise<LeaderboardDoc | null>;
    getByUserId(userId: string): Promise<LeaderboardDoc[]>;
}

const LeaderboardSchema = new Schema<LeaderboardDoc>(
    {

        points: { type: Number, required: true },
        questPerformed: { type: Number, required: true },
        questPoints: { type: Number, required: true },
        eventPerformed: { type: Number, required: true },
        eventPoints: { type: Number, required: true },
        userId: { type: ObjectId, required: true, ref: 'User' },
        createdById: { type: ObjectId, required: true, ref: 'Admin' },
        updatedById: { type: ObjectId, required: true, ref: 'Admin' },
    },
    {
        autoIndex: true,
        versionKey: false,
        timestamps: true,
    }
);

export const Leaderboard = model<LeaderboardDoc, LeaderboardModel>('Leaderboard', LeaderboardSchema);