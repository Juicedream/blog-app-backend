/**
 * Node modules
 */

import { Schema, model, Types } from 'mongoose';

/**
 * Types
 */
export interface ILike {
    blogId?: Types.ObjectId;
    userId: Types.ObjectId;
    comment: Types.ObjectId;
}

const likeSchema = new Schema <ILike>({
    blogId: {
        type: Schema.Types.ObjectId,
        
    },
    comment: {
        type: Schema.Types.ObjectId,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

export default model<ILike>('like', likeSchema);