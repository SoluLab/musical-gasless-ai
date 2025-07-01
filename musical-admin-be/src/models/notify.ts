import { Schema, model, Model, Document } from 'mongoose'
import { BaseModel } from '@core/database'

const { ObjectId } = Schema.Types

// TS Interface for Notify attributes used in creation
export interface NotifyAttrs {
    type: string
    from: typeof ObjectId
    to: typeof ObjectId
    resource: typeof ObjectId
    viewed: boolean
    data: {
        distroId: string
    }
}

// Document interface extends Mongoose Document and BaseModel
export interface NotifyDoc extends Document, BaseModel {
    id: typeof ObjectId
    type: string
    from: typeof ObjectId
    to: typeof ObjectId
    resource: typeof ObjectId
    viewed: boolean
    data: {
        distroId: string
    }
}

// Custom model interface
interface NotifyModel extends Model<NotifyDoc> {
    build(attrs: NotifyAttrs): Promise<NotifyDoc>
}

// Mongoose Schema
const notifySchema = new Schema<NotifyDoc>(
    {
        type: { type: String, required: true },
        from: { type: ObjectId, ref: 'User', required: true },
        to: { type: ObjectId, ref: 'User', required: true },
        resource: { type: ObjectId, ref: 'LiveStream', required: true },
        viewed: { type: Boolean, default: false },
        data: {
            distroId: { type: String, required: true },
        },
    },
    {
        autoIndex: true,
        versionKey: false,
        timestamps: true,
    }
)

// Static method to build a new notification
notifySchema.statics.build = async function (attrs: NotifyAttrs) {
    const notify = new Notify(attrs)
    await notify.save()
    return notify
}

// Model
export const Notify = model<NotifyDoc, NotifyModel>('Notify', notifySchema)
