import { getPayload as getPayloadFn } from 'payload'
import config from '@payload-config'

export const getPayload = () => getPayloadFn({ config })
