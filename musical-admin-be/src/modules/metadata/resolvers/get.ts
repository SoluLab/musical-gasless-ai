import { UserInputError } from 'apollo-server-errors'
import { App, Logger } from '@core/globals'
import { Storage } from '@google-cloud/storage'
import { cwd } from 'process';
import { resolve } from 'path'

interface Id {
	id: string
}

interface Context {
	dataSources: {
		Metadata: any
	}
}
const keyFilePath = resolve(cwd(), 'keys/gcs.json');
const AUDIO_BUCKET = App.Config.GOOGLE_CLOUD_STORAGE_AUDIO_BUCKET
const AUDIO_URL_EXPIRATION_TIME = App.Config.GOOGLE_CLOUD_STORAGE_AUDIO_URL_EXPIRATION_TIME

const storage = new Storage({
	keyFilename: keyFilePath,
});

const getAudioSignedUrl = async (name: string): Promise<string | null> => {
	const myBucket = storage.bucket(AUDIO_BUCKET)
	const myFile = myBucket.file(name)
	const fileExists = await myFile.exists()
	if (!fileExists) return null
	const options: any = {
		version: 'v4',
		action: 'read',
		expires: Date.now() + 1000 * parseInt(AUDIO_URL_EXPIRATION_TIME) * 60,
	}
	const [url] = await myFile.getSignedUrl(options)
	return url ? url : null
}

export const metadata = {
	Query: {
		async release(
			__: any,
			{ id }: Id,
			{ dataSources: { Metadata } }: Context,
			info: any
		): Promise<any> {
			Logger.info('Inside metadata Resolver')

			try {
				const metadata = await Metadata.getMetadata(id)
				if (!metadata) {
					throw new UserInputError('Metadata does not exist.')
				}
				const track = await App.Models.Track.findOne({ _id: metadata.track.trackId }).select('_id extension')
				const fileName = track ? `${track?._id?.toString()}.${track?.extension}` : null
				const audioUrl = await getAudioSignedUrl(fileName)
				return { metadata, audioUrl }

			} catch (err) {
				Logger.error(`${err.message}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	},
	Release: {
		async trackId(parent: any, __: any, { dataSources: { } }, info: any) {
			Logger.info('Inside trackId Resolver')
			try {
				const track = await App.Models.Track.findOne({ _id: parent?.track?.trackId?.toString() })
				return track
			} catch (err) {
				Logger.error(`${err}`)
				throw new UserInputError(`${err.message}`)
			}
		},
	}
}
